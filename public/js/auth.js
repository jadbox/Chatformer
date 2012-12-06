// JavaScript Document
define(["cookie"], {
	"logout": function() {
		var cmd = function(data) {
				if(data.status !== "success") alert("ERROR with status");
				window.location.reload();
		};
		$.post("/api/logout/" + this.getName(), {
			"auth_token": this.getAuthToken()
		}, cmd, "json");

		$.removeCookie('auth_token', {
					path: '/'
		});
	},

	"login": function(name, token) {
		console.log("name" + name + " token" + token);
		$.cookie('name', name, {
			expires: 3,
			path: '/'
		});
		$.cookie('auth_token', token, {
			expires: 3,
			path: '/'
		});
		window.location.reload();
	},

	"isLoggedIn": function() {
		var auth_token = this.getAuthToken();
		return this.getName() && auth_token && auth_token.length > 0;
	},


	"user": function() {
		return {
			"name": this.getName(),
			"token": this.getAuthToken()
		};
	},

	"getName": function() {
		return $.cookie('name') || ''; // || 'guest'
	},

	"getAuthToken": function() {
		return $.cookie('auth_token');
	}
})