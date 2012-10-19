define(["sys_commands", "underscore", "backbone"], function(SysCmd) {
	var numApps = 0;
	var activeIFrames = [];

	function msgToApp(msg) {
		msg = APP_TOKEN + msg;
		if(activeIFrames.length == 0) return;
		for(i in activeIFrames) {
			var _iwin = activeIFrames[i].get(0).contentWindow;
			var _isrc = activeIFrames[i].attr('src');
			//log("sending msg to iframe: #"+_iwin); // can only be used on same domain
			$.postMessage(msg, get_domain(_isrc), _iwin);
		}
	}

	function get_domain(src) {
		return src.replace(/([^:]+:\/\/[^\/]+).*/, '$1');
	}

	function addAppListener(src, frameObject) {
		src = get_domain(src);

		function handleAppMsg(msg) {
			handleMsg(APP_TOKEN + msg);
		}

		function handleMsg(msg) {
			$('#chatinput').val('' + msg);
			$('#chatinput').focus();
		}

		function handleSysMsg(msg) {
			SysCmd.handleCoreCommand(msg, frameObject);
		}

		$.receiveMessage(
			handleCommandListener(handleAppMsg, handleSysMsg, handleMsg), get_domain(src)
		);
	}

	function addApp(src) {
		numApps++;
		var id = "app" + numApps;
		var isrc = src + '#' + encodeURIComponent(document.location.href);
		var frameCode = '<iframe " src="' + isrc + '" scrolling="no" id="' + id + '" frameborder="0">Loading...<\/iframe>';
		var _frame = $(frameCode).appendTo('#inner-applayout');
		activeIFrames.push(_frame);
		addAppListener(src, _frame);
	}

	var ret = {};
	_.extend(ret, Backbone.Events);
	ret.on("add", addApp);
	ret.on("msg", msgToApp);
	return ret;
})