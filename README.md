test-device-manager
===================

Keep alive connections from several browsers being tested, and redirect them to a test server on command.

Usage:

1. Download zip. You can npm install from the unzipped folder if you like.

2. Edit **config.json** to match your setup:
  * **server_name**: What you want to call your server (type: string).
  * **listen_port**: port where the Test Device Manager is listening for new connections (type: number, should be a valid tcp_port).
  * **default_redirect_url**: Default URL for your test server where the test clients will be sent (type: string, should be a valid URL).

3. Start up test device manager using either:  
    **npm start test-device-manager**  or,  
    **node server.js**

4. Connect a control client to http://your.server.hostname:listen_port/control
    i.e. point a browser to the above URL.

5. Connect as many test clients as you like to http://your.server.hostname:listen_port/
    i.e. point one or more browsers you want to run tests against to the above URL.

6. Go to the control client and select one or more of the connected test clients.

7. Put the URL of your test server in the input box. This could be a Karma server, for example.

8. Hit GO!

9. All the selected test clients will be redirected to the test server,
      with a query parameter: **return_url=http://your.server.hostname:listen_port/**

10. After running the tests, your test server should use the **return_url** to send the clients back to the test device manager. 
      (This functionality is built into recent versions of Karma).

