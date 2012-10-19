define(["underscore", "backbone"], function() {
	return Backbone.View.extend({
		el: $("#room-search"),
		events: {
			"submit": "submitform"
		},
		submitform: function() {
			alert("submit");
			/*
			var msg = $('#chatinput').val();
			msg = msg.replace(/<(?:.|\n)*?>/gm, '');
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
			$('#chatinput').val('').focus();
			return false;*/
		},
		initialize: function() {
			this.$el.find("input").typeahead({
				source:[{id:1, name:"root"}, {id:2,name:"chill"}, {id:3,name:"tech"}]
			});
		}
	})
})