define(["auth", "underscore", "backbone"], function(Auth) {
	return Backbone.View.extend({
		el: $("#chatform"),
		input: $("#chatinput"),
		events: {
			"submit": "submit"
		},
		submit: function() {
			var msg = _.escape(this.input.val());
			
			
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
		},
		ldata: {
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
			if(Auth.isLoggedIn()) this.input.typeahead(this.ldata);
			else this.input.typeahead(this.rdata);
		}
	});
})