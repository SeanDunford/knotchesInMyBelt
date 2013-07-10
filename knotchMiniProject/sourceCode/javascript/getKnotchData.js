
function otherStuff(){
		$.ajax({
		url: "http://127.0.0.1:8080/?proxy="+encodeURIComponent("http://dev.knotch.it:8080/miniProject/user_feed/5019296f1f5dc55304003c58/10"),
		context: document.body
	}).done(function(data){
		console.log(data); 
		var knotches = data.knotches; 
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
				var thisKnotch = $("<div>"); 
				thisKnotch.attr("class", "knotchNumber"+knotchCounter);
				var reply = data.knotches[knotchCounter].replies;
				var knotchComments; 
				var sentimentColor = getSentimentColor(knotches[knotchCounter].sentiment);
				thisKnotch.append(
				generateKnotch(knotches[knotchCounter].topic, 
							   knotches[knotchCounter].comment, 
							   knotches[knotchCounter].userId.profilePicUrl, 
							   knotches[knotchCounter].userId.name,
							   sentimentColor,
							   knotches[knotchCounter].sentiment)); 
				if(reply.length > 0){
					for (var replyCounter =0; replyCounter < reply.length; replyCounter++){
						
						thisKnotch.append(knotchComments = generateKnotchComment(reply[replyCounter].userId.profilePicUrl,
																   reply[replyCounter].userId.name,
																   reply[replyCounter].reply));
					}
				}
				thisKnotch.append(generateNewCommentBox());
				knotchContainer.append(thisKnotch);
		}
		}
	});
}
function getSentimentColor(sentiment)
{	
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
	//Don't forget. What if it's a white bubble?
	return ("background-color: "+colorCode[sentiment]);
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
function generateKnotch(title, opinion, pictureUrl, name, sentimentColor, sentiment){
	var source   = $("#knotch").html();
	var template = Handlebars.compile(source);
	var context = {knotchTitle:title, knotchersOpinion:opinion, knotchersPicture:pictureUrl, knotchersName:name, insertableStuff:sentimentColor, triangleCode:sentiment };
	var html    = template(context);
	return html; 
}
function generateNewCommentBox()
{
	var source   = $("#newCommentBox").html();
	var template = Handlebars.compile(source);
	var context = {};
	var html    = template(context);
	return html; 
}