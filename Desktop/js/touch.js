
document.ready = function(){
	var time = new Date();
	var year = time.getFullYear();
	var month = time.getMonth()+1;
	var day = time.getDate();
	$(".fc-day-content1").click(function(){
		var touchDay = $(this).parent().parent().find(".fc-day-number").text().split("-")[1];
		var touchMonth = $(this).parent().parent().find(".fc-day-number").text().split("-")[0];
		var touchYear = $("h2").html().substring(0,4);
		if(((touchMonth == month) && (touchDay >= day)) || touchMonth>month || touchYear>year){
			$(".fc-day-content2").removeClass("touched");
			$(".fc-day-content1").removeClass("touched");
			$(this).addClass("touched");
		}
		
	})
	$(".fc-day-content2").click(function(){
		var touchDay = $(this).parent().parent().find(".fc-day-number").text().split("-")[1];
		var touchMonth = $(this).parent().parent().find(".fc-day-number").text().split("-")[0];
		var touchYear = $("h2").html().substring(0,4);
		if(((touchMonth == month) && (touchDay >= day)) || touchMonth>month || touchYear>year){
			$(".fc-day-content1").removeClass("touched");
			$(".fc-day-content2").removeClass("touched");
			$(this).addClass("touched");
		}
	})
}









