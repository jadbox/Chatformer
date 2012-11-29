requirejs.config({
	//By default load any module IDs from js/lib
	baseUrl: 'js',
	//except, if the module ID starts with "app",
	//load it from the js/app directory. paths
	//config is relative to the baseUrl, and
	//never includes a ".js" extension since
	//the paths config could be for a directory.
	urlArgs: "bust=" + (new Date()).getTime(),
	paths: {
		jquery: "http://code.jquery.com/jquery-1.8.2.min",
		postmessage: "apps/jquery.ba-postmessage.min",
		underscore: "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore",
		backbone: "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min",
		sockjs: "http://cdn.sockjs.org/sockjs-0.3.min",
		cookie: "http://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.2/jquery.cookie",
		bootstrap: "../style/bs/bootstrap.min"
	},
	shim: {
		'postmessage': ['jquery'],
		'bootstrap': ['jquery'],
		'cookie': ['jquery'],
		'underscore': ['jquery'],
		'backbone': {
			//These script dependencies should be loaded before loading
			//backbone.js
			deps: ['underscore', 'jquery'],
			//Once loaded, use the global 'Backbone' as the
			//module value.
			exports: 'Backbone'
		}
	},
	waitSeconds: 30
});

require(["./apptalk", "./chatlog", "i18n!nls/text", "./views/chatinput", 'bootstrap', 'domReady!'], 
	function(Apps, ChatLog, Locale, Chatinput) {


	require(["auth", "./views/footerlog"], function(Auth, flogger) {
		if(Auth.isLoggedIn()) authed();
		else notAuthed();
		flogger.log("html");
	});

	$("#profile").click(onProfile);


	function onProfile() {
		require(["./views/chatinput"], function(chatinput) {
			chatinput.setInput("..room profile", true);
		});
	}

	function authed() {
		require(["./views/search", 'chat', "./views/room", "./views/users"], function(Search, Chat, Room) {
			//new Chatinput(); not needed
			//new Search(); not needed
			Chat.connect();
			//Apps.trigger("add", "http://jadders.dyndns.org:82/apps/vote/app.html");
			doLocale(Locale);
			$("#logout-btn").click(function() {
				require(["auth"], function(Auth) {
					Auth.logout();
					return false;
				});
			});
		});
	}

	function notAuthed() {
		$('.authed').remove();
		//require([], function(Apps, ChatLog, Locale, Chatinput) {
		//new Chatinput();
		Apps.trigger("add", "http://jadders.dyndns.org:82/apps/auth/app.html");
		ChatLog.trigger("canned", Locale.introchat);
		doLocale(Locale);
		//})
	}

	function doLocale(locale) {
		var context = locale.site;
		for(var key in context) if(key.indexOf("#") == 0) {
			$(key).html(context[key]);
			$(key).val(context[key]);
		}
	}

});