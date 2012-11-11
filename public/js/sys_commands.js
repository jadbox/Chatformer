define(["auth", "underscore"], function(Auth) {
	function resizeIFrameMsg(msg, frameObject) {
		$(frameObject).height(msg);
		return;
	}
	return function handleCoreCommand(msg, frameObject) {
		var cmd = msg.cmd;

		if (cmd=="app" && Auth.isLoggedIn()) {
			require(["apptalk"], function(App){
				var data = _.unescape(msg.msg);
				if(data.indexOf("://") > 0) App.trigger("add", data);
				else App.trigger("add", "http://jadders.dyndns.org:82/apps/"+msg.msg+"/app.html");
			});
		}

		if(cmd=="background-css") {
			//..background-css #33ff99 url('http://3.bp.blogspot.com/-swX1TZBkAko/TzJnbwg6-ZI/AAAAAAAAsLo/cPslKxRTrlE/s1600/Pembroke+Welsh+Corgi.jpg') no-repeat right top
			$("body").css('background', _.unescape(msg.msg));
		}
		else if(cmd=="background-image") {
			$("body").css('background-image', 'url("'+_.unescape(msg.msg)+'")');
		}
		else if(cmd=="userinfo") {
			require(["apptalk"], function(App){
				App.trigger("sys", "userinfo " + Auth.user().name);
			})
		}
		else if(cmd=="roominfo") {
			require(["apptalk", "chat"], function(App, Chat){
				var id = Chat.room.id;
				App.trigger("sys", "roominfo "+ id);
			})
		}
		else if(cmd=="resize") {
			resizeIFrameMsg(msg.msg, frameObject);
		}
		else if(cmd=="reload" && !Auth.isLoggedIn()) {
			var args = msg.msg.split(" ");
			Auth.login(args[0], args[1]);
		}
		else if(cmd=="commands") {
			if(!msg.msg || msg.msg.length < 2) return;
			
			var ta = [];
			if(msg.msg.indexOf("||")==-1) ta.push(msg.msg);
			else {
				var arr = msg.msg.split("||")
				for(var i in arr) ta.push(arr[i]);
			}
			require(["views/chatinput"], function(chatinput){
				chatinput.setTypeahead("app", ta);
			});
		}
		else if(cmd=="users") {
			require(["apptalk", "views/users"], function(apptalk, users) {
				apptalk.trigger("sys", "users "+users.users.join(" "));
			});
		}
		else if(cmd=="require") {
			if(msg.msg=="listening") {
				require(["apptalk", "chat"], function(apptalk, chat) {
					apptalk.warn("* app is listening on discussion.");
					chat.on("onTxt", function(msg) {
						apptalk.trigger("msg", msg);
					})
				});
			}
			else if(msg.msg=="posting") {
				require(["apptalk", "chatlog"], function(apptalk, chatlog) {
					apptalk.warn("* app is allowed to post content to chat and even impersonate.");
					apptalk.on("onSys", function(msg) {
						if(msg.cmd=="log") chatlog.trigger("msg", msg.msg);
						if(msg.cmd=="say") chatlog.trigger("say", msg.msg);
					})
				});
			}
		}
	}
});