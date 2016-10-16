'use strict'

function blockTrigger(trigger) {
	if(trigger.nodeName == "IMG") {
		// Process the trigger to create an overlay
		var overlay = document.createElement("div");
		var width = "" + trigger.width + "px";
		var height = "" + trigger.height + "px";
		overlay.style.width = width;
		overlay.style.height = height;
		/* TODO: use config variable
		chrome.storage.sync.get("blocker", function(config) {
			var blockerColor = config.color;
		});
		*/
		overlay.style.backgroundColor = blockerColor || "#FF0000";
		overlay.classList.add("trigger-overlay");

		// Create a DOM element to replace the trigger with
		var replacement = document.createElement("div");
		replacement.classList.add("trigger-holder");

		// Remove the trigger and replace it
		replacement.appendChild(trigger);
		replacement.appendChild(overlay);
		trigger.parentNode.replaceChild(replacement, trigger);
	}
}

function clarifaiTrigger(image) {
	return true;
}

function triggerBlock() {
	var images = document.getElementsByTagName('img');
	for (var i = 0; i < images.length; i++) {
		if (clarifaiTrigger(images[i])) {
			blockTrigger(images[i])
		}
	}
}

if (document.readyState === "complete") {
	triggerBlock();
} else {
	document.addEventListener('DOMContentLoaded', function () {
		triggerBlock();
	});
}
