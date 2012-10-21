define(["underscore", "backbone"], function() {
	return Backbone.View.extend({
		el: $("#footer"),
		events: {
			"log": "flog"
		},
		flog: function (msg) {
			this.$el.append(msg);
		},
		initialize: function() {
			if(window.performance == undefined || performance.timing == undefined || performance.timing.navigationStart == undefined) return;

			var now = new Date().getTime();
			var page_load_time = now - performance.timing.navigationStart;
			this.flog(" html:" + (page_load_time / 1000));
		}
	});
})