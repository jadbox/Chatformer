var conn = null;

function log(msg) {
	var control = $('#chatlog');
	control.html(msg + '<br/>'+control.html());
	control.scrollTop(control.scrollTop() + 1000);
}

function connect() {
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
		handleCommand(e.data, msgToApp, 0, log)
	};

	conn.onclose = function() {
		log('Disconnected.');
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

function update_ui() {
	var msg = '';

	if (conn == null || conn.readyState != SockJS.OPEN) {
		$('#status').text('disconnected');
		$('#connect').text('Connect');
	} else {
		$('#status').text('connected (' + conn.protocol + ')');
		$('#connect').text('Disconnect');
	}
}

$(function() {
	$('#reset').click(function() {
		$('#chatlog').html('');
	});
	$('#connect').click(function() {
		if (conn == null) {
			connect();
		} else {
			disconnect();
		}

		update_ui();
		return false;
	});

	$('#chatform').submit(function() {
		var msg = $('#chatinput').val();
		if(isSysMsg(msg) == true) {
			return; // no sys msgs allowed
		}
		else if(isAppMsg(msg)==true) {
			log('>> ' + msg);
		}
		conn.send(msg);
		
		$('#chatinput').val('').focus();
		return false;
	});
});
