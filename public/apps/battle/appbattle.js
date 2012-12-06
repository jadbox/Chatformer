var cf;
$(function() {
	//alert("hellllooooooo!");
	cf = cf_app_api(onRdy, handleMsg, {require:["posting", "listening"]}); // , 
});

function onRdy() {
	cf.system("Prepare for battle!"); //posting
	//alert("hey hey!");
	cf.commands(["select girl","select demon"]);
	$("input[type='radio']").change(function() {
		var voteval = $("input[name=VoteGroup]:checked").val();
		cf.action('vote ' + voteval);
		return false;
	});
}

//var voteData = {};
//var usersVoted = {};
//array of player hashmaps
var players = [];

function player(username, character) {
	this.username = username;
	this.character = character;
	
	switch(character)
	{
		case "girl":
			this.hitpoints = 20;
			this.strength = 10;
			this.evasion = 15;
			this.imageURL = "img/girlsmall.jpg";
			break;
		case "demon":
			this.hitpoints = 30;
			this.strength = 13;
			this.evasion = 5;
			this.imageURL = "img/demonsmall.jpg";
			break;
	}
	//alert("thank you for choosing " + character + " you have " + this.hitpoints + " hitpoints");
}

function handleMsg(msg) {
	//alert(msg);
	if(msg.type!="app") return;
	var cmd = msg.cmd;
	var data = msg.msg;
	if(cmd == "select")
	{
		var curPlayer = new player(msg.user, msg.msg);
		players.push(curPlayer);
		$('#player_row').append('<div class="span1 pagination-centered" style="background-color:#ddd"><br/>'
		+	'<img src="' + curPlayer.imageURL + '" alt="dinoMate" />'
		+	'<p style="font-family:Tahoma, Geneva, sans-serif">' + curPlayer.username + ' the ' + curPlayer.character + '</p></div>');
		//$('#player_row').append('<div class="span1 pagination-centered"></div>');
		//alert("after");
		if(null != msg)
		{
			$('#header').css('display', 'none');
			$('#battle').css('display', 'block');
			cf.resize();
		}else{

		}
	}
	/*if (cmd == "vote") {
		if(usersVoted[msg.user]) {
			alert("already voted"); 
			return;
		}
		usersVoted[msg.user] = data;
		var c = voteData[data] || 0;
		voteData[data] = c + 1;

		var comp = $('#tally');
		comp.html('');
		for (var i in voteData) {
			comp.append(" " + i + " has " + voteData[i] +"# votes")
		}
		comp.append("<h5>Users:</h5>");
		for (var i in usersVoted) {
			comp.append(" " + i + " voted " + usersVoted[i])
		}
		cf.resize();
	}*/
}