function handleCoreCommand(msg, frameObject) {
	if(msg.indexOf("resize") == 0) { resizeIFrameMsg(msg, frameObject); } 	
}

function resizeIFrameMsg(msg, frameObject) {
	var _height = parseInt(msg.replace("resize ", ""));
	$(frameObject).height(_height);
	return;
} 