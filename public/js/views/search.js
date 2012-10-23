define(["underscore", "backbone"], function() {
	var View = Backbone.View.extend({
		el: $("#room-search"),
		input: $("#room-search input"),
		"rooms_list": $("#rooms-list"),
		events: {
			"submit": "submitform",
			"click input": "getRooms"
		},
		submitform: function() {
			$('#chatinput').val("#room " + input.val());
			return false;
		},
		initialize: function() {
			this.getRooms();
			this.rooms_list.click(this.getRooms);
		},
		onJSON: function(data) {
				var source = [];
				//alert(this.rooms_list);
				this.rooms_list.empty();
				for(var key in data) {
					var val = data[key];
					this.rooms_list.append('<li><a href="#">'+key+'</a></li>')
					source.push({name: key, id: 1});
				}
				this.input.typeahead({
					"source": source,
					"val": "name"
				});
				
				for(var key in source) {
					source[key].name = "#room "+source[key].name;
				}
				require(["views/chatinput"], function(chatinput){
					chatinput.setTypeahead("rooms", source);
				});
		},
		getRooms: function() {
			$.getJSON("/api/rooms", _.bind(this.onJSON, this));
		}
	})
	return new View();
})