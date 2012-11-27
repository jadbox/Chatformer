define(["auth", "chat", "apptalk", "apps/msg", "underscore", "backbone", "bootstrap"], function(auth, chat, apptalk) {
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
			else apptalk.trigger("onSys", msg); // has to be an app supported msg too

			this.setInput('');
			return false;
		},
		initialize: function() {
			this["typeahead"] = this.input.typeahead({source:[], items:8});

			//apptalk.on("onTxt", _.bind(this.setInput, this));
			apptalk.on("onApp", _.bind(this.setInput, this));

			//this.setTypeahead("debug", ["..app vote", "..app battle", "..app profile"]);
			//, "..background-css ", "..background-image "
		},
		setInput:function(val, sendNow) {
			if(val && typeof(val)!=typeof(String) && val.data) val = val.data;

			this.input.val(val).focus();
			if(sendNow) {
				var that = this;
				setTimeout(function(){ that.input.val(val); that.submit(); that.input.val(''); }, 1100);
			}
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