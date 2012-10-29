define(["sys_commands", "chat", "apps/msg", "underscore", "backbone"], function(sysCmd, chat) {
	var activeIFrames = [];

	var ret = {};

	function get_domain(src) {
		return src.replace(/([^:]+:\/\/[^\/]+).*/, '$1');
	}

	function msgSys(msg) {
		if(_.isString(msg)) msg = ".." + msg;
		msgMsg(msg);
	}

	function msgApp(msg) {
		if(_.isString(msg)) msg = "." + msg;
		msgMsg(msg);
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

		$.receiveMessage(function(e) {
				m = Msg( decodeURIComponent(e.data) );

				if(m.type=="txt") ret.trigger("onTxt", m);
				else if(m.type=="sys") {
					sysCmd(m, frameObject);
					ret.trigger("onSys", m);
				}
				else if(m.type=="app") ret.trigger("onApp", m);
			}
		);
	}

	function addApp(src) {
		if(activeIFrames.length > 0) activeIFrames.pop().remove();
		var id = "app" + activeIFrames.length;
		var isrc = src + '#' + encodeURIComponent(document.location.href);
		var frameCode = '<iframe " src="' + isrc + '" scrolling="no" id="' + id + '" frameborder="0">Loading...<\/iframe>';
		var _frame = $(frameCode).appendTo('#inner-applayout');
		activeIFrames.push(_frame);
		addAppListener(src, _frame);
	}

	ret.warn = function (msg, clear) {
		if( $('#warn-msg').length > 0 ) {
			if(clear) $('#warn-msg').remove();
			else $('#warn-msg').append("<br/>"+msg);
		}
		else 
			$('#inner-applayout').prepend('<div class="alert alert-block alert-error fade in" style="margin:0 0 -12px;"><button type="button" class="close" data-dismiss="alert">&times;</button><p id="warn-msg">'+msg+'</p></div>').alert();
	}

	_.extend(ret, Backbone.Events);
	ret.on("add", addApp);
	ret.on("msg", msgMsg);
	ret.on("sys", msgSys);
	ret.on("app", msgApp);

	chat.on("onApp", msgMsg)
	return ret;
})