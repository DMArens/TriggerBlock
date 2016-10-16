'use strict'

var app = new Clarifai.App(
	'{clientId}',
	'{clientSecret}'
);

function getTriggers() {
	var trigs;
	chrome.storage.sync.get("triggers", function(triggers) {
		trigs = triggers;
	});
	return trigs;
}


/**
 * Blocks a given element on the DOM.
 *
 * @trigger - the DOM element to block
 *
 * @return - true if successfully blocked. False is generally only returned if
 *		blocking is not supported for the given element.
 */
function blockTrigger(trigger) {
	if(trigger.nodeName == "IMG") {
		// Generate a trigger warning
		var hoverText = document.createElement("p");
		hoverText.textContent = "View Trigger";
		hoverText.classList.add("trigger-warning");

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
		// Add trigger warning to overlay
		overlay.appendChild(hoverText);

		// Create a DOM element to replace the trigger with
		var replacement = document.createElement("div");
		replacement.classList.add("trigger-holder");

		// Remove the trigger and replace it
		replacement.appendChild(trigger);
		replacement.appendChild(overlay);
		trigger.parentNode.replaceChild(replacement, trigger);

		return true;
	}

	return false;
}

function clarifaiTrigger(image) {
	var url = image.src;
	app.models.predict(Clarifai.GENERAL_MODEL, url).then(
		function(response) {
			if(response.status_code == 'OK') {
				return intersect(response.classes, getTriggers());
			}
		},	
		function(err) {
			console.error(err);
			return true;
		}
	);	
	return true;
}

function intersect(arr1, arr2) {
	return $(arr1).not($(arr1).not(arr2)).length > 0;
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
