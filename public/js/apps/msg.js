Msg = function() {
	var APP_TOKEN = ".";
	var SYS_TOKEN = APP_TOKEN + APP_TOKEN;
	var BAD_TOKEN = APP_TOKEN + APP_TOKEN + APP_TOKEN;

	var TYPE_TXT = "txt";
	var TYPE_APP = "app";
	var TYPE_SYS = "sys";

	var handler = function(onTxt, onApp, onSys) {
		if(typeof(onTxt) == typeof(Function) && this.type==TYPE_TXT) onTxt(msg);
		else if(typeof(onApp) == typeof(Function) && this.type==TYPE_APP) onApp(msg);
		else if(typeof(onSys) == typeof(Function) && this.type==TYPE_SYS) onSys(msg);
	}
	var toString = function() {
		return this.user+"=said="+this.type+":"+this.cmd+":"+this.msg;
	}

	return function(raw) {
		if(!raw) return {};
		var type = TYPE_TXT;
		var msg = raw;
		var cmd = "";
		var data = raw;

		var user = "";
		if(raw.indexOf(": ") > 0) {
			var uspl = raw.split(": ", 2);
			user = uspl[0];
			msg = data = uspl[1];
		}

		function parseCmd(data) {
			var cmd = data.cmd;
			var msg = data.msg;
			var index = msg.indexOf(" ");
			if(index==-1) {
				data.cmd = msg;
				data.msg = "";
			} else {
				data.cmd = msg.slice(0, index); 
				data.msg = msg.slice(index+1);
			}
			return data;
		}

		if(msg.indexOf(BAD_TOKEN)==0) {}
		else if(msg.indexOf(SYS_TOKEN)==0 && msg.length > SYS_TOKEN.length) {
			msg = msg.slice(SYS_TOKEN.length); 
			p = parseCmd({msg:msg, cmd:cmd}); msg = p.msg; cmd = p.cmd;
			type = TYPE_SYS;
		}
		else if(msg.indexOf(APP_TOKEN)==0 && msg.length > APP_TOKEN.length) {
			msg = msg.slice(APP_TOKEN.length); 
			p = parseCmd({msg:msg, cmd:cmd}); msg = p.msg; cmd = p.cmd;
			type = TYPE_APP;
		}

		return {
			"user": user,
			"raw": raw,
			"data": data,
			"cmd": cmd,
			"msg": msg,
			"type": type,
			"handler": handler,
			"toString": toString
		};
	}
}(),typeof define=="function"&&define.amd&&define("Msg",[],function(){return Msg})

/*function() {
	return Backbone.Model.extend({
		raw: function(msg) {
			this.set({
				color: cssColor
			});
		}
	});
})*/