var cf;
$(function() {
	cf = cf_app_api(onRdy, handleMsg); // , {require:["posting", "listening"]}
	cf.onAction.left = onLeft;
});

function onLeft(msg) {
	var votedFor = usersVoted[msg.user];
	if(!votedFor) return;
	voteData[votedFor] = voteData[votedFor] - 1;
	if(voteData[votedFor] < 1) delete voteData[votedFor];
	delete usersVoted[msg.user];
	refresh();
}

function onRdy() {
	//cf.system("say hello!"); //posting
	var cmds = [];
	$("input[type='radio']").each(function() {
		cmds.push("run " + $(this).val());
	});
	cf.commands(cmds);

	$("input[type='radio']").change(function() {
		var voteval = $("input[name=VoteGroup]:checked").val();
		cf.action('run ' + voteval);
		return false;
	});

	$("#custom_url").keyup(function() {
		cf.action('run ' + $("#custom_url").val());
		$("#custom_url").val('');
		return false;
	});
}

var voteData = {};
var usersVoted = {};

function handleMsg(msg) {
	/*if(msg.type=="txt") { // listening
		alert(msg.raw);
	}*/
	if(cf.user.isOwner==false) {
		alert("Room owner can only pick app");
		return;
	}
	if(msg.type != "app") return;
	var cmd = msg.cmd;
	var data = msg.msg;
	if(cmd == "run") {
		cf.system('app ' + msg.msg);
	}
}
function refresh() {
	// refresh

	var comp = $('#tally');
	comp.html('');
	for(var i in voteData) {
		comp.append(" " + i + " has " + voteData[i] + "# votes")
	}
	comp.append("<h5>Users:</h5>");
	for(var i in usersVoted) {
		comp.append(" " + i + " voted " + usersVoted[i])
	}
	cf.resize();
}