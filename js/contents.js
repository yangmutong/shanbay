var selectedWord;
var selectString;
var $header = $("#article>header.content__head h1,p");
var $main = $("#article .content__main figure,p");
var range = new Array();    
var $content;


//划词翻译

function handleSelcetion(event){
	selectedWord = window.getSelection();
    if(selectedWord.anchorOffset != selectedWord.extentOffset){
        selectString = selectedWord.toString();
        getDefinition(selectString);
        console.log(selectString);
    }
}

window.addEventListener("mouseup",function(event){
	handleSelcetion(event);
},false);
window.addEventListener("touchend",function(event){
	handleSelcetion(event);
},false);


function getDefinition(word){
	$.ajax({
		type:"GET",
		url:"https://api.shanbay.com/bdc/search/?word=" + word,
		dataType:"json",
		success:function(data){
			var d = JSON.stringify(data)
			console.log(d);
			var t = JSON.parse(d);
			console.log(t);
			console.log(t.data.definition);
		},
		error:function(error){
			console.log(error);
		}
	});
}


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

	function pageDiv(){
        range.push(-1);
        $content = $("article>*");
        var len = $content.length;
        console.log(len);
        var screenHeight = screen.height;
        console.log(screenHeight);
        var heightArr = new Array();
        $content.each(function(index){
            heightArr[index] = $(this).height();
        });
        console.log(heightArr);
        console.log(heightArr.length);
        var currentHeight = 0;

        heightArr.forEach(function(item,index){
            currentHeight += item;
            if(currentHeight >= screenHeight && (currentHeight-item) < screenHeight){
                console.log(currentHeight);
                range.push(index);
                currentHeight = 0;
            }
        });
        if(range[range.length - 1] < heightArr.length){
            range.push(heightArr.length - 1);
        }
        console.log(range);
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
        $(".page").click(function(event){
            changePage(event.target.id);
            console.log(event.target.id);
        });
    }