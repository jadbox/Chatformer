define(['chat', 'auth', "views/room", 'apps/msg', 'underscore', 'backbone'], function(chat, auth, room) {
	var control = $('#chatlog');
	var userBadges = {}; //'guest':'None'

	function log(msg) {
		var control = $('#chatlog');
		var color = '#760FA6' //'#'+Math.floor(Math.random()*16777215-20000).toString(16);
		var post = $('<div style="clear:both;color:' + color + '"/>');
		post.html(msg);
		$(post).fadeIn('slow');
		control.prepend(post);

		return post;
		//control.html(msg + '<br/>'+control.html());
		//control.scrollTop(control.scrollTop() + 1000);
	}

	function applyUserBadge(username) {
		var file="";
		var index = userBadges[username];
		if(!index) {
			$.getJSON("/api/badge/"+username, function(data) {
				userBadges[username] = data.badge?data.badge:"None";
				applyUserBadge(username);
			});
			return;
		}
		else if(index=="None") {
			file="dino64x42.jpg";
		}
		else {
			file=index;
		}
		$("."+username).attr("src", "/imgs/users/"+file);
		userBadges[username] = undefined; //TEMP FIX
	}

	function say(msg, onComplete) {
		var control = log("");
		var mediaBody = $('<div class="media-body"><h4 class="media-heading">'+msg.user+'</h4></div>');
		//var imageBody = $('<a class="pull-left" href="#"><img class="media-object" src="http://placehold.it/64x42/66ff33"/></a>');
		var imageBody = $('<a class="pull-left" href="#"><img class="media-object '+msg.user+'"/></a>');

		control.append(imageBody);
		control.append(mediaBody);
		applyUserBadge(msg.user);

		var arr = msg.data.split("");
		var func = function(lastChar) {
				if(arr.length == 0) {
					if(_.isFunction(onComplete)) onComplete();
					return;
				}
				var c = arr.shift();
				mediaBody.append(c);
				var delay = 10 + c.charCodeAt(0) * .32 + Math.random() * 10;
				if(lastChar == "." || lastChar == "!" || lastChar == "?") delay += 200;

				setTimeout(function() {
					func(c)
				}, delay);
			}
		func();
	}

	function canned_convo(msgs, onComplete) {
		var func = function() {
				if(msgs.length == 0) {
					if(_.isFunction(onComplete)) onComplete();
					return;
				}
				var msg = Msg(msgs.shift());
				setTimeout(function() {
					say(msg, func);
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
	ret.on("canned", canned_convo);
	ret.on("say", say);
	ret.on("reset", reset);

	chat.on("onSys", function(msg) {
		//if(msg.cmd=="users") ret.trigger("log", "<span class='label label-inverse'>users</span> "+msg.msg);
	});

	chat.on("onApp", function(msg) {
		if(auth.isLoggedIn()) ret.trigger("log", "<span class='label label-inverse'>"+msg.cmd+"</span> "+msg.msg);
	});

	chat.on("onTxt", function(msg) {
		//alert("sad"+msg.msg);
		if(auth.isLoggedIn()) ret.trigger("say", msg, "");
		else ret.trigger("log", "<span class='label label-important'>!</span> Chatting not allowed until your logged in!");
	});

	room.on("roomChange", function(room) {
		ret.trigger("log", "<span class='label label-important'>!</span> Entering room "+room);
	});

	$('#reset').click(reset);
	return ret
});