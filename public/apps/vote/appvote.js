var cf;

//var replayLog = ["out", "..resize%20255", "out", "..userinfo", "out", "..roominfo", "out", "..users", "in", "..userinfo%20jonathan", "in", "..0", "in", "..roominfo%20lobby", "out", "jonathan: ..resize%20255", "in", "..users%20jonathan", "out", "jonathan: ..commands%20.vote%20borderlands3%7C%7C.vote%20diablo3%7C%7C.vote%20firefall", "out", "jonathan: .vote%20borderlands2", "out", "jonathan: ..resize%20255", "in", "jonathan%3A%20.vote%20borderlands2", "out", "jonathan: ..resize%20335"];
//, {debug:true, replay:replayLog}
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
	cf.commands(["vote borderlands3", "vote diablo3", "vote firefall"]);
	$("input[type='radio']").change(function() {
		var voteval = $("input[name=VoteGroup]:checked").val();
		cf.action('vote ' + voteval);
		return false;
	});
}

var voteData = {};
var usersVoted = {};

function handleMsg(msg) {
	/*if(msg.type=="txt") { // listening
		alert(msg.raw);
	}*/
	if(msg.type != "app") return;
	var cmd = msg.cmd;
	var data = msg.msg;
	if(cmd == "vote") {
		if(usersVoted[msg.user]) {
			alert("already voted");
			return;
		}
		usersVoted[msg.user] = data;
		var c = voteData[data] || 0;
		voteData[data] = c + 1;
		refresh();
		//console.log(cf.replayLog);
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