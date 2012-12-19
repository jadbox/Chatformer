var cf;
//html5 canvas
var canvas;
//canvas context
var ctx;

var cf_local = function()
{
	this.system = function(inputString)
	{
		alert(inputString);
	}
	this.cmds = [];
	this.commands = function(commandArray)
	{
		cmds = commandArray;
	}
	this.user = {
		isOwner:true
	}
}
$(function() {
	//alert("hellllooooooo!");
	//cf = cf_app_api(onRdy, handleMsg, {require:["posting", "listening"]}); // , 
	var saved_replayLog = 
	["out", "jonathan: .vote%20borderlands2", "out", "jonathan: ..resize%20255",
	 "in", "jonathan%3A%20.vote%20borderlands2", "out", "jonathan: ..resize%20335"];
	cf = cf_app_api(onRdy, handleMsg, {debug:true, replay: saved_replayLog});
	onRdy();
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
	if(cf.user.isOwner || true) runLogic();
	alert( cf.user.isOwner );
}

function runLogic() {
	setInterval(function(){
		if(Math.random() > .9) return;
		console.log("ownder spawn");
		cf.system("spawn ogre"); // owner relays info [directly] to all clients
	}, 3000);
}

function addMonster(msg) {
	alert("adding");
	monsters.push( new MonsteModels(msg.msg) );
}

var monsters = [];
var MonsterModels = function(name, hp, att) {
	hp = hp || 10;
	att = att || 2;
	this.name = name;
	this.hp = hp;
	this.att = att;

	this.update = function() {
		cf.say("ogre joined");
	}
	this.stop = function() {
		this.proc.stop();
	}

	this.proc = setTimeout(this.update, 3000);
};

//var voteData = {};
//var usersVoted = {};
//array of player hashmaps
var players = [];

var charDisplay = function() {
	var image = new Image();
	//this.image.src = "img/demon.jpg";

}

function player(username, character) {
	this.username = username;
	this.character = character;
	this.disp = new charDisplay();
	
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

function handleMsg(msg) 
{
	if(cmd == "spawn") {
		addMonster(msg);
	}
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
		if(msg.user == cf.user.name)
		{
			//$('#header').css('display', 'none');
			//$('#battle').css('display', 'block');
			init();
			cf.resize();
		}else{

		}
	}
}

function init()
{
	// Create the canvas
	
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = 512;
	canvas.height = 480;

	document.getElementById('battlecanvas').appendChild(canvas);
}