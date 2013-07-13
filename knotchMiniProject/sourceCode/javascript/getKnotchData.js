function newComment_OnKeyPress(callingEvent){ //can't get this to post the ajax
       if (callingEvent.keyCode == 13) {      //Was it enter? 
        postComment(callingEvent.target.value, callingEvent.target.id);
        callingEvent.target.value = 'Comment on this knotch...';
        callingEvent.target.blur(); 
        return false; 
    }
}

function postComment(comment, knotchId){ 
    //Pretend this is Ajax {Jedi Mind Trick}
        var commentorsInfo, 
            newComment,
            CommentPlaceHolder; 

        commentorsInfo = getCommentorsUserInformation(); 
        CommentPlaceHolder = $('#knotch'+knotchId).find('#commentsContainer'); 
        newComment = generateKnotchComment(commentorsInfo.profilePicUrl, commentorsInfo.name, comment); 
        CommentPlaceHolder.append(newComment);              
    }

function getCommentorsUserInformation (){
    //pretend getting from page state or cache or even ajax 
    return {location: "McLean, Virginia",
    name: "Bernie Volftsun",
    _id: "500e3a35bbcd086968000003",
    num_followers: 45,
    num_following: 39,
    num_glory: 152,
    num_knotches: 51,
    num_topics: 72,
    profilePicUrl: "https://graph.facebook.com/100001233207001/picture?type=square&width=200&height=200"}

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
        var knotchUrl, 
        	knotches, 
        	listOfImgTags, 
        	listOfNameTags, 
        	knotchContainer, 
        	thisKnotch,
        	knotchCounter, 
        	knotchComments, 
        	borderStyle,
        	sentimentColor, 
        	commentContainer; 

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
        knotches = data.knotches; 
        $("#userLocation").text(data.userInfo.location);
        $("#TopicStatsNumber").text(data.userInfo.num_topics); 
        $("#FollowersStatsNumber").text(data.userInfo.num_followers); 
        $("#FollowingStatsNumber").text(data.userInfo.num_following); 
        $("#GloryStatsNumber").text(data.userInfo.num_glory); 
        listOfImgTags = $('.userImage');     
        for(i=0;i<listOfImgTags.length;i++)
            { 
                $(listOfImgTags[i]).attr("src", data.userInfo.profilePicUrl);
            }
        listOfNameTags = $('.userName')
        for(i=0;i<listOfNameTags.length;i++)
            { 
                $(listOfNameTags[i]).text(data.userInfo.name)
            }
        if(knotches.length > 0){
            knotchContainer = $(".knotchContainer");
            for(knotchCounter = 0; knotchCounter < knotches.length; knotchCounter++){
                thisKnotch = $("<div>"); 
                thisKnotch.attr("id", "knotch"+data.knotches[knotchCounter]._id);
                replies = data.knotches[knotchCounter].replies;
                knotchComments; 
                borderStyle = ""; 
                sentimentColor = getSentimentColor(knotches[knotchCounter].sentiment);
                    if (knotches[knotchCounter].sentiment === 10){
                        borderStyle = "1px solid #000000"; 
                    }
                comment = processTweetLinks(knotches[knotchCounter].comment, 1); 
                thisKnotch.append(
                generateKnotch(knotches[knotchCounter].topic, 
                               comment, 
                               knotches[knotchCounter].userId.profilePicUrl, 
                               knotches[knotchCounter].userId.name,
                               sentimentColor,
                               knotches[knotchCounter].sentiment,
                               borderStyle,
                               knotches[knotchCounter]._id)); 
                commentContainer = thisKnotch.find('#commentsContainer')
                if(replies.length > 0){
                    for (var replyCounter =0; replyCounter < replies.length; replyCounter++){
                        var reply = processTweetLinks(replies[replyCounter].reply);
                        commentContainer.append(generateKnotchComment(replies[replyCounter].userId.profilePicUrl,
                           replies[replyCounter].userId.name,
                           reply));

                    }
                }
                thisKnotch.append(generateNewCommentBox(data.knotches[knotchCounter]._id));
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
    "0":    ["#2e5ca6"],    
    "2":    ["#586db9"],
    "4":    ["#008fd0"],    
    "6":    ["#57cccc"],    
    "8":    ["#ceebee"],    
    "10":    ["#ffffff"],    
    "12":    ["#ffeec3"],    
    "14":    ["#ffcc43"],    
    "16":    ["#ffa02d"],    
    "18":    ["#ff6d3a"],    
    "20":    ["#ee443a"]    
};        
    //Don't forget. What if it's a white bubble?
    return (colorCode[sentiment]);
}

function postAjax(){
$.ajax({
    url: "http://dev.knotch.it:8080/miniProject/51b35b742573da3965000520/reply",
    data: {comment: "Wow this challenge is Ruff!",    knotchId: "51b35b742573da3965000520", userId: "500e3a35bbcd086968000003",callback: "?"},
    success : handleData
    });
}
function handleData(data) {
    //do some stuff
}
function handleBarTesting(){
   var source, template, context, html;  
     source   = $("#handleBarsTest").html();
     template = Handlebars.compile(source);
     context = {title: "My New Post", body: "This is my first post!"}
     html    = template(context);
    return html; 
}
function generateKnotchComment(pictureUrl, name, reply){
   var source, template, context, html; 
    if(window.turnProxyOn){
        pictureUrl = "http://127.0.0.1:8080/?proxy="+ pictureUrl; 
    }

     source   = $("#knotchComment").html();
     template = Handlebars.compile(source);
     context = {commentorsPicture: pictureUrl, commentorsName:name , commentorsReply: reply};
     html    = template(context);
    return html; 
}
function generateKnotch(title, opinion, pictureUrl, name, sentimentColor, sentiment, borderStyle, knotchID){
    var source, template, context, html; 
     source   = $("#knotch").html();
     template = Handlebars.compile(source);
     context = {knotchTitle:title, 
                   knotchersOpinion:opinion, 
                   knotchersPicture:pictureUrl, 
                   knotchersName:name, 
                   color:sentimentColor, 
                   triangleCode:sentiment, 
                   border:borderStyle, 
                   topicID:knotchID};
     html    = template(context);
    return html; 
}
function generateNewCommentBox(boxID)
{	var source, template, context, html;
     source   = $("#newCommentBox").html();
     template = Handlebars.compile(source);
     context = {commentBoxID:boxID};
     html    = template(context);
    return html; 
}