define(["sys_commands", "chat", "apps/msg", "underscore", "backbone"], function(sysCmd, chat) {
	var activeIFrames = [];

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

	function addApp(src, delayed) {
		if(!delayed) {
			setTimeout(function(){ addApp(src, true); }, 1000); // delay app opening
			return;
		}
		if( $("#warn-box") ) $("#warn-box").remove();
		if(activeIFrames.length > 0) {
			activeIFrames.pop().remove();
			ret.trigger("removed");
		}
		var id = "app" + activeIFrames.length;
		var cacheBuster = "?noCache="+Math.random();
		src = src + cacheBuster;
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
			$('#inner-applayout').prepend('<div id="warn-box" class="alert alert-block alert-error fade in" style="margin-bottom:-18px"><button type="button" class="close" data-dismiss="alert">&times;</button><p id="warn-msg">'+msg+'</p></div>').alert();
	}

	chat.on("onSys", function(msg){
		//if(msg.cmd=="left") alert(msg.cmd + " " + msg.msg)
		msgMsg(msg);
	});

	//$('#inner-applayout').prepend('Change app to id: <input type="text" id="debug-app-changer" placeholder="vote"/><button id="debug-app-changer-btn">load</button>');

	
	ret.on("add", addApp);
	ret.on("msg", msgMsg);
	ret.on("sys", msgSys);
	ret.on("app", msgApp);

	chat.on("onApp", msgMsg)
	return ret;
})