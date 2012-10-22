define(["auth"], function(Auth) {
	function resizeIFrameMsg(msg, frameObject) {
		$(frameObject).height(msg);
		return;
	}

	return function handleCoreCommand(msg, frameObject) {
		var cmd = msg.cmd;
		if(cmd.indexOf("resize") == 0) {
			resizeIFrameMsg(msg.msg, frameObject);
		}
		if(cmd.indexOf("reload") == 0 && !Auth.isLoggedIn()) {
			var args = msg.msg.split(" ");
			Auth.login(args[0], args[1]);
		}
	}
});