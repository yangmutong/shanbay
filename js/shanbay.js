var $btn = $("#btn");
var status = localStorage.status;
status = status?status:"closed";
console.log(status);
init();
$btn.click(function(event) {
	// body...
	if (event.target.id == "btn") {
		if($(this).html() == "开启"){
			$(this).html("关闭");
			localStorage.status = "open";
			$(this).addClass("changed");
			//切换页面，这里清除页面格式；
		}
		else{
			$(this).html("开启");
			localStorage.status = "closed";
			$(this).removeClass("changed");
			//切换页面，将页面还原为原来的格式；
		}
	}
});

function setBtn(){
	if(status == "open"){
		$btn.html("关闭");
		$btn.addClass("changed");
	}
	else{
		$btn.html("开启");
		$btn.removeClass("changed");
	}
}

function init(){
	setBtn();
}

chrome.tabs.query({
	active:true,
	currentWindow:true,
},function(tabsArr){
	console.log(tabsArr);
});
