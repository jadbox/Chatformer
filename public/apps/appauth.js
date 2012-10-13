var cf;
var user_name;
var user_pwd;
var challenge_field;
var response_field;
var captcha_loaded;
$(function() {
	user_name = $("input[name=user]");
	user_pwd = $("#pwd");
	user_name.val($.cookie('name'));
	cf = cf_app_startup(handleAppMsg, handleSysMsg, 0);

	$("#login").click(function() {
		post_login(user_name.val(), user_pwd.val());
		return false;
	});
	$("#reg").click(function() {
		//var res = response_field?response_field.val():'';

		if(!captcha_loaded) {
			moveRegBtn();
	        addCaptcha();
			captcha_loaded = true;
		} else {
			post_reg(user_name.val(), user_pwd.val());
		}
		cf.resize();
		return false;
	});
});
/*
function addCaptcha() {
	Recaptcha.create("6LfFiNcSAAAAAJuUjMLQ0vY_C1mBD2KCQJswy1LF",
    	"human_check",
    	{
      	theme: "red",
     	 callback: function() {
			challenge_field = $("input[name=recaptcha_challenge_field]");
			response_field = $("input[name=recaptcha_response_field]");
			Recaptcha.focus_response_field();cf.resize();}
    	}
 	 );
}*/
function addCaptcha() {
	$('<label for="pwdc"></label><input name="pwdc" id="pwdc" placeholder="password confirmation" type="password" tabindex="1"/>').appendTo("#human_check");
	$('<br/><input name="email" id="email" placeholder="email (optional)" type="text" tabindex="1"/><br/><label for="email" style="font-size:x-small">* email is used for EPIC updates only!</label>').appendTo("#human_check");
}
function moveRegBtn() {
	var reg = $("#reg");//.remove();
	reg.appendTo("#login_login-main");
	reg.val("I've confirmed my password!");
}
function post_login(name, pwd) {
	$.post("/api/get/"+name, { "pwd": pwd },
		function(data){
			console.log("info: "+data.status+data.name+ " "+data.created);
			if(data.status=="success") {
				login(data.name, data.auth_token);
			} else {
				alert("Login error: "+data.status);
			}
			//console.log(data.name); 
			//cf.resize();
			
 		}, "json");
}

function post_reg(name, pwd) {
	var pwdc = $("#pwdc").val();
	if(name=="") { alert("Name field empty"); return; }
	if(pwd=="") { alert("Password field empty"); return; }
	if(pwdc=="") { alert("Password confirmation field empty"); return; }
	if(pwdc!=pwd) { alert("Password doesn't match!"); return; }
	
	var data = { "pwd": pwd, "pwdc": pwdc }
	//"recaptcha_challenge_field":challenge_field.val(), 
	//"recaptcha_response_field":response_field.val()};
	//alert(response_field.val()+ "  "+challenge_field.val());
	$.post("/api/save/"+name, data,
		function(data){
			console.log("reg status:"+data.status);
					
			if(data.status=="success") {
				//login(data.name, data.auth_token);
				post_login(name, pwd);
			} else {
				Recaptcha.reload();
				alert("Form error: "+data.status);
			}
			//if(data.status=="exists") {
			//	alert("user name already exists");
			//}
			cf.resize();
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