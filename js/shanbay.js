var $btn = $("#btn");
var currentId;
var status;
$btn.click(function(event) {
	if (event.target.id == "btn") {
		if($(this).html() == "开启"){
			$(this).html("关闭");
			localStorage["" + currentId] = "open";
			$(this).addClass("changed");
			sendMessage(currentId,{order:"clear"});
			//切换页面，这里清除页面格式；
		}
		else{
			$(this).html("开启");
			localStorage["" + currentId] = "closed";
			$(this).removeClass("changed");
			sendMessage(currentId,{order:"reload"});
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

function getCurrentTabId(callback){
	chrome.tabs.query({
	active:true,
	currentWindow:true,
	},function(tabsArr){
		callback(tabsArr[0].id);
	});

}

function setStatus(id){
	currentId = id;
	status = localStorage["" + currentId];
	status = status?status:"closed";
	setBtn();
}

getCurrentTabId(setStatus);


function sendMessage(tabId,message){
	chrome.tabs.sendMessage(tabId,message,function(response){
		console.log(response);
	})	
}

