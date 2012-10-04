
var conn = null;

function log(msg) {
	var control = $('#chatlog');
	control.html(msg + '<br/>'+control.html());
	control.scrollTop(control.scrollTop() + 1000);
}

function isAppMsg(msg) {
return msg.charAt(0)=="!" && msg.length > 1;
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
		var msg = e.data;
		if(isAppMsg(msg)) {
			msgToApp(msg);
		} else {
			log('Received: ' + msg);
		}
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
		if(isAppMsg(msg)==false) {
			log('Sending: ' + msg);
		}
		conn.send(msg);
		
		$('#chatinput').val('').focus();
		return false;
	});
});
// =========== apps ==============
function msgToApp(msg) {
	if(activeIFrames.length==0) return;
	for(i in activeIFrames) { 
		var _iwin = activeIFrames[i].get(0).contentWindow;
		var _isrc = activeIFrames[i].attr('src');
		//log("sending msg to iframe: #"+_iwin); // can only be used on same domain
		$.postMessage(msg, get_domain(_isrc), _iwin);
	}
}

var numApps = 0;
var activeIFrames = [];
function addApp(src) {
	numApps++;
	var id = "app"+numApps;
	var isrc = src+'#' + encodeURIComponent( document.location.href );
	var frameCode = '<iframe " src="' + isrc + '" scrolling="no" id="'+id+'" frameborder="0">Loading...<\/iframe>';
	var _frame = $(frameCode).appendTo( '#inner-applayout' );
	activeIFrames.push( _frame );
	addAppListener(src, _frame);
}

function addAppListener(src, frameObject) {
	src = get_domain(src);
$.receiveMessage(
  function(e){
 //  alert( e.data.indexOf("!!resize") );
   	if(e.data.indexOf("!!resize") == 0) { resizeIFrameMsg(e.data, frameObject); return; }
	$('#chatinput').val(''+e.data);
	$('#chatinput').focus();
  },
  get_domain(src)//'http://jadders.dyndns.org:81' // remote domain
);
}

function get_domain(src) {
 return src.replace( /([^:]+:\/\/[^\/]+).*/, '$1' );
}

function resizeIFrameMsg(msg, frameObject) {
	var _height = parseInt(msg.replace("!!resize=", ""));
	$(frameObject).height(_height);
	return;
}