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

			//if(msg.type != "sys" && msg.cmd!="room") 
			chat.trigger("send", msg);

			this.setInput('');
			return false;
		},
		initialize: function() {
			this["typeahead"] = this.input.typeahead({source:[], items:8});
			this.setTypeahead("core", ["..users"]);
		},
		setInput:function(val) {
			this.input.val(val).focus();
		},
		setTypeahead:function(category, dataArray) {
			//if(category!="app") return;
			this.typeaheads[category] = dataArray;

			//var list = this.tlist;
			var tlist = [];
			for(var cat in this.typeaheads) tlist = tlist.concat(this.typeaheads[cat]);
			this["typeahead"].data('typeahead').source = tlist;
		}
	});
	return new View();
})