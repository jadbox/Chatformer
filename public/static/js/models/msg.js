define([], function() {
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
		return this.type+":"+this.cmd+":"+this.msg;
	}

	return function(raw) {
		var type = TYPE_TXT;
		var msg = raw;
		var cmd = "";

		if(raw.indexOf(BAD_TOKEN)==0) {}
		else if(raw.indexOf(SYS_TOKEN)==0 && raw.length > SYS_TOKEN.length) {
			msg = msg.slice(SYS_TOKEN.length); 

			var spl = msg.split(" ");
			cmd = spl[0]; msg = spl[1];

			type = TYPE_SYS;
		}
		else if(raw.indexOf(APP_TOKEN)==0 && raw.length > APP_TOKEN.length) {_
			msg = msg.slice(APP_TOKEN.length); 

			var spl = msg.split(" ");
			cmd = spl[0]; msg = spl[1];

			type = TYPE_APP;
		}

		return {
			"raw": raw,
			"cmd": cmd,
			"msg": msg,
			"type": type,
			"handler": handler,
			"toString": toString
		};
	}
});

/*function() {
	return Backbone.Model.extend({
		raw: function(msg) {
			this.set({
				color: cssColor
			});
		}
	});
})*/