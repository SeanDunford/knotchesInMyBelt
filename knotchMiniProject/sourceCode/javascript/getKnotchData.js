function doStuff()
	{ 
		$.ajax({
		url: "http://127.0.0.1:8080/?proxy="+encodeURIComponent("http://dev.knotch.it:8080/miniProject/user_feed/5019296f1f5dc55304003c58/1000"),
		context: document.body																					 
	}).done(function(data) {
		console.log(data);
		var colorCode = {
			"0":	["#2e5ca6"],	
			"2":	["#586db9"],
			"4":	["#008fd0"],	
			"6":	["#57cccc"],	
			"8":	["#ceebee"],	
			"10":	["#ffffff"],	
			"12":	["#ffeec3"],	
			"14":	["#ffcc43"],	
			"16":	["#ffa02d"],	
			"18":	["#ff6d3a"],	
			"20":	["#ee443a"]	
			};


		if(data.knotches.length > 0){
			for(var knotchCount=0;knotchCount < data.knotches.length;knotchCount++)
			{	
				$(".usersOpinionBubble").css("background-color", colorCode[data.knotches[knotchCount].sentiment]); 		
				if(data.knotches[knotchCount].sentiment == "10"){
					$(".usersOpinionBubble").css("border","1px solid #000000"); 
				}
				 var triangle = "knotchBoxes/triangle" + data.knotches[knotchCount].sentiment + ".png";
				 $(".knotchTriangle").attr("src", triangle);
				//Don't forget. What if it's a white bubble? 
				if(data.knotches[knotchCount].replies.length > 0){
					for(var replyCount=0;replyCount < data.knotches[knotchCount].replies.length;replyCount++)
						{ 
							$(".commentsContainer").append(generateKnotchComment(data.knotches[knotchCount].replies[replyCount].userId.profilePicUrl,
												  data.knotches[knotchCount].replies[replyCount].userId.name,
												  data.knotches[knotchCount].replies[replyCount].reply));
						}
				}
			}
		}
	});
}
function otherStuff(){
		$.ajax({
		url: "http://127.0.0.1:8080/?proxy="+encodeURIComponent("http://dev.knotch.it:8080/miniProject/user_feed/5019296f1f5dc55304003c58/1000"),
		context: document.body
	}).done(function(data){
		console.log(data); 
		var knotches = data.knotches; 
		var colorCode = {
			"0":	["#2e5ca6"],	
			"2":	["#586db9"],
			"4":	["#008fd0"],	
			"6":	["#57cccc"],	
			"8":	["#ceebee"],	
			"10":	["#ffffff"],	
			"12":	["#ffeec3"],	
			"14":	["#ffcc43"],	
			"16":	["#ffa02d"],	
			"18":	["#ff6d3a"],	
			"20":	["#ee443a"]	
		};
		$("#userLocation").text(data.userInfo.location);
		$("#TopicStatsNumber").text(data.userInfo.num_topics); 
		$("#FollowersStatsNumber").text(data.userInfo.num_followers); 
		$("#FollowingStatsNumber").text(data.userInfo.num_following); 
		$("#GloryStatsNumber").text(data.userInfo.num_glory); 
		var listOfImgTags = $('.userImage')
		for(i=0;i<listOfImgTags.length;i++)
			{ 
				$(listOfImgTags[i]).attr("src", data.userInfo.profilePicUrl);
			}
		var listOfNameTags = $('.userName')
		for(i=0;i<listOfNameTags.length;i++)
			{ 
				$(listOfNameTags[i]).text(data.userInfo.name)
			}
		if(knotches.length > 0){
			var knotchContainer = $(".knotchContainer");
			for(var knotchCounter = 0; knotchCounter < knotches.length; knotchCounter++){
				$(".usersOpinionBubble").css("background-color", colorCode[data.knotches[knotchCounter].sentiment]); 		
				if(data.knotches[knotchCounter].sentiment == "10"){
					$(".usersOpinionBubble").css("border","1px solid #000000"); 
				}

				knotchContainer.append(
				generateKnotch(knotches[knotchCounter].topic, 
							   knotches[knotchCounter].comment, 
							   knotches[knotchCounter].userId.profilePicUrl, 
							   knotches[knotchCounter].userId.name)); 
		}
		}
	});
}
function handleBarTesting(){
	var source   = $("#handleBarsTest").html();
	var template = Handlebars.compile(source);
	var context = {title: "My New Post", body: "This is my first post!"}
	var html    = template(context);
	return html; 
}
function generateKnotchComment(pictureUrl, name, reply){
	pictureUrl = "http://127.0.0.1:8080/?proxy="+ pictureUrl; 
	var source   = $("#knotchComment").html();
	var template = Handlebars.compile(source);
	var context = {commentorsPicture: pictureUrl, commentorsName:name , commentorsReply: reply};
	var html    = template(context);
	return html; 
}
function generateKnotch(title, opinion, pictureUrl, name, sentiment){
	var source   = $("#knotch").html();
	var template = Handlebars.compile(source);
	var context = {knotchTitle:title, knotchersOpinion:opinion, knotchersPicture:pictureUrl, knotchersName:name};
	var html    = template(context);
	return html; 
}