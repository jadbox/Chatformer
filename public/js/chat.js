define(["auth", "views/footerlog", "apps/msg", "sockjs", 'underscore', 'backbone'], function(auth, flog) {
	var conn = null;
	var status = $('#status');
	var ret = {
		"room": {id:"lobby"},
		"connected":false
	}; _.extend(ret, Backbone.Events);

	function connect() {
		if(auth.isLoggedIn() == false) return;
		disconnect();
		var transports = ['websocket', 'xhr-streaming', 'xhr-polling', 'jsonp-polling', 'xdr-streaming', 'xdr-polling', 'iframe-eventsource', 'iframe-htmlfile'];

		conn = new SockJS('http://' + window.location.hostname + ':8080/chat', transports);
		
		conn.onopen = function() {
			flog.log('socket');
			update_ui();
			ret.connected = true;
		};

		conn.onmessage = function(e) {
			var msg = Msg(e.data);
			//alert(msg.toString());
			ret.trigger("recieve", msg); // global
			if(msg.type=="app") ret.trigger("onApp", msg);
			else if(msg.type=="txt") ret.trigger("onTxt", msg);
			else if(msg.type=="sys") ret.trigger("onSys", msg);
		};

		conn.onclose = function() {
			//auth.logout()
			conn = null;
			ret.connected = false;
			update_ui();
		};
	}

	function disconnect() {
		if(conn != null) {
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
		if(!auth.isLoggedIn()) {
			if(msg.type=="app") ret.trigger("onApp", msg); // to auth app
			return;
		}
		//if(msg.type=="sys") {
		//	if(msg.cmd=="room") room = msg.msg;
		//	else return;
		//}

		conn.send(msg.data);
	}

	ret["connect"] = connect;
	ret.on("send", send);
	return ret;
})