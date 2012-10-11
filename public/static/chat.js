var conn = null;

function connect() {
	if(isAuth()==false) return;
	disconnect();
	flog_navStart("socket");
	var transports = ['websocket', 'xhr-streaming', 'xhr-polling', 'jsonp-polling', 'xdr-streaming', 'xdr-polling', 'iframe-eventsource','iframe-htmlfile']; 
	
	conn = new SockJS('http://'+window.location.hostname+':8080/chat', transports);
	//log('Connecting...');

	conn.onopen = function() {
		//log('Connected.');
		update_ui();
	};

	conn.onmessage = function(e) {
		handleCommand(e.data, msgToApp, 0, delayed_stream)
	};

	conn.onclose = function() {
		log('Disconnected.');
		auth_logout()
		conn = null;
		update_ui();
	};
}

function disconnect() {
	if (conn != null) {
		log('Disconnecting...');

		conn.close();
		conn = null;

		update_ui();
	}
}

function isConnected() {
	return (conn != null && conn.readyState == SockJS.OPEN);
}
function update_ui() {
	var msg = '';

	if (isConnected()==false) {
		$('#status').text('disconnected');
		//$('#connect').text('Connect');
		///$("#inner-chatlayout").find("input").prop('disabled', true);
	} else {
		$('#status').text('connected (' + conn.protocol + ')');
		//$('#connect').text('Disconnect');
		///$("#inner-chatlayout").find("input").prop('disabled', false);
	}
}

$(function() {
	$('#reset').click(function() {
		$('#chatlog').html('');
	});
	/*
	$('#connect').click(function() {
		if (conn == null) {
			connect();
		} else {
			disconnect();
		}

		update_ui();
		return false;
	});
	*/
	$('#chatform').submit(function() {
		var msg = $('#chatinput').val();
		msg = msg.replace(/<(?:.|\n)*?>/gm, '');
		if(isSysMsg(msg) == true) {
			return false; // no sys msgs allowed
		}
		else if(isAppMsg(msg)==true) {
			var a = msg.split(" ");
			log('<i>sent to app: '+a[0]+'</i>');
		}
		
		if (isConnected()) {
			conn.send(getName() + ": " + msg);
		} else handleCommand(msg, msgToApp, 0, function(e) {
			log("Chatting not allowed until your logged in!")
		}); //offline
		
		$('#chatinput').val('').focus();
		return false;
	});
});