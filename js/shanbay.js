var $btn = $("#btn");
var status;
setStatus();
$btn.click(function(event) {
	if (event.target.id == "btn") {
		if($(this).html() == "开启"){
			$(this).html("关闭");
			localStorage["status"] = "open";
			$(this).addClass("changed");
			chrome.storage.sync.set({"status":"clear"},function(){
				console.log("设置清除");
			});
			//切换页面，这里清除页面格式；
		}
		else{
			$(this).html("开启");
			localStorage["status"] = "closed";
			$(this).removeClass("changed");
			chrome.storage.sync.set({"status":"reload"},function(){
				console.log("设置重载");
			});
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

function setStatus(){
	status = localStorage["status"];
	status = status?status:"closed";
	setBtn();
}

