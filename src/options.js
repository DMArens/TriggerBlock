var triggerStore = null

// add a trigger word to the list
function addTrigger() {
    var newTrigger = document.getElementById("trigger-input").value 
    chrome.storage.sync.get(
        "triggers"
    , function(data) {
        // log pre added data
        if (data.triggers.indexOf(newTrigger) === -1) {
            console.log(data)
            var obj = {}
            list = data.triggers
            list.push(newTrigger)
            obj["triggers"] = list 

            chrome.storage.sync.set(obj, function(){
                appendList(newTrigger) 
            })
        }
    });
}

function listTriggers() {
    for (var item in triggerStore) {
        appendList(triggerStore[item])
    }
}

function appendList(item) {
    var list = $("#current-triggers")
    var button = $("<button id='" + item +"-button'>blah</button>") 
    list.append("<li>" + item + button[0].outerHTML + "</li>")
    $("#" + item + "-button").on("click", function(e) {
        triggerStore.splice(triggerStore.indexOf(item), 1)
        updateTriggers(triggerStore)
        $(e.target)[0].parentElement.remove()
    })
}

function updateTriggers(newTriggers) {
    chrome.storage.sync.set({triggers: newTriggers})
}

 

$(document).ready(function() {
    document.getElementById('save-trigger').addEventListener('click', addTrigger);

    chrome.storage.sync.get("triggers", function(data){
        if (Object.keys(data).length === 0) {
            chrome.storage.sync.set({triggers:[]})
            triggerStore = []
        } else {
            triggerStore = data.triggers
        }
        console.log(triggerStore)
        listTriggers()
    })
})
