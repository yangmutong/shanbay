window.onload = function(){
    var selectedWord;
    var selectString;
    var oldString;
    var $page = $("body>*");
    var $title = $("#article>header.content__head h1");
    var $subTilte = $("#article>header.content__head p");
    var $figure = $("#article>div.content__main figure");
    var $main = $("#article>div.content__main p");
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
                showTip(data,x,y);
                return data;
            },
            error:function(error){
                return error;
            }
        });
    }

    function createTip(){
        $("article").before("<div id='tip'></div>");
        var $tip = $("#tip");
        $tip.append("<div id='result'></div><div id='fail'>查询失败</div>");
        var $result = $("#result");
        $result.append("<div id='voice'><div id='play'></div><span id='ipa'></span></div>" +
                    "<div id='definition'><p id='comment'></p></div>");
        
    }


    function showTip(data,x,y){
        var $tip = $("#tip");
        var $result = $("#result");
        var $fail = $("#fail");
        var $voice = $("#voice");
        var $play = $("#play");
        var $ipa = $("#ipa");
        var $comment = $("#comment");
        $tip.show();
        if(data.status_code == 1){
            //查询不到单词，查询失败
            $fail.show();
        }
        else if(data.status_code == 0){
            //查询成功，显示Tip
            $result.show();
            audio.src = data.data.audio;
            $ipa.html("[" + data.data.pron + "]");
            $comment.html(data.data.definition);

        }
      
        var screenHeight = screen.height;
        var screenWidth = screen.width;
        var tipWidth = $tip.width();
        var tipHeight = $tip.height();
        $tip.css("left",x - tipWidth/2);
        $tip.css("top",y - tipHeight - 44);
        //如果提示框高度加20像素大于单词y坐标，则将tip移到单词下方。
        if (y < tipHeight + 20) {
            $tip.css("top",y + 20);
        }
        //如果提示框宽度的二分之一加20像素大于单词的x坐标，则将提示框移到单词斜上方或者斜下方以防止提示框超出边界。
        if (x < tipWidth/2 + 20) {
            $tip.css("left",10);
        }
        //如果单词位于屏幕的右方，未防止提出框跳出屏幕，需要对提示框的位置进行移动。
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
        $("header").append($title);
        $("header").append($subTilte);
        $article.append($figure);
        $article.append($main);
    }



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
        var currentHeight = 27;
        console.log(heightArr);
        heightArr.forEach(function(item,index){
            currentHeight += item;
            if(currentHeight <= screenHeight && (currentHeight+heightArr[index+1]) > screenHeight){
                range.push(index);
                currentHeight = 27;
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
        for (var i = 0;i < total;i++) {
            var id = "page" + (i+1);
            $pageWrapper.append("<a class='page' id=" + id + ">" + (i+1) + "</a>");
        }
        $("#page1").addClass("currentPage");
    }

    function changePage(nextIndex){
        console.log(range);
        $content.hide();
        $(".currentPage").removeClass("currentPage");
        $("#" + nextIndex).addClass("currentPage");
        nextIndex = +nextIndex[nextIndex.length - 1];
        var start = range[nextIndex - 1] + 1;
        var end = range[nextIndex];
        console.log(end);
        for (var i = start; i <= end;i++){
            $($content[i]).show();
        }
    }

    //重载页面
    function reloadPage(){
        location.reload();
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


    chrome.storage.sync.get("status",function(status){
        console.log(status);
        if (status["status"] == "clear") {
            init();
        }
    });
    chrome.storage.onChanged.addListener(function(changes,namespace){
        console.log(changes);
        for(var key in changes){
            console.log(changes[key]["newValue"]);
            if(key == "status"){
                if (changes[key]["newValue"] == "clear") {
                    //清除页面
                    init();
                }
                else{
                    //恢复页面
                    reloadPage();
                }
            }
        }
    });


    //弃用
    // chrome.runtime.onMessage.addListener(
    //   function(request, sender, sendResponse) {
    //     console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    //     if (request.order == "clear"){
    //      //这里精简页面并分页
    //      init();
    //          sendResponse({result: "success"});
    //     }
    //     else if (request.order == "reload") {
    //      //这里将页面恢复原状
    //      location.reload();
    //      sendResponse({result: "success"});
    //     }
    //   });

}