requirejs.config({
	//By default load any module IDs from js/lib
	baseUrl: 'static/js',
	//except, if the module ID starts with "app",
	//load it from the js/app directory. paths
	//config is relative to the baseUrl, and
	//never includes a ".js" extension since
	//the paths config could be for a directory.
	paths: {
		//apps: '../../apps',
		jquery: "http://code.jquery.com/jquery-1.8.2.min",
		underscore: "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min",
		backbone: "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min",
		sockjs: "http://cdn.sockjs.org/sockjs-0.3.min",
		cookie: "http://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.2/jquery.cookie"
		//postmsg: "../../apps/jquery.ba-postmessage.min"
	},
	waitSeconds: 10
});

$(function() {
	require(["auth", "./views/footerlog"], function(Auth, FLogger) {
		if(Auth.isLoggedIn()) authed();
		else notAuthed();
		new FLogger();
	});
})
//$(window).load(function() { });

function authed() {
	require(["./apptalk", "./views/chatinput", "./views/search", 'Chat'], function(Apps, Chatinput, Search, Chat) {
		new Chatinput();
		new Search();
		Chat.connect();
		Apps.trigger("add", "/apps/appvote.html");
	})
}

function notAuthed() {
	$('.authed').remove();
	require(["./apptalk", "./chatlog", "i18n!nls/text", "./views/chatinput"], function(Apps, ChatLog, Locale, Chatinput) {
		new Chatinput();
		Apps.trigger("add", "/apps/appauth.html");
		ChatLog.trigger("canned", Locale.introchat);
	})
}

/*
var local;
$(window).load(function () {
	$.getJSON('static/lang/eng.json', function(data) {
		local=data;
		flog_navStart("html");
		if(isAuth()) authed(); 
		else notAuthed();
		update_ui();
	});
}
function authed() {
	connect();
	addApp("http://jadders.dyndns.org:81/apps/appvote.html");
}
function notAuthed() {
	$('.authed').remove();
	//$('#chatinput').val("Use login form to start chatting!");
	addApp("http://jadders.dyndns.org:81/apps/appauth.html");
	
	delayed_convo(local.introchat);
}
*/