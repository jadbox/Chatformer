function onLoad() {
  flog_navStart("html");
  connect(); update_ui();
  addApp("http://jadders.dyndns.org:81/apps/appvote.html");
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

