define(["underscore", "backbone"], function() {
	var View = Backbone.View.extend({
		el: $("#room-search"),
		input: $("#room-search input"),
		rooms_list: $("#rooms-list"),
		events: {
			"submit": "submitform",
			"click input": "getRooms"
		},
		submitform: function() {
			var msg = $('#chatinput').val("#room " + input.val());

		},
		initialize: function() {
			this.getRooms();
			//rooms_list.click(getRooms);
		},
		onJSON: function(data) {
				var source = [];
				//alert(this.rooms_list);
				this.input = $("#room-search input");
				this.rooms_list = $("#rooms-list");

				this.rooms_list.empty();
				for(var key in data) {
					var val = data[key];
					this.rooms_list.append('<li><a href="#">'+key+'</a></li>')
					source.push({name: key});
				}
				this.input.typeahead({
					"source": source,
					"val": "name"
				});
		},
		getRooms: function() {
			//var _input = this.input;
			$.getJSON("/api/rooms", this.onJSON);

			//this.$el.find("input").typeahead({
			//	source:[{id:1, name:"root"}, {id:2,name:"chill"}, {id:3,name:"tech"}]
			//});
		}
	})

	return new View();
})