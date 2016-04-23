var selectedWord;
var selectString;
var $article = $("#article h1,figure,p");


window.onmouseup = function(){
    selectedWord = window.getSelection();
    if(selectedWord.anchorOffset != selectedWord.extentOffset){
        selectString = selectedWord.toString();
    }
}

function createHTML(){
	$("body").html($article);
}


