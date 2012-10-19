define(["backbone"], function() {
	return function(msg) {
		return {
			raw:msg,
			
		};
	}
});

	/*function() {
	return Backbone.Model.extend({
		raw: function(msg) {
			this.set({
				color: cssColor
			});
		}
	});
})*/