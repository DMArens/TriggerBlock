var triggerStore = null
// add a trigger word to the list
function addTrigger() {
    var newTrigger = document.getElementById("trigger-input").value 
    chrome.storage.sync.get(
        "triggers"
    , function(data) {
        // log pre added data
        console.log(data)
        var obj = {}
        list = data.triggers
        list.push(newTrigger)
        obj["triggers"] = list 
        chrome.storage.sync.set(obj, function(){
            // here for testing
            var list = $("#current-triggers")
            list.append("<li>" + newTrigger + "</li>")
            chrome.storage.sync.get("triggers", function(data){console.log(data)})
        })
    });
}

function listTriggers() {
    var list = $("#current-triggers")
    for (var item in triggerStore.triggers) {
        list.append("<li>" + triggerStore.triggers[item] + "<button class='remove'>blah</button></li>")
    }
}

chrome.storage.sync.get("triggers", function(data){triggerStore = data})
 
document.getElementById('save-trigger').addEventListener('click', addTrigger);

$(document).ready(function() {
    listTriggers()
    $(".remove").click(function(e){
        console.log("clicked")
        
    })
})
