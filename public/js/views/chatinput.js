define(["auth", "chat", "apps/msg", "underscore", "backbone"], function(auth, chat) {
	var View = Backbone.View.extend({
		el: $("#chatform"),
		input: $("#chatinput"),
		typeaheads: {},
		events: {
			"submit": "submit"
		},
		submit: function() {
			var said = this.input.val();
			if(!said) return false;
			said = _.escape(said);
			var msg = Msg(auth.getName() + ": " + said);

			if(msg.type != "sys") chat.trigger("send", msg);

			this.setInput('');
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
		initialize: function() {
			
		},
		setInput:function(val) {
			this.input.val(val).focus();
		},
		setTypeahead:function(category, dataArray) {
			this.typeaheads[category] = dataArray;

			var list = [];
			for(var cat in this.typeaheads) list = list.concat(this.typeaheads[cat]);

			this.input.typeahead({source:list});
		}
	});
	return new View();
})