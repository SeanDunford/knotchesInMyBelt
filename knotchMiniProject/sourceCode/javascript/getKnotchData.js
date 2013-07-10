function submitComment(callingEvent){ //can't get this to post the ajax
		console.log(callingEvent); 
	   if (callingEvent.keyCode == 13) {
        return false;
    }
}
function processTweetLinks(text, style) {//jacked and modified from stack Broverflow
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    exp = /(^|\s)#(\w+)/g;
    if(style)
    {
    text = text.replace(exp, "$1<a class='opinionMention' href='http://search.knotch.it/search?q=%23$2' target='_blank'>#$2</a>");
    exp = /(^|\s)@(\w+)/g;
    text = text.replace(exp, "$1<a class='opinionMention' href='http://www.knotch.it/$2' target='_blank'>@$2</a>");
       }
    else{
    text = text.replace(exp, "$1<a class='mention' href='http://search.knotch.it/search?q=%23$2' target='_blank'>#$2</a>");
    exp = /(^|\s)@(\w+)/g;
    text = text.replace(exp, "$1<a class='mention' href='http://www.knotch.it/$2' target='_blank'>@$2</a>");
      
    }
    return text;
}
function getKnotchUserFeed(user, count){
		var knotchUrl;
		if(window.isProxyOn){
			knotchUrl = "http://127.0.0.1:8080/?proxy="+encodeURIComponent("http://dev.knotch.it:8080/miniProject/user_feed/"+user+"/"+count);
		}
		else {
			knotchUrl = encodeURIComponent("http://dev.knotch.it:8080/miniProject/user_feed/"+user+"/"+count);
		}
		$.ajax({
		url: knotchUrl,
		context: document.body
	}).done(function(data){
		console.log(data); 
		var knotches = data.knotches; 
		$("#userLocation").text(data.userInfo.location);
		$("#TopicStatsNumber").text(data.userInfo.num_topics); 
		$("#FollowersStatsNumber").text(data.userInfo.num_followers); 
		$("#FollowingStatsNumber").text(data.userInfo.num_following); 
		$("#GloryStatsNumber").text(data.userInfo.num_glory); 
		var listOfImgTags = $('.userImage'); 	
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
				var replies = data.knotches[knotchCounter].replies;
				var knotchComments; 
				var borderStyle = ""; 
				var sentimentColor = getSentimentColor(knotches[knotchCounter].sentiment);
					if (knotches[knotchCounter].sentiment === 10){
						borderStyle = "1px solid #000000"; 
					}
				var comment = processTweetLinks(knotches[knotchCounter].comment, 1); 
				thisKnotch.append(
				generateKnotch(knotches[knotchCounter].topic, 
							   comment, 
							   knotches[knotchCounter].userId.profilePicUrl, 
							   knotches[knotchCounter].userId.name,
							   sentimentColor,
							   knotches[knotchCounter].sentiment,
							   borderStyle,
							   knotches[knotchCounter]._id)); 
				if(replies.length > 0){
					for (var replyCounter =0; replyCounter < replies.length; replyCounter++){
						var reply = processTweetLinks(replies[replyCounter].reply);
						thisKnotch.append(knotchComments = generateKnotchComment(replies[replyCounter].userId.profilePicUrl,
						   replies[replyCounter].userId.name,
						   reply));

					}
				var commentBoxId = 0;
}				thisKnotch.append(generateNewCommentBox(data.knotches[knotchCounter]._id));
				knotchContainer.append(thisKnotch);
		}
		}
	});
}
function inputFocus(i){
    if(i.value==i.defaultValue){ i.value="";}
}
function inputBlur(i){
    if(i.value==""){ i.value=i.defaultValue;}
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
	return (colorCode[sentiment]);
}

function postAjax(){
$.ajax({
	url: "http://dev.knotch.it:8080/miniProject/51b35b742573da3965000520/reply",
	data: {comment: "Wow this challenge is Ruff!",	knotchId: "51b35b742573da3965000520", userId: "500e3a35bbcd086968000003",callback: "?"},
	success : handleData
	});
}
function handleData(data) {
    console.log(data);
    //do some stuff
}
function handleBarTesting(){
	var source   = $("#handleBarsTest").html();
	var template = Handlebars.compile(source);
	var context = {title: "My New Post", body: "This is my first post!"}
	var html    = template(context);
	return html; 
}
function generateKnotchComment(pictureUrl, name, reply){
	if(window.turnProxyOn){
		pictureUrl = "http://127.0.0.1:8080/?proxy="+ pictureUrl; 
	}

	var source   = $("#knotchComment").html();
	var template = Handlebars.compile(source);
	var context = {commentorsPicture: pictureUrl, commentorsName:name , commentorsReply: reply};
	var html    = template(context);
	return html; 
}
function generateKnotch(title, opinion, pictureUrl, name, sentimentColor, sentiment, borderStyle, knotchID){
	var source   = $("#knotch").html();
	var template = Handlebars.compile(source);
	var context = {knotchTitle:title, 
				   knotchersOpinion:opinion, 
				   knotchersPicture:pictureUrl, 
				   knotchersName:name, 
				   color:sentimentColor, 
				   triangleCode:sentiment, 
				   border:borderStyle, 
				   topicID:knotchID};
	var html    = template(context);
	return html; 
}
function generateNewCommentBox(boxID)
{
	var source   = $("#newCommentBox").html();
	var template = Handlebars.compile(source);
	var context = {commentBoxID:boxID};
	var html    = template(context);
	return html; 
}