$(function() {
	var cf = cf_app_startup(handleAppMsg, handleSysMsg, 0);

	$("input[type='radio']").change(function() {
		var voteval = $("input[name=VoteGroup]:checked").val();
		cf.post('vote ' + voteval);
		return false;
	});


});

function handleSysMsg(msg) {
}


function handleAppMsg(msg) {
	var data = msg.split(" ");
	if (data[0] == "name" || data[0] == "n") {
		$("input[name=user]").val(data[1]);
	}
	if (data[0] == "p" || data[0] == "pw" || data[0] == "pass" || data[0] == "password") {
		$("input[name=passwd]").val(data[1]);
	}
}