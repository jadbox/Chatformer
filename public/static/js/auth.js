// JavaScript Document
define(["cookie"], {
	"logout": function () {
		var cmd = function(data) {
				if(data.status !== "success") alert("ERROR with status");
				$.removeCookie('auth_token', {
					path: '/'
				});
				window.location.reload();
			}
		$.post("/api/logout/" + getName(), {
			"auth_token": getAuthToken()
		}, cmd, "json");
	},

	"login": function (name, token) {
		$.cookie('auth_token', token, {
			expires: 1,
			path: '/'
		});
		$.cookie('name', name, {
			expires: 1,
			path: '/'
		});
		window.location.reload();
	},

	"isLoggedIn": function () {
		var auth_token = this.getAuthToken() || '';
		return auth_token && auth_token.length > 0;
	},


	"user": function() {
		return {"name": this.getName(), "token": this.getAuthToken()}
	},

	"getName": function () {
		return $.cookie('name');
	},

	"getAuthToken": function () {
		return $.cookie('auth_token');
	}
})