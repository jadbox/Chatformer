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
	}
});