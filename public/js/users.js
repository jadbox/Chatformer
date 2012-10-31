define(['apps/msg', 'underscore', 'backbone'], function() {
	
	var User = Backbone.Model.extend({
	});

	var Users = Backbone.Collection.extend({
  		model: User
	});

	return new Users;
});