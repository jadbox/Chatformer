define(['chat', 'auth', "views/room", 'underscore', 'backbone'], function(chat, auth, room) {
	var control = $('#chatlog');

	function log(msg) {
		var control = $('#chatlog');
		var color = '#760FA6' //'#'+Math.floor(Math.random()*16777215-20000).toString(16);
		var post = $('<div style="color:' + color + '"/>');
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
				if(arr.length == 0) {
					if(_.isFunction(onComplete)) onComplete();
					return;
				}
				var c = arr.shift();
				control.append(c);
				var delay = 10 + c.charCodeAt(0) * .32 + Math.random() * 10;
				if(lastChar == "." || lastChar == "!" || lastChar == "?") delay += 200;

				setTimeout(function() {
					func(c)
				}, delay);
			}
		func();
	}

	function delayed_convo(msgs, onComplete) {
		var func = function() {
				if(msgs.length == 0) {
					if(_.isFunction(onComplete)) onComplete();
					return;
				}
				var msg = msgs.shift();
				setTimeout(function() {
					delayed_stream(msg, func);
				}, 700);
			}
		func();
	}

	function reset() {
		control.html('');
	}

	var ret = {};
	_.extend(ret, Backbone.Events);

	ret.on("log", log);
	ret.on("canned", delayed_convo);
	ret.on("say", delayed_stream);
	ret.on("reset", reset);

	chat.on("onApp", function(msg) {
		if(auth.isLoggedIn()) ret.trigger("log", "<span class='label label-inverse'>"+msg.cmd+"</span> "+msg.msg);
	});

	chat.on("onTxt", function(msg) {
		//alert("sad"+msg.msg);
		if(auth.isLoggedIn()) ret.trigger("say", msg.raw);
		else ret.trigger("log", "<span class='label label-important'>!</span> Chatting not allowed until your logged in!");
	});

	room.on("roomChange", function(room) {
		ret.trigger("log", "<span class='label label-important'>!</span> Entering room "+room);
	});

	$('#reset').click(reset);
	return ret
});