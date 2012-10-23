define(["sys_commands", "chat", "apps/msg", "underscore", "backbone"], function(sysCmd, chat) {
	var numApps = 0;
	var activeIFrames = [];

	function get_domain(src) {
		return src.replace(/([^:]+:\/\/[^\/]+).*/, '$1');
	}

	function msgSys(msg) {
		if(_.isString(msg)) msg = ".." + msg;
		msgToApp(msg);
	}

	function msgApp(msg) {
		if(_.isString(msg)) msg = "." + msg;
		msgToApp(msg);
	}

	function msgMsg(msg) {
		if(_.isString(msg)) msg = Msg(msg);
		if(activeIFrames.length == 0) return;
		for(i in activeIFrames) {
			var _iwin = activeIFrames[i].get(0).contentWindow;
			var _isrc = activeIFrames[i].attr('src');
			//log("sending msg to iframe: #"+_iwin); // can only be used on same domain
			$.postMessage( encodeURIComponent(msg.raw), get_domain(_isrc), _iwin );
		}
	}

	function addAppListener(src, frameObject) {
		src = get_domain(src);

		function handleMsg(msg) {
			$('#chatinput').val('' + msg.data);
			$('#chatinput').focus();
		}

		function handleSysMsg(msg) {
			sysCmd(msg, frameObject);
		}

		$.receiveMessage(function(e) {
				m = Msg( decodeURIComponent(e.data) );
				if(m.type!="sys") handleMsg(m);
				if(m.type=="sys") handleSysMsg(m);
			}
			//$.handleCommandListener(handleAppMsg, handleSysMsg, handleMsg), get_domain(src)
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
	ret.on("msg", msgMsg);
	ret.on("sys", msgSys);
	ret.on("app", msgApp);

	chat.on("onApp", msgToApp)
	return ret;
})