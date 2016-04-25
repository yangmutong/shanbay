var selectedWord;
var selectString;
var oldString;
var $header = $("#article>header.content__head h1,p");
var $main = $("#article .content__main figure,p");
var range = new Array();    
var $content;
var touch = new Array();
var audio = new Audio();


//划词翻译

function handleSelcetion(event){
	selectedWord = window.getSelection();
    if(selectedWord.anchorOffset != selectedWord.extentOffset){
        selectString = selectedWord.toString();
        selectString = selectString.trim();
        if (event.type == "touchend") {
            if (selectString != oldString) {
                oldString = selectString;
                getDefinition(selectString,touch[0],touch[1]);
            }else if (event.target.id != "play") {
                $("#tip").hide();
            }
        }
        else{
            oldString = selectString;
            getDefinition(selectString,event.clientX,event.clientY);
        }
    }
    else if (event.type == "mouseup") {
        $("#tip").hide();
    }
}

window.addEventListener("mouseup",function(event){
    if(event.target.id == "play"){
        event.stopPropagation();
        audio.play();
    }else{
        handleSelcetion(event);    
    }
	
},false);


window.addEventListener("touchstart",function(event){
    touch[0] = event.touches[0].clientX;
    touch[1] = event.touches[0].clientY;

},false);


window.addEventListener("touchend",function(event){
	handleSelcetion(event);
},false);


function getDefinition(word,x,y){
	$.ajax({
		type:"GET",
		url:"https://api.shanbay.com/bdc/search/?word=" + word,
		dataType:"json",
		success:function(data){
			var d = JSON.stringify(data)
			var t = JSON.parse(d);
            showTip(t,x,y);
            return t;
		},
		error:function(error){
            return error;
		}
	});
}

function createTip(){
    $("article").before("<div id='tip'></div>");
    var $tip = $("#tip");
    $tip.append("<div id='result'></div>");
    var $result = $("#result");
    $result.append("<div id='voice'><div id='play'></div><span id='ipa'></span></div>" +
                "<div id='definition'><p id='comment'></p></div>");
    
}


function showTip(data,x,y){
    var $tip = $("#tip");
    var $result = $("#result");
    var $voice = $("#voice");
    var $play = $("#play");
    var $ipa = $("#ipa");
    var $comment = $("#comment");
    $tip.show();
    if(data.status_code == 1){
        //查询不到单词，查询失败
        $result.show();
        $voice.hide();
        $("#comment").html("查询失败");
    }
    else if(data.status_code == 0){
        //查询成功，显示Tip
        $result.show();
        $voice.show();
        audio.src = data.data.audio;
        $ipa.html("[" + data.data.pron + "]");
        $comment.html(data.data.definition);

    }

    
    var screenHeight = screen.height;
    var screenWidth = screen.width;
    var tipWidth = $tip.width();
    var tipHeight = $tip.height();
    $tip.css("left",x - tipWidth/2);
    $tip.css("top",y - tipHeight - 20);
    if (y < tipHeight + 20) {
        $tip.css("top",y + 20);
    }
    if (x < tipWidth/2 + 20) {
        $tip.css("left",10);
    }
    if(x > screenWidth - tipWidth/2){
        $tip.css("left",x - tipWidth - 10);
    }
    
}


//精简页面
function createHTML(){
	$("body").empty();
	$("body").append("<article id='article-after'></article>");
	var $article = $("#article-after");
	$article.append("<header></header>");
	$("header").append($header);
	$article.append($main);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.order == "clear"){
    	//这里精简页面并分页
    	init();
      	sendResponse({result: "success"});
    }
    else if (request.order == "reload") {
    	//这里将页面恢复原状
    	location.reload();
    	sendResponse({result: "success"});
    }
  });

//进行分页
	function pageDiv(){
        range.push(-1);
        $content = $("article>*");
        var len = $content.length;
        var screenHeight = screen.height;
        var heightArr = new Array();
        $content.each(function(index){
            heightArr[index] = $(this).height();
        });
        var currentHeight = 0;

        heightArr.forEach(function(item,index){
            currentHeight += item;
            if(currentHeight >= screenHeight && (currentHeight-item) < screenHeight){
                range.push(index);
                currentHeight = 0;
            }
        });
        if(range[range.length - 1] < heightArr.length){
            range.push(heightArr.length - 1);
        }
    }
    function fillHTML(arr){
        $("article").after("<div class='pageWrapper'></div>");
        var $pageWrapper = $(".pageWrapper");
        var total = arr.length - 1;
        for (var i = 0; i < total;i++){
            var id = "page" + (i+1);
            $pageWrapper.append("<a class='page' id=" + id + ">" + (i+1) + "</a>");
        }
        $("#page1").addClass("currentPage");
    }

    function changePage(nextIndex){
        $content.hide();
        $(".currentPage").removeClass("currentPage");
        $("#" + nextIndex).addClass("currentPage");
        nextIndex = +nextIndex[nextIndex.length - 1];
        var start = range[nextIndex - 1] + 1;
        var end = range[nextIndex];
        for (var i = start; i <= end;i++){
            $($content[i]).show();
        }
    }

    function init(){
    	createHTML();
        pageDiv();
        fillHTML(range);
        changePage("page1");
        createTip();
        $(".page").click(function(event){
            event.stopPropagation();
            changePage(event.target.id);
        });

    }