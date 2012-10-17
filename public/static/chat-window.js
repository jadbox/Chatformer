function log(msg) {
	var control = $('#chatlog');
	var color = '#760FA6'//'#'+Math.floor(Math.random()*16777215-20000).toString(16);
	var post = $('<div style="color:'+color+'"/>');
	post.html(msg);
	$(post).fadeIn('slow');
	control.prepend(post);

	return post;
	//control.html(msg + '<br/>'+control.html());
	//control.scrollTop(control.scrollTop() + 1000);
}
function delayed_stream(msg, onComplete) {
	var control = log("");
	
	var arr = msg.split("");
	var func = function(lastChar) {
		if(arr.length==0) {
		 cb(onComplete);
		 return;
		}
		var c = arr.shift();
		control.append(c);
		var delay = 25+c.charCodeAt(0)*.42+Math.random()*25;
		if(lastChar=="." || lastChar=="!" || lastChar=="?") delay+=200;
		
		setTimeout(function() {func(c)},delay);
	}
	func();
}
function delayed_convo(msgs, onComplete) {
	var func = function() {
		if(msgs.length == 0) {
			cb(onComplete);
			return;
		}
		var msg = msgs.shift();
		setTimeout(function() {delayed_stream(msg, func);}, 800);
	}
	func();
}
