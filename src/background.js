var isEnabled = true

function blockHandler(info, tab) {
	console.log(info);
	console.log(tab);
	chrome.tabs.sendMessage(tab.id, "blockTrigger", function() {});
}

chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
	if(message.text == "EnabledCheck")
		sendResponse({isEnabled:isEnabled});
});

chrome.contextMenus.create({
	"title": "Block Trigger",
	"contexts": ["image"],
	"onclick" : blockHandler
});
