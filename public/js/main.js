requirejs.config({
	//By default load any module IDs from js/lib
	baseUrl: 'js',
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

//$(function() {	})
$(window).load(function() { 
	require(["auth", "./views/footerlog"], function(Auth, flogger) {
		if(Auth.isLoggedIn()) authed();
		else notAuthed();
		flogger.log("html");
	});

	$("#profile").click(onProfile);
});

function onProfile() {
	require(["./views/chatinput"], function(chatinput) {
		chatinput.setInput("..app profile", true);
	});
}

function authed() {
	require(["./apptalk", "./views/chatinput", "./views/search", 'chat', "i18n!nls/text", "./chatlog", 
		"./views/room", "./views/users"], 
		function(Apps, Chatinput, Search, Chat, Locale, ChatLog, Room) {
		//new Chatinput(); not needed
		//new Search(); not needed
		
		Chat.connect();
		Apps.trigger("add", "http://jadders.dyndns.org:82/apps/vote/app.html");
		doLocale(Locale);
		$("#logout-btn").click(function(){
			require(["auth"], function(Auth) { Auth.logout(); return false;});
		});
	})
}

function notAuthed() {
	$('.authed').remove();
	require(["./apptalk", "./chatlog", "i18n!nls/text", "./views/chatinput"], function(Apps, ChatLog, Locale, Chatinput) {
		//new Chatinput();
		Apps.trigger("add", "http://jadders.dyndns.org:82/apps/auth/app.html");
		ChatLog.trigger("canned", Locale.introchat);
		doLocale(Locale);
	})
}

function doLocale(locale) {
	var context = locale.site;
	for(var key in context) if(key.indexOf("#")==0) {$(key).html(context[key]);$(key).val(context[key])}
}