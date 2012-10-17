// JavaScript Document
function auth_logout() {
	var cmd = function(data) {
		if(data.status!=="success") alert("ERROR with status");
		$.removeCookie('auth_token', { path: '/' });
		window.location.reload();
	}
	/*if(force==true) {
		cmd({status:success});
		return;
	}*/
	$.post("/api/logout/"+getName(), { "auth_token": getAuthToken() },
			cmd, "json");
}
function auth_onLogin(name, token) {
	$.cookie('auth_token', token, { expires: 1, path: '/' });
	$.cookie('name', name, { expires: 1, path: '/' });
	window.location.reload();
}
function isAuth() {
	var auth_token = getAuthToken() || '';
	return auth_token && auth_token.length > 0;
}
function getName() {
	return $.cookie('name');
}
function getAuthToken() {
	return $.cookie('auth_token');
}