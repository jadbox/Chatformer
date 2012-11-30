SyntaxHighlighter.all()

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
	cf.commands(["vote borderlands3", "vote diablo3", "vote firefall"]);
	
}

function handleMsg(msg) {
	/*if(msg.type=="txt") { // listening
		alert(msg.raw);
	}*/
	if(msg.type != "app") return;
	var cmd = msg.cmd;
	var data = msg.msg;
	if(cmd == "vote") {
		
		cf.resize();
	}
	
}
