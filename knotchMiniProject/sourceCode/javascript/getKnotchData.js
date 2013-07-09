function doStuff()
	{ 
		$.ajax({
		url: "http://127.0.0.1:8080/?proxy="+encodeURIComponent("http://dev.knotch.it:8080/miniProject/user_feed/500e3b57bbcd08696800000a/10"),
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
		//$('#headerName').text(data.userInfo.name); 
		//$("#userName").text(data.userInfo.name); 
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

		if(data.knotches.length > 0){
			var commentToAppend, knotchToAppend =""; 
			for(var knotchCount=0;knotchCount < data.knotches.length;knotchCount++)
			{	
				$(".knotchHeaderTitle").text(data.knotches[knotchCount].topic); 
				$(".usersOpinion").text(data.knotches[knotchCount].comment);
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
		url: "http://127.0.0.1:8080/?proxy="+encodeURIComponent("http://dev.knotch.it:8080/miniProject/user_feed/500e3b57bbcd08696800000a/10"),
		context: document.body
	}).done(function(data){
		var knotches = data.knotches; 
		console.log(knotches);
		if(knotches.length > 0){
			var knotchContainer = $(".knotchContainer");
			for(var knotchCounter = 0; knotchCounter < knotches.length; knotchCounter++){
				//knotches[knotchCounter].topic
				knotchContainer.append("<div class=\"knotches\"><\/div><div class=\"knotchHeader\"><div class=\"knotchHeaderSpacer\">&nbsp;<\/div><div class=\"knotchHeaderTitle\">"+knotches[knotchCounter].topic+"<\/div>");
				knotchContainer.append("<div class=\"knotchHeaderArrow\"><a href=\"url\"><img src = \"assets\\topic-arrow.png\" alt=\"goToTopic\"><\/a><\/div><\/div>")
				knotchContainer.append("<div class=\"usersOpinionSpacer\">&nbsp;<\/div><div class = \"usersOpinionBubble\"><div class=\"usersOpinion\">"+knotches[knotchCounter].comment+"<\/div><\/div><div class=\"clear-left\"><\/div>")
				knotchContainer.append("<div class=\"knotchBoxSpacer\">&nbsp;<\/div><div class=\"knotchBox\"><img class =\"knotchTriangle\" src = \"knotchBoxes\\triangle0.png\" alt=\"goToKnotch\"><\/div>");
				knotchContainer.append("<div class=\"smallSpacer\"><\/div><div class=\"usersOpinionSpacer\">&nbsp;<\/div><div class=\"knotchOwner\"><img width=\"42px\" class=\"userImage\" src=\"assets\/userPicture.gif\"><span class =\"UserName\">Aron Tzimas<\/span><\/div><div class=\"smallSpacer\"><\/div>");
				knotchContainer.append("<div class=\"usersOpinionSpacer\">&nbsp;<\/div><div class=\"comment\"><input type=\"text\"  class =\"newCommentBox\" value=\"Comment on this knotch...\"><\/div><div class=\"clear-left\"><\/div><div class=\"smallSpacer\"><\/div>");
				knotchContainer.append("");
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
	var source   = $("#knotchComment").html();
	var template = Handlebars.compile(source);
	var context = {commentorsPicture: pictureUrl, commentorsName:name , commentorsReply: reply};
	var html    = template(context);
	return html; 
}