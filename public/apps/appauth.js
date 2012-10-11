var cf;
var user_name;
var user_pwd;
$(function() {
	user_name = $("input[name=user]");
	user_pwd = $("input[name=passwd]");
	cf = cf_app_startup(handleAppMsg, handleSysMsg, 0);

	$("#login").click(function() {
		//var voteval = $("input[name=VoteGroup]:checked").val();
		post_login(user_name.val(), user_pwd.val());
		return false;
	});
	$("#reg").click(function() {
		//var voteval = $("input[name=VoteGroup]:checked").val();
		post_reg(user_name.val(), user_pwd.val());
		return false;
	});

});

function post_login(name, pwd) {
	$.post("/api/get/"+name, { "pwd": pwd },
		function(data){
			console.log("info: "+data.status+data.name+ " "+data.created);
			if(data.status=="success") {
				login(data.name, data.auth_token);
			}
			//console.log(data.name); 
			//cf.resize();
			
 		}, "json");
}

function post_reg(name, pwd) {
	$.post("/api/save/"+name, { "pwd": pwd },
		function(data){
			console.log("reg status:"+data.status);
			cf.resize();
			
			if(data.status=="success") {
				//login(data.name, data.auth_token);
				post_login(name, pwd);
			}
 		}, "json");
}

function login(name, auth_token) {
	//$.cookie('auth_token', name, { expires: 1, path: '/' });
	cf.system('reload '+name+' '+auth_token);
}
function forgot_pwd() {
	
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