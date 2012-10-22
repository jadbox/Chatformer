function cf_app_api(msgFunc) {
	var APP_TOKEN = ".";
	var SYS_TOKEN = APP_TOKEN + APP_TOKEN;

	var parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''));
	if(parent_url.lastIndexOf("/") == parent_url.length - 1) parent_url = parent_url.slice(0, parent_url.length - 1); // fix
	$(window).resize(function(e) {
		resize();
	});

	$.receiveMessage(function(e) {
		var raw = decodeURIComponent( e.data );
		var msg = Msg(raw);
		msgFunc(msg);
	});

	function action(msg) {
		say(APP_TOKEN + msg)
	}

	function system(msg) {
		say(SYS_TOKEN + msg)
	}

	function say(msg) {
		msg = encodeURIComponent(msg);
		$.postMessage(msg, parent_url, parent);
	}

	function resize() {
		var msg = SYS_TOKEN + 'resize ' + $('body').outerHeight(true);
		//msg[SYS_TOKEN+'resize'] = $('body').outerHeight( true );
		$.postMessage(msg, parent_url, parent);
	}

	resize();

	return {
		action: action,
		say: say,
		system: system,
		resize: resize
	};
};