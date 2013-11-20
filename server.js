var server = require('http').createServer(handler);
var url = require('url');
var io = require('socket.io').listen(server);
var fs = require('fs');
var version = '0.1 20131119';

var config = require('./config.json');

server.listen(config.listen_port);
io.set('log level', 1);

function handler(req, res) {
  var pathname = url.parse(req.url).pathname;
  if (pathname == '/favicon.ico') {
    res.writeHead(404);
    return res.end('Not Found.');
  }
  else if (pathname == '/client.js') {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
  } else if (pathname == '/control.js') {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
  } else if (pathname == '/control.html' || pathname == '/control') {
    pathname = '/control.html';
    res.writeHead(200, {'Content-Type': 'text/html'});
  } else {
    pathname = '/index.html';
    res.writeHead(200, {'Content-Type': 'text/html'});
  }

  fs.readFile(__dirname + pathname,
              function(err, data) {
                if (err) {
                  res.writeHead(500);
                  return res.end('Error loading: ' + filename);
                }
                res.end(data);
              });
}

function Client(socket, user_agent) {
  this.socket = socket;
  this.user_agent = user_agent;
}

var clients = {};
var control_clients = {};

io.sockets.on('connection', connect_handler);

function get_client_name(socket) {
  return socket.id.substring(0, 8);
}

// All clients **********************************************
function connect_handler(socket) {
  socket.on('client_hello', client_hello_handler);
  socket.on('control_client_hello', control_client_hello_handler);
  socket.on('disconnect', disconnect_handler);
  socket.on('go', go_handler);
  socket.emit('server_hello',
              {server_name: config.server_name,
               client_name: get_client_name(socket)});
}

function disconnect_handler() {
  var socket = this;
  if (socket.tdm_control_client) {
    control_client_disconnect_handler(socket);
    return;
  }
  client_disconnect_handler(socket);
}

// Regular (non-control) clients ****************************
function client_disconnect_handler(socket) {
  var client_name = get_client_name(socket);
  delete clients[client_name];
  broadcast_client_list();
  broadcast_message('client disconnected: ' + client_name);
}

function client_hello_handler(data) {
  var socket = this;
  var client_name = get_client_name(socket);
  clients[client_name] = new Client(socket, data.user_agent);
  socket.tdm_control_client = false;
  broadcast_client_list();
  send_message(socket, 'TDM Version: ' + version);
  broadcast_message('client connected: ' + client_name);
}

// Control clients ******************************************
function control_client_hello_handler(data) {
  var socket = this;
  var client_name = get_client_name(socket);
  control_clients[client_name] = new Client(socket, data.user_agent);
  socket.tdm_control_client = true;
  send_client_list(socket);
  send_message(socket, 'TDM Version: ' + version);
  broadcast_message('control client connected: ' + client_name);
  socket.emit('redirect_url', {url: config.default_redirect_url});
}

function control_client_disconnect_handler(socket) {
  var client_name = get_client_name(socket);
  delete control_clients[client_name];
  broadcast_message('control_client disconnected: ' + client_name);
}

function send_client_list(socket)
{
  var client_list = {};
  for (var client in clients) {
    client_list[client] = {user_agent: clients[client].user_agent};
  }
  socket.emit('client_list', client_list);
}

function broadcast_client_list() {
  var client_list = {};
  for (var client in clients) {
    client_list[client] = {user_agent: clients[client].user_agent};
  }

  for (var cc in control_clients) {
    control_clients[cc].socket.emit('client_list', client_list);
  }
}

function send_message(socket, msg) {
  socket.emit('message', {msg: msg});
}

function broadcast_message(msg) {
  io.sockets.emit('message', {msg: msg});
}


// **********************************************************
function go_handler(data) {
  var client_list = data.client_list;
  var redirect_url = data.url;

  if (client_list.length == 0) {
    broadcast_message('go: <empty client list>');
    return;
  }

  if (redirect_url == '') {
    broadcast_message('go: <missing url>');
    return;
  }

  broadcast_message('go client_list: ' + client_list);
  broadcast_message('go url: ' + redirect_url);

  for (var i = 0; i < client_list.length; i++) {
    clients[client_list[i]].socket.emit('redirect', {url: redirect_url});
  }
}
