function onLoad() {
  flog_navStart("html");
  connect(); update_ui();
}
function flog(msg) {
  var ft = $('#footer');
  ft.html(ft.html() + msg);
}
function flog_navStart(msg) {
  var now = new Date().getTime();
  var page_load_time = now - performance.timing.navigationStart;
  flog(" "+msg+":" +(page_load_time / 1000));
}



    var conn = null;

    function log(msg) {
        var control = $('#chatlog');
        control.html(control.html() + msg + '<br/>');
        control.scrollTop(control.scrollTop() + 1000);
    }

    function connect() {
        disconnect();
		flog_navStart("socket");
        var transports = ['websocket', 'xhr-streaming', 'xhr-polling', 'jsonp-polling'];
		//'http://' + window.location.host + 
        conn = new SockJS('http://192.168.1.104:8080/chat', transports);

        log('Connecting...');

        conn.onopen = function () {
            log('Connected.');
            update_ui();
        };

        conn.onmessage = function (e) {
            log('Received: ' + e.data);
        };

        conn.onclose = function () {
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
            $('#status')
                .text('disconnected');
            $('#connect')
                .text('Connect');
        } else {
            $('#status')
                .text('connected (' + conn.protocol + ')');
            $('#connect')
                .text('Disconnect');
        }
    }
	
$(function () {
    $('#connect')
        .click(function () {
        if (conn == null) {
            connect();
        } else {
            disconnect();
        }
		
        update_ui();
        return false;
    });

    $('#chatform')
        .submit(function () {
        var text = $('#chatinput')
            .val();
        //log('Sending: ' + text);
        conn.send(text);
        $('#chatinput')
            .val('')
            .focus();
        return false;
    });
	
	
});