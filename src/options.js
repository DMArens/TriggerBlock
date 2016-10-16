// add a trigger word to the list
function addTrigger() {
    var newTrigger = document.getElementById("trigger-input").value 
    chrome.storage.sync.get(
        "trigger"
    , function(data) {
        // log pre added data
        console.log(data)
        var obj = {}
        list = data.trigger
        list.push(newTrigger)
        obj["trigger"] = list 
        chrome.storage.sync.set(obj, function(){
            // here for testing
            chrome.storage.sync.get("trigger", function(data){console.log(data)})
        })
    });
}

// reset storage each time for now
chrome.storage.sync.set({"trigger": []}, function(){})
 
document.getElementById('save-trigger').addEventListener('click', addTrigger);
