define(["chat", 'underscore', 'backbone'], function(chat) {
	var View = Backbone.View.extend({
		id: "",
		isOwner: false,
		changeRoom: function(msg) {
			var new_room = msg.msg;
			if(new_room==this.id) return;
			this.id = new_room;
			this.isOwner = false;
			this.el.empty()
			this.el.text(new_room.toUpperCase());
			this.trigger("roomChange", new_room);
		},
		initialize: function() {
			this.el = $("#room-name");
		}
	});
	var view = new View()
	
	chat.on("onSys", function(msg){
		if(msg.cmd=="room") view.changeRoom(msg);
		else if(msg.cmd=="owner") {
			view.isOwner = true;
		}
	});
	return view;
});