function cf_app_api(onRdy, msgFunc, options) {
	options = options || {};
	options.require = options.require || []; // [listening, posting]

	var APP_TOKEN = ".";
	var SYS_TOKEN = APP_TOKEN + APP_TOKEN;
	var user={}; // String "name" and Bool "guest"
	var users=[];
	var room={}; // String "id"
	var cmdHandlers={};
	var STARTUP_MSGS = 3;
	var startup_steps = 0;

	var parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''));
	if(parent_url.lastIndexOf("/") == parent_url.length - 1) parent_url = parent_url.slice(0, parent_url.length - 1); // fix
	$(window).resize(function(e) {
		resize();
	});

	$.receiveMessage(function(e) {
		var raw = decodeURIComponent( e.data );
		var msg = Msg(raw);
		if(msg.type=="sys" && msg.cmd=="isOwner") user.isOwner = msg.msg=="1"?true:false;
		else if(msg.type=="sys" && msg.cmd=="userinfo") onUserInfo(msg);
		else if(msg.type=="sys" && msg.cmd=="roominfo") onRoomInfo(msg);
		else if(msg.type=="sys" && msg.cmd=="users") onUsersInfo(msg);
		else if(msgFunc) msgFunc(msg);
		//if(msg.type=="sys" && msg.cmd=="require") if(++startup_steps==STARTUP_MSGS) onRdy();
		msg['isClient'] = msg.user == user.name;
		if(msg.cmd && cmdHandlers[msg.cmd]) cmdHandlers[msg.cmd](msg);
	});

	function onUsersInfo(msg) {
		msg = msg.msg;
		msg = msg.split(" ");
		users.splice(0, users.length);
		for(var u in msg) users.push(msg[u]);
		if(++startup_steps==STARTUP_MSGS) onRdy();
	}

	function onUserInfo(msg) {
		user.name = msg.msg;
		user.name.replace(/\s+/g, ' ');
		///user.guest = user.name=="guest";
		if(++startup_steps==STARTUP_MSGS) onRdy();
	}

	function onRoomInfo(msg) {
		room.id = msg.msg;
		if(++startup_steps==STARTUP_MSGS) onRdy();
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
	
	//, "..background-css ", "..background-image "
	function say(msg, excludeUserSource) {
		msg = encodeURIComponent(msg);
		var source = "";
		if(!excludeUserSource && user.name) source = user.name+": ";
		$.postMessage(source+msg, parent_url, parent);
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

	return {
		"users": users,
		"room": room, // id
		"user": user, // name
		"action": action,
		"say": say,
		"system": system,
		"resize": resize,
		"commands": commands,
		"onAction": cmdHandlers
	};
};