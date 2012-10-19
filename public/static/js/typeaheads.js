define({
	"chatinput": function(obj) {
		obj.typeahead({
			source: [{
				id: 1,
				name: ".vote borderlands2"
			}, {
				id: 4,
				name: ".vote firefall"
			}, {
				id: 5,
				name: ".vote diablo3"
			}, {
				id: 2,
				name: "#room chill"
			}, {
				id: 3,
				name: ".name "
			}]
		});
	}
	"search": function(obj) {
		obj.typeahead({
			source: [{
				id: 1,
				name: "root"
			}, {
				id: 2,
				name: "chill"
			}, {
				id: 3,
				name: "tech"
			}]
			//,complete:function() {alert("done");}
			//,itemSelected:function() {alert($("#room-search").val());}
		});
	}
})
//$("#room-search")