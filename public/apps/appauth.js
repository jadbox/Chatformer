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

var voteData = {};
function handleAppMsg(msg) {
	var data = msg.split(" ");
	if (data[0] == "vote") {
		//alert("a "+data[1]);
		var c = voteData[data[1]] || 0;
		voteData[data[1]] = c + 1;

		var comp = $('#tally');
		comp.html('');
		for (var i in voteData) {
			comp.html(comp.html() + " " + i + ":" + voteData[i])
		}
		//$("input[name=VoteGroup]").attr("disabled", "disabled"); // only for auth user
	}
}