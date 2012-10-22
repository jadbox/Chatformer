define(["underscore", "backbone"], function() {
	var Logger = Backbone.View.extend({
		el: $("#footer"),
		events: {
			"log": "log"
		},
		log: function(msg) {
			if(window.performance == undefined || performance.timing == undefined || performance.timing.navigationStart == undefined) return;

			var now = new Date().getTime();
			var page_load_time = now - performance.timing.navigationStart;
			this.$el.append(" "+msg+":" + (page_load_time / 1000));
		},
		initialize: function() {
			
		}
	});
	return new Logger();
})