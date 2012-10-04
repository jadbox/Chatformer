$(function() {
	var voteData = {};
	var parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''))
	if(parent_url.lastIndexOf("/")==parent_url.length-1) parent_url = parent_url.slice(0,parent_url.length-1); // fix
	
	$("input[type='radio']").change(function() {
		//alert("sending");
		var voteval = $("input[name=VoteGroup]:checked").val();
		$.postMessage('!vote ' + voteval, parent_url, parent);
		return false;
	});

	$.receiveMessage(function(e) {
		
		
		var data = e.data.split(" ");
		if (data[0] == "!vote") {
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
	}, parent_url);
	
	$(window).resize(function(e) {
        msgResize();
    });
	function msgResize() {
		$.postMessage({ '!!resize': $('body').outerHeight( true ) }, parent_url, parent );
	}
	msgResize();
});