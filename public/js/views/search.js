define(["underscore", "backbone", "bootstrap"], function() {
	var View = Backbone.View.extend({
		el: $("#room-search"),
		input: $("#room-search input"),
		rooms_list: $("#rooms-list"),
		events: {
			"submit": "submitform"
		},
		submitform: function() {
			$('#chatinput').val("..room " + input.val());
			return false;
		},
		initialize: function() {
			this["typeahead"] = this.input.typeahead({
				"source": _.bind(this.getRooms, this),
				"updater": _.bind(this.onChange, this),
			});
			this.getRooms();
			$('#rooms-dropdown').click( _.bind(this.getRooms, this) );
		},
		onChange: function(item) {
			var that = this;
			require(["views/chatinput"], function(chatinput) {
				chatinput.setInput("..room " + item);
			});
			return '';
		},
		selectRoom: function(room) {
			require(["views/chatinput"], function(chatinput) {
				chatinput.setInput("..room " + room);
			});
			return true;
		},
		getRooms: function(query, process) {
			var rooms_list = this.rooms_list;
			var that = this;
			$.getJSON("/api/rooms", function(data) {
				var source = [];
				rooms_list.empty();

				for(var key in data) {
					var val = data[key];
					var node = $('<li><a>' + key + '</a></li>');
					node.find('a').click(_.bind(that.selectRoom, that, key));

					rooms_list.append(node);
					source.push(key);
				}
				rooms_list.append('<li class="divider"></li><li><a href="#" id="make-room">Make a Room</a></li>');
				$("#make-room").click(_.bind(that.selectRoom, that, "MYROOM"));
				//========== search typeahead
				if(process) process(source);
			});
		}
	});

	var view = new View();

	return view;
})