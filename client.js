var tdm_server_socket;

$(function() {
  var socket = io.connect(location.hostname);
  socket.on('server_hello', server_hello_handler);
  socket.on('message', message_handler);
  socket.on('redirect', redirect_handler);
  socket.on('disconnect', disconnect_handler);
});

function server_hello_handler(data) {
  tdm_server_socket = this;
  tdm_server_socket.emit('client_hello', {user_agent: navigator.userAgent});
  $('#client_name_div').empty();
  $('#client_name_div').append('<h2>Client Name: ' +
      data.client_name + '</h2>');
  $('#server_status_div').empty();
  $('#server_status_div').append(
      '<h2 style="color:green">Connected to Server: ' +
          data.server_name + '</h2>');
}

function disconnect_handler() {
  $('#server_status_div').empty();
  $('#server_status_div').append(
      '<h2 style="color:red">Server Disconnected.</h2>');
}

function message_handler(data) {
  message_area = $('#message_area');
  var current_text = message_area.val();
  message_area.val(current_text + '\n' + data.msg);
  message_area.scrollTop(message_area[0].scrollHeight - message_area.height());
}

function redirect_handler(data) {
  location.replace(data.url + '?return_url=' +
      encodeURIComponent(location.href));
}
