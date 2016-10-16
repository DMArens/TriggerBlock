var isEnabled = true

chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
  if(message.text == "EnabledCheck")
    sendResponse({isEnabled:isEnabled});
});
