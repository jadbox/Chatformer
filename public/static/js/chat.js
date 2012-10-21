define(["auth", "sockjs", 'underscore', 'backbone'], function(auth) {
	var conn = null;
	var status = $('#status');
	var ret = {
		"connected":false
	}; _.extend(ret, Backbone.Events);

	function connect(SockJS) {
		if(isAuth() == false) return;
		disconnect();
		flog_navStart("socket");
		var transports = ['websocket', 'xhr-streaming', 'xhr-polling', 'jsonp-polling', 'xdr-streaming', 'xdr-polling', 'iframe-eventsource', 'iframe-htmlfile'];

		conn = new SockJS('http://' + window.location.hostname + ':8080/chat', transports);
		//log('Connecting...');
		conn.onopen = function() {
			//log('Connected.');
			update_ui();
			ret.connected = true;
		};

		conn.onmessage = function(e) {
			handleCommand(e.data, msgToApp, 0, delayed_stream)
		};

		conn.onclose = function() {
			log('Disconnected.');
			auth_logout()
			conn = null;
			ret.connected = false;
			update_ui();
		};
	}

	function disconnect() {
		if(conn != null) {
			log('Disconnecting...');

			conn.close();
			conn = null;

			update_ui();
		}
	}

	function isConnected() {
		return(conn != null && conn.readyState == SockJS.OPEN);
	}

	function update_ui() {
		if(isConnected() == false) status.text('disconnected');
		else status.text('connected (' + conn.protocol + ')');
	}
	function send(msg) {
		if(!auth.isLoggedIn()) return;
		conn.send(msg.data);
	}
	
	ret.on("send", send);
	return ret;
})