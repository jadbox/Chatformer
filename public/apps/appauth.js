var cf;
var user_name;
var user_pwd;
$(function() {
	user_name = $("input[name=user]");
	user_pwd = $("input[name=passwd]");
	cf = cf_app_startup(handleAppMsg, handleSysMsg, 0);

	$("#login").click(function() {
		//var voteval = $("input[name=VoteGroup]:checked").val();
		login(user_name.val(), user_pwd.val());
		return false;
	});


});

function login(name, pwd) {
	$.post("/api/get/"+name, { "pwd": pwd },
		function(data){
			$(".content").append(data.name+ " "+data.note);
			//console.log(data.name); 
			cf.resize();
 		}, "json");
}
function reg(name, pwd) {
}
function forgot_pwd() {
}
function success() {
	cf.system('reload');
}

function handleSysMsg(msg) {
}


function handleAppMsg(msg) {
	var data = msg.split(" ");
	data[0] = data[0].toLowerCase();
	if (data[0] == "name" || data[0] == "n") {
		user_name.val(data[1]);
	}
	if (data[0] == "p" || data[0] == "pw" || data[0].indexOf("pass")!=-1) {
		user_pwd.val(data[1]);
	}
	if (data[0].indexOf("reg")!=-1 || data[0] == "r" || data[0].indexOf("new")!=-1) {
		$("#login").click();
	}
	if (data[0].indexOf("back")!=-1 || data[0] == "l" || data[0].indexOf("log")!=-1) {
		$("#reg").click();
	}
}