var triggerStore = null
// add a trigger word to the list
function addTrigger() {
	var newTrigger = document.getElementById("trigger-input").value.replace(/^\s+|\s+$/g, '') 
	chrome.storage.sync.get(
		"triggers"
	, function(data) {
		// log pre added data
		if (data.triggers.indexOf(newTrigger) === -1 && newTrigger.length !== 0) {
			console.log(data)
			var obj = {}
			list = data.triggers
			list.push(newTrigger)
			obj["triggers"] = list 
            
			chrome.storage.sync.set(obj, function(){
				appendList(newTrigger) 
				document.getElementById("trigger-input").value = "" 
                triggerStore = list
                updateCount()
			})
		}
	});
}

function listTriggers() {
	for (var item in triggerStore) {
		appendList(triggerStore[item])
	}
    updateCount()
}

function updateCount() {
    $("#trigger-count").text("No. of Triggers: " + triggerStore.length) 
}

function appendList(item) {
	var list = $("#current-triggers")
	var button = $("<button class='remove'>X</button>") 
	$(button).on("click", function(e) {
		triggerStore.splice(triggerStore.indexOf(item), 1)
		updateTriggers(triggerStore)
		$(e.target)[0].parentElement.remove()
	})
	var combined = $("<li>" + item + "</li>").append($(button)) 
    combined.appendTo(list)
}

function updateTriggers(newTriggers) {
	chrome.storage.sync.set({triggers: newTriggers})
    triggerStore = newTriggers
    updateCount()
}

 

$(document).ready(function() {
	document.getElementById('save-trigger').addEventListener('click', addTrigger);
	$('input').keypress(function (e) {
		if (e.which == 13) {
			addTrigger()
		return false;	 //<---- Add this line
	  }
	}); 

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
