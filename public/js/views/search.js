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
			$('#chatinput').val("..room " + input.val());
			return false;
		},
		initialize: function() {
			this["typeahead"] = this.input.typeahead({"source": []});
			this.input.change(_.bind(this.onChange, this));
			this.getRooms();
			this.rooms_list.click(_.bind(this.getRooms,this));
		},
		onChange: function () {
			var that = this; 
			require(["views/chatinput"], function(chatinput){
				chatinput.setInput("..room "+that.input.val());
			});
			that.input.val('');
		},
		selectRoom: function(room){
			require(["views/chatinput"], function(chatinput){
				chatinput.setInput("..room "+room);
			});
			return true;
		},
		onJSON: function(data) {
				var source = [];
				//alert(this.rooms_list);
				//========= drop down
				this.rooms_list.empty();
				for(var key in data) {
					var val = data[key];
					var node = $('<li><a>'+key+'</a></li>');
					node.find('a').click(_.bind(this.selectRoom, this, key));

					this.rooms_list.append(node);
					source.push(key);
				}
				this.rooms_list.append('<li class="divider"></li><li><a href="#" id="make-room">Make a Room</a></li>');
				$("#make-room").click(_.bind(this.selectRoom, this, "MYROOM"));

				//========== search typeahead
				this["typeahead"].data('typeahead').source = source;

				//========== chat typeahead
				/*
				require(["views/chatinput"], function(chatinput){
					for(var key in source) source[key] = "..room "+source[key];
					chatinput.setTypeahead("rooms", source);
				});
				*/
		},
		getRooms: function() {
			$.getJSON("/api/rooms", _.bind(this.onJSON, this));
			return true;
		}
	})
	return new View();
})