var selectedWord;
var selectString;
var $article = $("#article h1,figure,p");


window.addEventListener("mouseup",function(event){
    selectedWord = window.getSelection();
    if(selectedWord.anchorOffset != selectedWord.extentOffset){
        selectString = selectedWord.toString();
        getDefinition(selectString);
        console.log(selectString);
    }
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
	$("body").html($article);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.order == "clear"){
    	//这里精简页面并分页
    	createHTML();
      	sendResponse({result: "success"});
    }
    else if (request.order == "reload") {
    	//这里将页面恢复原状
    	location.reload();
    	sendResponse({result: "success"});
    }
  });


