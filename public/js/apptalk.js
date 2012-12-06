define(["sys_commands", "chat", "apps/msg", "underscore", "backbone", "postmessage"], function(sysCmd, chat) {
	var activeIFrame;

	var ret = {};
	_.extend(ret, Backbone.Events);

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
		if(!activeIFrame) return;
		var _iwin = activeIFrame.get(0).contentWindow;
		var _isrc = activeIFrame.attr('src');
		//log("sending msg to iframe: #"+_iwin); // can only be used on same domain
		$.postMessage( encodeURIComponent(msg.raw), get_domain(_isrc), _iwin );
	}

	function addAppListener(src) {
		src = get_domain(src);

		$.receiveMessage(function(e) {
				m = Msg( decodeURIComponent(e.data) );
				if(m.type=="txt") ret.trigger("onTxt", m);
				else if(m.type=="sys") ret.trigger("onSys", m);
				else if(m.type=="app") ret.trigger("onApp", m);
			}
		);
	}

	function addApp(src, delayed) {
		if(!delayed) {
			setTimeout(function(){ addApp(src, true); }, 1000); // delay app opening
			return;
		}
		if( $("#warn-box") ) $("#warn-box").remove();
		if(activeIFrame) {
			activeIFrame.remove();
			ret.trigger("removed");
			activeIFrame = null;
		}

		var cacheBuster = "?noCache="+Math.random();
		src = src + cacheBuster;
		var isrc = src + '#' + encodeURIComponent(document.location.href);
		var frameCode = '<iframe " src="' + isrc + '" scrolling="no" frameborder="0">Loading...<\/iframe>';
		var _frame = $(frameCode).appendTo('#inner-applayout');
		ret.activeIFrame = activeIFrame = _frame;
		addAppListener(src);
	}

	ret.warn = function (msg, clear) {
		if( $('#warn-msg').length > 0 ) {
			if(clear) $('#warn-msg').remove();
			else $('#warn-msg').append("<br/>"+msg);
		}
		else 
			$('#inner-applayout').prepend('<div id="warn-box" class="alert alert-block alert-error fade in" style="margin-bottom:-18px"><button type="button" class="close" data-dismiss="alert">&times;</button><p id="warn-msg">'+msg+'</p></div>').alert();
	}

	chat.on("onSys", function(msg){
		//if(msg.cmd=="left") alert(msg.cmd + " " + msg.msg)
		msgMsg(msg);
	});
	//chat.on("onApp", function(msg){
	//	msgMsg(msg);
	//});

	//$('#inner-applayout').prepend('Change app to id: <input type="text" id="debug-app-changer" placeholder="vote"/><button id="debug-app-changer-btn">load</button>');

	
	ret.on("add", addApp);
	ret.on("msg", msgMsg);
	ret.on("sys", msgSys);
	ret.on("app", msgApp);

	chat.on("onApp", msgMsg);
	sysCmd(ret); // initialize
	return ret;
})