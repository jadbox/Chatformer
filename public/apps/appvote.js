var cf;
$(function() {
	cf = cf_app_api(onRdy, handleMsg);
});

function onRdy() {
	//alert("name " + cf.user.name);
	$("input[type='radio']").change(function() {
		var voteval = $("input[name=VoteGroup]:checked").val();
		cf.action('vote ' + voteval);
		return false;
	});
}

var voteData = {};
function handleMsg(msg) {
	if(msg.type!="app") return;
	var cmd = msg.cmd;
	var data = msg.msg;
	if (cmd == "vote") {
		//alert("a "+data[1]);
		var c = voteData[data] || 0;
		voteData[data] = c + 1;

		var comp = $('#tally');
		comp.html('');
		for (var i in voteData) {
			comp.html(comp.html() + " " + i + ":" + voteData[i])
		}
		//$("input[name=VoteGroup]").attr("disabled", "disabled"); // only for auth user
	}
}