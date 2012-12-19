define(["auth", "chat", "views/room", "underscore"], function(Auth, chat, room) {
	var apptalk;

	function resizeIFrameMsg(msg, frameObject) {
		$(frameObject).height(msg);
		return;
	}
	function changeApp(msg) {
		var cmd = msg.cmd;
		if(Auth.isLoggedIn()) {
			var data = _.unescape(msg.msg);
			if(data.indexOf("://") > 0) apptalk.trigger("add", data);
			else apptalk.trigger("add", "/apps/" + msg.msg + "/app.html");
		}
	}
	function handleCoreCommand(msg, frameObject) {
		var cmd = msg.cmd;

		if(cmd=="app" && Auth.isLoggedIn()) {
			chat.trigger("send", msg);
		}
		else if(cmd=="room" && Auth.isLoggedIn()) {
			chat.trigger("send", msg);
		}
		else if(cmd == "terms") {
			$("#terms_button").click();
		}
		else if(cmd == "background-css") {
			//..background-css #33ff99 url('http://3.bp.blogspot.com/-swX1TZBkAko/TzJnbwg6-ZI/AAAAAAAAsLo/cPslKxRTrlE/s1600/Pembroke+Welsh+Corgi.jpg') no-repeat right top
			$("body").css('background', _.unescape(msg.msg));
		} else if(cmd == "background-image") {
			$("body").css('background-image', 'url("' + _.unescape(msg.msg) + '")');
		} else if(cmd == "userinfo") {
			apptalk.trigger("sys", "userinfo " + Auth.user().name);

		} else if(cmd == "roominfo") {
			var id = room.id;
			apptalk.trigger("sys", "isOwner " + room.isOwner?"0":"1");
			apptalk.trigger("sys", "roominfo " + id);
		} else if(cmd == "resize") {
			resizeIFrameMsg(msg.msg, frameObject);
		} else if(cmd == "reload" && !Auth.isLoggedIn()) {
			var args = msg.msg.split(" ");
			Auth.login(args[0], args[1]);
		} else if(cmd == "commands") {
			if(!msg.msg || msg.msg.length < 2) return;

			var ta = [];
			if(msg.msg.indexOf("||") == -1) ta.push(msg.msg);
			else {
				var arr = msg.msg.split("||")
				for(var i in arr) ta.push(arr[i]);
			}
			require(["views/chatinput"], function(chatinput) {
				chatinput.setTypeahead("app", ta);
			});
		} else if(cmd == "users") {
			require(["views/users"], function(users) {
				apptalk.trigger("sys", "users " + users.users.join(" "));
			});
		} else if(cmd == "require") {
			if(msg.msg == "listening") {

				apptalk.warn("* app is listening on discussion.");
				chat.on("onTxt", function listenTxt(msg) {
					apptalk.trigger("msg", msg);
					apptalk.on("removed", function() {
						chat.off("onTxt", listenTxt);
					});
				});

			} else if(msg.msg == "posting") {
				require(["chatlog"], function(chatlog) {
					apptalk.warn("* app is allowed to post content to chat and even impersonate.");
					apptalk.on("onTxt", function appPost(msg) {
						chatlog.trigger("say", msg);
						apptalk.on("removed", function() {
							apptalk.off("onTxt", appPost);
						});
					});
					//apptalk.on("onSys", function(msg) {
					//	if(msg.cmd=="log") chatlog.trigger("msg", msg.msg);
					//	if(msg.cmd=="say") chatlog.trigger("say", msg.msg);
					//})
				});
			}
		}
	}

	return function(_apptalk) {
		apptalk = _apptalk;
		//chat.on("on")
		chat.on("onSys", function(msg) {
			if(msg.cmd == "app") {
				changeApp(msg);
				//handleCoreCommand(msg, apptalk.activeIFrame);
			}
		});
		apptalk.on("onSys", function(msg) {
			handleCoreCommand(msg, apptalk.activeIFrame);
		});
	};
});