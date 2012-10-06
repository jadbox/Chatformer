var APP_TOKEN = ".";
var SYS_TOKEN = APP_TOKEN + APP_TOKEN;
var BAD_TOKEN = APP_TOKEN + APP_TOKEN + APP_TOKEN;
//====app specific
function cf_app_startup(appRecieverFunc, sysRecieverFunc, msgFunc) {
	var parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''))
	if(parent_url.lastIndexOf("/")==parent_url.length-1) parent_url = parent_url.slice(0,parent_url.length-1); // fix
	
	$(window).resize(function(e) {
		msgResize();
	});
	
	$.receiveMessage(handleCommandListener(appRecieverFunc, sysRecieverFunc, msgFunc), parent_url);
	
	function post(msg) {
		$.postMessage(APP_TOKEN+msg, parent_url, parent);
	}
	
	function msgResize() {
		var msg = SYS_TOKEN+'resize '+$('body').outerHeight( true );
		//msg[SYS_TOKEN+'resize'] = $('body').outerHeight( true );
		$.postMessage(msg, parent_url, parent);
	}
	
	msgResize();
	
	return {post: post};
};
//====
function handleCommandListener(appMsg, sysMsg, regMsg) {
	return function(e) {
		handleCommand(e.data, appMsg, sysMsg, regMsg);
	};
}

function handleCommand(msg, appMsg, sysMsg, regMsg) {
	if(isAppMsg(msg)==true) {
		msg = ssplice(msg, 0, APP_TOKEN.length);
		appMsg(msg); return true;
	}
	else if(isSysMsg(msg)==true && typeof(sysMsg)== typeof(Function)) {
		msg = ssplice(msg, 0, SYS_TOKEN.length);
		sysMsg(msg); return true;
	}
	else if(typeof(regMsg) == typeof(Function)) {
		regMsg(msg);
	}
}

function isAppMsg(msg){
	if(msg.indexOf(BAD_TOKEN) == 0) return false;
	return msg.indexOf(APP_TOKEN)== 0 && msg.indexOf(SYS_TOKEN) != 0 && msg.length > APP_TOKEN.length;
}
function isSysMsg(msg) {
	if(msg.indexOf(BAD_TOKEN) == 0) return false;
	return msg.indexOf(SYS_TOKEN)== 0 && msg.length > SYS_TOKEN.length;
}
//===============
function ssplice(msg, start, end) {
	//if(typeof(msg) != typeof(String) || msg.length < 2) return msg;
	var arr=msg.split("");
	arr.splice(start, end);
	return arr.join("");
}
function cb(func) {
	if(typeof(func)==typeof(Function)) func();
} 