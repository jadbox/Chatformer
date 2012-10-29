function cf_app_api(onRdy, msgFunc, options) {
	options = options || {};
	options.require = options.require || []; // [listening, posting]

	var APP_TOKEN = ".";
	var SYS_TOKEN = APP_TOKEN + APP_TOKEN;
	var user={}; // String "name" and Bool "guest"
	var room={}; // String "id"
	var STARTUP_MSGS = 2;
	var startup_steps = 0;

	var parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''));
	if(parent_url.lastIndexOf("/") == parent_url.length - 1) parent_url = parent_url.slice(0, parent_url.length - 1); // fix
	$(window).resize(function(e) {
		resize();
	});

	$.receiveMessage(function(e) {
		var raw = decodeURIComponent( e.data );
		var msg = Msg(raw);
		if(msg.type=="sys" && msg.cmd=="userinfo") onUserInfo(msg);
		if(msg.type=="sys" && msg.cmd=="roominfo") onRoomInfo(msg);
		//if(msg.type=="sys" && msg.cmd=="require") if(++startup_steps==STARTUP_MSGS) onRdy();
		msgFunc(msg);
	});

	function onUserInfo(msg) {
		user.name = msg.msg;
		user.guest = user.name=="guest";
		if(++startup_steps==STARTUP_MSGS) onRdy();
	}

	function onRoomInfo(msg) {
		room.id = msg.msg;
		if(++startup_steps==STARTUP_MSGS) onRdy();
	}

	function action(msg) {
		say(APP_TOKEN + msg)
	}

	function system(msg) {
		say(SYS_TOKEN + msg)
	}

	function commands(list) {
		system("commands "+APP_TOKEN+list.join("||"+APP_TOKEN));
	}

	function say(msg) {
		if(msg.cmd=="say") alert(msg);
		msg = encodeURIComponent(msg);
		$.postMessage(msg, parent_url, parent);
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
	system("userinfo"); system("roominfo");

	return {
		"room": room, // id
		"user": user, // name
		"action": action,
		"say": say,
		"system": system,
		"resize": resize,
		"commands": commands
	};
};