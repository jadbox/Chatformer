// JavaScript Document
function isAuth() {
	var auth_token = $.cookie('auth_token') || '';
	return auth_token && auth_token.length > 0;
}
function temp() {
	var chatter = [
	"hello there",
	"so welcome!"
	];
	delayed_convo(chatter);
	//delayed_stream("So welcome!");
}