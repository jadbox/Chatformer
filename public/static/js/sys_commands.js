define(["auth"], function(Auth) {
	function resizeIFrameMsg(msg, frameObject) {
		var _height = parseInt(msg.replace("resize ", ""));
		$(frameObject).height(_height);
		return;
	}

	return function handleCoreCommand(msg, frameObject) {
		if(msg.indexOf("resize") == 0) {
			resizeIFrameMsg(msg, frameObject);
		}
		if(msg.indexOf("reload") == 0 && isAuth() == false) {
			var args = msg.split(" ");
			Auth.login(args[1], args[2]);
		}
	}
});