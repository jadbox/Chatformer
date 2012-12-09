var cf;
$(function() {
	cf = cf_app_api(onRdy, handleMsg, {require:["posting"]}); // , {require:["posting", "listening"]}
});

function onData(data) {
  var items = [];

  $.each(data.badges, function(key, val) {
  	var node = $('<a><img id="'+val+'" class="badge" src="/imgs/users/'+val+'"></a>');
    $("body").append(node);
  });

	$(".badge").click(function() {
		setBadge( $(this).attr('id') );
		//cf.action( "badge " + $(this).attr('id') );
		return false;
	});
	cf.resize();
	setInterval(cf.resize, 2000);
}

function setBadge(img) {
	if(!img) return;
	data = {auth_token:$.cookie('auth_token'), badge:img}
	$.post('/api/badge/'+cf.user.name, data, function(result){
		cf.say("This is my new badge!");
	});
}

function onRdy() {
	cf.say("welcome to your profile!", true);
	cf.say("This is my current badge.");
	//cf.system("background-css #33ff99 url('http://3.bp.blogspot.com/-swX1TZBkAko/TzJnbwg6-ZI/AAAAAAAAsLo/cPslKxRTrlE/s1600/Pembroke+Welsh+Corgi.jpg') no-repeat right top");
	//cf.system("say hello!");

	//cf.commands(["badge "]);
	
	$.getJSON('/api/badges', onData);
}

function handleMsg(msg) {
	if(msg.type!="app") return;
	var cmd = msg.cmd;
	var data = msg.msg;
		
	cf.resize();
}