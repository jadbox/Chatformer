define(["chat", 'underscore', 'backbone'], function(chat) {
	var View = Backbone.View.extend({
		room: "",
		changeRoom: function(msg) {
			if(msg.cmd!="room") return;
			var new_room = msg.msg;
			this.room = new_room;
			this.el.empty()
			this.el.text(new_room.toUpperCase());
			this.trigger("roomChange", new_room);
			
		},
		initialize: function() {
			this.el = $("#room-name");
			chat.on("onSys", _.bind(this.changeRoom, this) );
		}
	});
	var view = new View()

	return view;
});