function handleCoreCommand(msg) {
	alert(msg);
	if(msg.indexOf("resize") == 0) { resizeIFrameMsg(e.data, frameObject); } 	
}

function resizeIFrameMsg(msg, frameObject) {
	var _height = parseInt(msg.replace("resize=", ""));
	$(frameObject).height(_height);
	return;
}