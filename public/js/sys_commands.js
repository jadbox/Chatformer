define(["auth"], function(Auth) {
	function resizeIFrameMsg(msg, frameObject) {
		$(frameObject).height(msg);
		return;
	}
	return function handleCoreCommand(msg, frameObject) {
		var cmd = msg.cmd;
		if(cmd=="userinfo") {
			require(["apptalk"], function(App){
				var user = Auth.user().name;
				App.trigger("sys", "userinfo "+user);
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
			if(msg.msg.indexOf("||")==-1) ta.push({name:msg.msg});
			else {
				var arr = msg.msg.split("||")
				for(var i in arr) ta.push({name:arr[i]});
			}
			//alert(ta[0].name + " "+ta[1].name);
			require(["views/chatinput"], function(chatinput){
				chatinput.setTypeahead("app", ta);
			});
		}
	}
});