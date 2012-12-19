function cf_app_api(onRdy, msgFunc, options) {
	if(!onRdy) onRdy = function(msg) {};
	if(!msgFunc) msgFunc = function(msg) {};
	options = options || {};
	options.require = options.require || []; // [listening, posting]

	options.relaySpeed = options.relaySpeed || 600;
	options.debug = options.debug || false;
	options.replay = options.replay || [];
	var replayLog = [];

	var APP_TOKEN = ".";
	var SYS_TOKEN = APP_TOKEN + APP_TOKEN;
	var user={}; // String "name" and Bool "guest"
	var users=[];
	var room={}; // String "id"
	var cmdHandlers={};
	var STARTUP_MSGS = 3;
	var startup_steps = 0;
	var isRdy = false;

	var parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''));
	if(parent_url.lastIndexOf("/") == parent_url.length - 1) parent_url = parent_url.slice(0, parent_url.length - 1); // fix
	

	$(window).load(function() {
		resize();
	});
	$(window).resize(function(e) {
		resize();
	});

	function onMsg(e) {
		if(options.debug) replayLog.push("in", e);
		var raw = decodeURIComponent( e );
		var msg = Msg(raw);
		if(msg.type=="sys") {
			if(msg.cmd=="isOwner") user.isOwner = msg.msg=="1"?true:false;
			else if(msg.cmd=="userinfo") onUserInfo(msg);
			else if(msg.cmd=="roominfo") onRoomInfo(msg);
			else if(msg.cmd=="users") onUsersInfo(msg);
			else msgFunc(msg);
		} else {
			if(msg.cmd=="debuglog") debugLog(msg);
			else msgFunc(msg);
		}
		//if(msg.type=="sys" && msg.cmd=="require") if(++startup_steps==STARTUP_MSGS) onRdy();
		msg['isClient'] = msg.user == user.name;
		if(msg.cmd && cmdHandlers[msg.cmd]) cmdHandlers[msg.cmd](msg);
	}
	$.receiveMessage(function(e) { onMsg(e.data); } );

	function debugLog(msg) {
		console.log(replayLog);
	}
	function rdy() {
		isRdy = true;
		onRdy();
	}
	function onUsersInfo(msg) {
		msg = msg.msg;
		msg = msg.split(" ");
		users.splice(0, users.length);
		for(var u in msg) users.push(msg[u]);
		if(++startup_steps==STARTUP_MSGS) rdy();
	}

	function onUserInfo(msg) {
		user.name = msg.msg;
		user.name.replace(/\s+/g, ' ');
		///user.guest = user.name=="guest";
		if(++startup_steps==STARTUP_MSGS) rdy();
	}

	function onRoomInfo(msg) {
		room.id = msg.msg;
		if(++startup_steps==STARTUP_MSGS) rdy();
	}

	function action(msg) {
		say(APP_TOKEN + msg);
	}

	function system(msg) {
		say(SYS_TOKEN + msg);
	}

	function commands(list) {
		system("commands "+APP_TOKEN+list.join("||"+APP_TOKEN));
	}

	function setBackground(cmd) {
		cf.system("background-css "+cmd);
	}
	
	//, "..background-css ", "..background-image "
	function say(msg, excludeUserSource) {
		msg = encodeURIComponent(msg);
		encoded_say(msg, excludeUserSource);
	}
	function encoded_say(msg, excludeUserSource) {
		var source = "";
		if(!excludeUserSource && user.name) source = user.name+": ";

		var _msg = source+msg;
		if(options.debug) replayLog.push("out", _msg);
		$.postMessage(_msg, parent_url, parent);
	}

	function resize() {
		var msg = 'resize ' + $('body').outerHeight(true);
		system(msg);
	}

	for(var requiredPriv in options.require) {
		//startup_steps++;
		system("require "+options.require[requiredPriv]);
	}

	resize();
	system("userinfo"); system("roominfo"); system("users");

	// reply ===
	var generator =
		(function(item, val) {
			return function() {
				if(item=="in") { onMsg(val); console.log("in "+val); }
				else if(item=="out") { encoded_say(val, true); console.log("out "+val); }
			};
	});
	for (var index = 0; index < options.replay.length; index++) {
		var item = options.replay[index];
		var val = options.replay[++index];
		setTimeout(generator(item, val), index * options.relaySpeed);
	}
	// =======

	return {
		"users": users,
		"room": room, // id
		"user": user, // name
		"action": action,
		"say": say,
		"system": system,
		"resize": resize,
		"commands": commands,
		"onAction": cmdHandlers,
		"setBackground": setBackground,
		"replayLog": replayLog
	};
};