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
		selectRoom: function(room){
			require(["views/chatinput"], function(chatinput){
				chatinput.setInput("#room "+room);
			});
			return true;
		},
		onJSON: function(data) {
				var source = [];
				//alert(this.rooms_list);
				this.rooms_list.empty();
				for(var key in data) {
					var val = data[key];
					var node = $('<li><a>'+key+'</a></li>');
					node.find('a').click(_.bind(this.selectRoom, this, key));

					this.rooms_list.append(node);
					source.push({name: key});
				}

				this.rooms_list.append('<li class="divider"></li><li><a href="#" id="make-room">Make a Room</a></li>');
				$("#make-room").click(_.bind(this.selectRoom, this, "MYROOM"));

				this.input.typeahead({
					"source": source,
					"val": "name",
					itemSelected: function(val) { this.selectRoom(val); }
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