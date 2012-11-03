requirejs.config({
	baseUrl: '../../js',
	paths: {},
	waitSeconds: 10
});

var cf;
var user_name;
var user_pwd;
var challenge_field;
var response_field;
var captcha_loaded;
var locale;
$(function() {
	require(["i18n!nls/text"], function(Locale) {
		locale = Locale;
		for(var key in locale.auth) if(key.indexOf("#") == 0 || key.indexOf(".") == 0) {
			if(key.indexOf("placeholder") != -1) {
				var id = key.replace("_placeholder", "");
				$(id).attr("placeholder", locale.auth[key]);
			} else {
				$(key).html(locale.auth[key]);
				$(key).val(locale.auth[key]);
			}
		}

		cf = cf_app_api(start, handleMsg);
	});
});

function start() {
	cf.commands(["name ", "password ", "login", "reg", "pw ", "guest-login"]);
	user_name = $("input[name=user]");
	user_pwd = $("#pwd");
	user_name.val(cf.user.name);
	if(cf.user.name) applyUserBadge();
	//$("#login_login-main")
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
	$("#guest-login").click(guest_login);
}

var userBadges={};
function applyUserBadge() {
	var username = $("#user").val();
	if(!username || username.length == 0 || username==" " || username.indexOf("..")!=-1) return;
	var index = userBadges[username];
	var file = "";
	if(!index) {
		$.getJSON("/api/badge/" + username, function(data) {
			if(!data) return;
			userBadges[username] = data.badge ? data.badge : "None";
			applyUserBadge(username);
		});
		return;
	} else if(index == "None" || !index) {
		file = "dino64x42.jpg";
		//return;
	} else {
		file = index;
	}
	$("#badge_peek").attr("src", "/imgs/users/" + file);
}
$("#user").focusout(applyUserBadge);
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
	$("#human_check").css("display", "none")
	$("#human_check").hide();
	$("#human_check").fadeIn(300);
}

function moveRegBtn() {
	var reg = $("#reg"); //.remove();
	reg.attr("tabindex", "7");
	reg.appendTo("#login_login-main");
	reg.val("I've confirmed my password!");
}
/*
$(':file').change(function(){
    var file = this.files[0];
    name = file.name;
    size = file.size;
    type = file.type;
    if(size > 1024*7) alert("File size is too large, must be under 7kb.");
    $("badge").val('');
    //your validation
});
*/
function post_login(name, pwd) {
	$.post("/api/get/" + name, {
		"pwd": pwd
	}, function(data) {
		console.log("info: " + data.status + " " + data.name + " " + data.created + " " + data.auth_token);
		if(data.status == "0") {
			login(data.name, data.auth_token);
		} else {
			alert("Login error: " + locale.auth_status[data.status]);
		}
		//console.log(data.name); 
		//cf.resize();
	}, "json");
}

function post_reg(name, pwd) {
	var email = $("#email").val();
	var pwdc = $("#pwdc").val();
	if(name == "") {
		alert("Name field empty");
		return;
	}
	if(email == "") {
		alert("Email field empty");
		return;
	}
	if(pwd == "") {
		alert("Password field empty");
		return;
	}
	if(pwdc == "") {
		alert("Password confirmation field empty");
		return;
	}
	if(pwdc != pwd) {
		alert("Password doesn't match!");
		return;
	}

	var data = {
		"pwd": pwd,
		"pwdc": pwdc,
		"email": email
	}
	//"recaptcha_challenge_field":challenge_field.val(), 
	//"recaptcha_response_field":response_field.val()};
	//alert(response_field.val()+ "  "+challenge_field.val());
	$.post("/api/save/" + name, data, function(data) {
		console.log("reg status:" + data.status);

		if(data.status == "0") {
			//login(data.name, data.auth_token);
			post_login(name, pwd);
		} else {
			//Recaptcha.reload();
			alert("Registration error: " + locale.auth_status[data.status]);
		}
		//if(data.status=="exists") {
		//	alert("user name already exists");
		//}
		cf.resize();
	}, "json");
}

function guest_login() {
	post_login("guest", "guestguest");
}

function login(name, auth_token) {
	cf.system('reload ' + name + ' ' + auth_token);
}

function forgot_pwd() {

}

function handleMsg(msg) {
	var data = msg.cmd;

	data = data.toLowerCase();

	if(data == "name" || data == "n") {
		user_name.val(msg.msg);
		applyUserBadge();
	}
	if(data == "p" || data == "pw" || data.indexOf("pass") != -1) {
		user_pwd.val(msg.msg);
	}
	if(data.indexOf("reg") != -1 || data == "r" || data.indexOf("new") != -1) {
		$("#reg").click();
	}
	if(data.indexOf("back") != -1 || data == "l" || data.indexOf("logi") == 0) {
		$("#login").click();
	}

	if(data.indexOf("guest-login") == 0) guest_login();
}