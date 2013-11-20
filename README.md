test-device-manager
===================

Keep alive connections from several browsers being tested, and redirect them to a test server on command.

Usage:

1. Download zip. You can npm install from the unzipped folder if you like.

2. Edit config.json to match your setup:
    'server_name': What you want to call your server (type: string).
    'listen_port': port where the Test Device Manager is listening for new connections (type: tcp_port).
    'default_redirect_url': Default URL for your test server where the test clients will be sent (type: URL).

3. Start up test device manager using:
    npm start test-device-manager  OR,
    node server.js

4. Connect a control client to http://your.server.hostname:listen_port/control
    i.e. point a browser to the above URL.

5. Connect as many test clients as you like to http://your.server.hostname:listen_port/
    i.e. point one or more browsers you want to test to the above URL.

6. Go to the control client and select one or more test clients.

7. Put the URL of the test server in the input box.

8. Hit GO!

9. All the selected test clients will be redirected to the test server,
      with a query parameter: return_url=http://your.server.hostname:listen_port/

10. Your test server should use the return_url to send the clients back to the test device manager.

