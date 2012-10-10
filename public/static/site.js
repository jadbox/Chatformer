function onLoad() {
	flog_navStart("html");
	if(isAuth()) authed(); 
	else notAuthed();
	update_ui();
}
function authed() {
	connect();
	addApp("http://jadders.dyndns.org:81/apps/appvote.html");
}
function notAuthed() {
	$('.authed').remove();
	//$('#chatinput').val("Use login form to start chatting!");
	addApp("http://jadders.dyndns.org:81/apps/appauth.html");
	$.getJSON('static/auth/authchat.json', function(data) {
		delayed_convo(data);
	});
}

function flog(msg) {
  var ft = $('#footer');
  ft.html(ft.html() + msg);
}
function flog_navStart(msg) {
	if(window.performance==undefined || performance.timing==undefined || performance.timing.navigationStart==undefined) {
		return;
	}

  var now = new Date().getTime();
  var page_load_time = now - performance.timing.navigationStart;
  flog(" "+msg+":" +(page_load_time / 1000));
}

//================

