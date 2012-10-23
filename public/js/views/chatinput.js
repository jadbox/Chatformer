define(["auth", "chat", "apps/msg", "underscore", "backbone"], function(auth, chat) {
	return Backbone.View.extend({
		el: $("#chatform"),
		input: $("#chatinput"),
		events: {
			"submit": "submit"
		},
		submit: function() {
			var said = this.input.val();
			if(!said) return false;
			said = _.escape(said);
			var msg = Msg(auth.getName() + ": " + said);

			if(msg.type!="sys") chat.trigger("send", msg);

			this.input.val('').focus();
			return false;
		
		/*
			
			
			if(isSysMsg(msg) == true) {
				return false; // no sys msgs allowed
			} else if(isAppMsg(msg) == true && isConnected()) {
				var a = msg.split(" ");
				//log('<span class="label label-inverse">'+a.shift()+'</span> '+a.join(""));
				$('#chatlog').trigger("log", '<span class="label label-inverse">' + a.shift() + '</span> ' + a.join(""))
			}

			if(isConnected()) { // logged in
				conn.send(msg);
			} else handleCommand(msg, msgToApp, 0, function(e) { // not logged in
				log("Chatting not allowed until your logged in!")
			}); //offline
			
			return false;*/
	}, ldata: {
		source: [{
			id: 1,
			name: ".vote borderlands2"
		}, {
			id: 4,
			name: ".vote firefall"
		}, {
			id: 5,
			name: ".vote diablo3"
		}, {
			id: 2,
			name: "#room chill"
		}]
	},
	rdata: {
		source: [{
			id: 1,
			name: ".name "
		}]
	},
	initialize: function() {
		if(auth.isLoggedIn()) this.input.typeahead(this.ldata);
		else this.input.typeahead(this.rdata);
	}
	});
})