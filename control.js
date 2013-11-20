var tdm_server_socket;

$(function() {
  var socket = io.connect(location.hostname);
  socket.on('server_hello', server_hello_handler);
  socket.on('client_list', client_list_handler);
  socket.on('redirect_url', redirect_url_handler);
  socket.on('message', message_handler);
  socket.on('disconnect', disconnect_handler);
});

function server_hello_handler(data) {
  tdm_server_socket = this;
  tdm_server_socket.emit('control_client_hello',
                         {user_agent: navigator.userAgent});
  $('#client_name_div').empty();
  $('#client_name_div').append(
      '<h2>Control Client Name: ' + data.client_name + '</h2>');
  $('#server_status_div').empty();
  $('#server_status_div').append(
      '<h2 style="color:green">Connected to Server: ' +
      data.server_name + '</h2>');
}

function redirect_url_handler(data) {
  $('#redirect_url').val(data.url);
}

function disconnect_handler() {
  $('#server_status_div').empty();
  $('#server_status_div').append(
      '<h2 style="color:red">Server Disconnected.</h2>');
}

function client_list_handler(data) {
  var clients = data;
  var ul = $('#client_list');
  ul.empty();

  console.log('getting here A');
  console.log(clients);
  if ($.isEmptyObject(clients)) {
    li = '<li>There are no connected clients.</li>';
    ul.append(li);
    return;
  }

  for (var client in clients) {
    li = '<li> <input type="checkbox" name="checkboxlist" ' +
        'class="client" value="' +
        client + '" />' + client + ': <span class="ua">' +
            clients[client].user_agent + '</span></li>';
    ul.append(li);
  }
}

function message_handler(data) {
  message_area = $('#message_area');
  var current_text = message_area.val();
  message_area.val(current_text + '\n' + data.msg);
  message_area.scrollTop(message_area[0].scrollHeight - message_area.height());
}

function go() {
  var checked_client_list = [];
  $('input:checked').map(function() {
    checked_client_list.push(this.value);
  });
  url = $('#redirect_url').val();
  tdm_server_socket.emit('go', {url: url, client_list: checked_client_list});
}

function select_all_clients() {
  $('#client_list').find(':checkbox').prop('checked', true);
}

function deselect_all_clients() {
  $('#client_list').find(':checkbox').prop('checked', false);
}
