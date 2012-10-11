// JavaScript Document
$(function() {
	$('#profile').click(function() {
		auth_logout();
		return false;
	});
})
function auth_logout() {
	$.removeCookie('auth_token', { path: '/' });
	window.location.reload();
}
function auth_onLogin(name, token) {
	$.cookie('auth_token', token, { expires: 1, path: '/' });
	$.cookie('name', name, { expires: 1, path: '/' });
	window.location.reload();
}
function isAuth() {
	var auth_token = $.cookie('auth_token') || '';
	return auth_token && auth_token.length > 0;
}
function getName() {
	return $.cookie('name');
}
function temp() {
	var chatter = [
	"hello there",
	"so welcome!"
	];
	delayed_convo(chatter);
	//delayed_stream("So welcome!");
}