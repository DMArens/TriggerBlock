'use strict'

var IMAGES_BUFSIZE = 128;;
var rightClicked = null;

var app = new Clarifai.App(
	'bi23kkb3SfD800k620sudJwg4mVzypk1kXyYHI_J',
	'euhZE4Q-UFRfVozp-V3JxkGJXD0CtsIp6MCMuFRj'
);

var triggerStore = null

$(document).on("click", "a", function() {
	for(var i = 0; i < this.children.length; i++) {
		if(this.children[i].className == 'trigger-holder') {
			return false;
		}
	}
	return true;
});

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
		// Hide the trigger right off the bat
		trigger.setAttribute("style", "-webkit-filter: blur(30px)");

		// Generate a trigger warning
		var width = "" + trigger.width + "px";
		var height = "" + trigger.height + "px";
		var hoverText = document.createElement("p");
		hoverText.textContent = "View Trigger";
		hoverText.classList.add("trigger-warning");
		var hoverImg = document.createElement("img");
		hoverImg.src = chrome.extension.getURL("/img/TriggerBlock.png");
		// Dynamically size the logo
		if (trigger.width > trigger.height + 6) {
			hoverImg.style.height = height;
		} else {
			hoverImg.style.height = height;
		}
		hoverImg.classList.add("logo");

		// Process the trigger to create an overlay
		var overlay = document.createElement("div");
		overlay.style.width = width;
		overlay.style.height = height;
		overlay.style.backgroundColor = "#D3D3D3"; // TODO: use config variable
		overlay.classList.add("trigger-overlay");
		// Add trigger warning to overlay
		overlay.appendChild(hoverText);
		overlay.appendChild(hoverImg);

		$(document).on("click", ".trigger-overlay", function() {
			// get the trigger container
			var ancestor = this.parentNode;
			for(var i = 0; i < ancestor.childNodes.length; i++) {
				if(ancestor.childNodes[i].tagName == "IMG") {
					ancestor.childNodes[i].setAttribute("style", "-webkit-filter:blur(0px)");
				}
			}
			ancestor.parentNode.replaceChild(ancestor.firstChild, ancestor);
			return false;
		});

		// Create a DOM element to replace the trigger with
		var replacement = document.createElement("div");
		replacement.style.width = width;
		replacement.style.height = height;
		replacement.classList.add("trigger-holder");

		// Wrap the trigger with a trigger warning
		trigger.parentNode.replaceChild(replacement, trigger);
		replacement.appendChild(trigger);
		replacement.appendChild(overlay);

		return true;
	}

	return false;
}

function blockTriggers(images) {
	for (var i = 0; i < images.length; i++) {
		blockTrigger(image);
	}
}

function alertBlocker(tags) {
	console.log('which tag would you like to block: ' + tags);
	// TODO : prompt user;
	blocks = [];
	for (var i = 0; i < block.length; i++) {
		chrome.extension.sendMessage({text:"AddToTriggerList", tag:blocks[i]},function(response){});
	}
}

function updateTriggers(imageUrl) {
	console.log('updating users');
	app.models.predict(Clarifai.GENERAL_MODEL, imageUrl).then(
		function(response) {
			console.log(response);
			if (response.statusText == 'OK') {
				var output = response.data.outputs[0];
				if (output.data != null) {
					var tags = output.data.concepts.map(function(o) { return o.name });
					alertBlocker(tags);
				}
			}
		},
		function(err) {
			console.error('error lol: ' + err);
		}
	);	
}

function clarifaiTrigger(images) {
	var urls = images.map(function(o) { return o.src });

	app.models.predict(Clarifai.GENERAL_MODEL, urls).then(
		function(response) {
			console.log(response);
			if (response.statusText == 'OK') {
				var outputs = response.data.outputs;
				for (var i = 0; i < outputs.length; i++) {
					if (outputs[i].data != null) {
						var tags = outputs[i].data.concepts.map(function(o) { return o.name });
						if (intersect(tags, triggerStore).length > 0) {
							blockTrigger(images[i]);
						}
					} else {
						console.log('bad image');
						blockTrigger(images[i]);
					}
					images[i].classList.add("inspected");
				}
			} else {
				//for (var i = 0; i < images.length; i++) {
				//	images[i].classList.add("inspected");
				//	blockTrigger(images[i]);
				//}
			}
			
		},
		function(err) {
			console.error('error lol: ' + err);
			// TODO: PLEASE refactor this...
			for (var i = 0; i < images.length; i++) {
				images[i].classList.add("inspected");
				blockTrigger(images[i]);
			}
		}
	);	
}

function intersect(arr1, arr2) {
	return $(arr1).not($(arr1).not(arr2));
}

document.addEventListener("mousedown", function(event){
	if(event.button == 2) { 
		rightClicked = event.target;
	}}, true);

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	if (request == "blockTrigger") {
		blockTrigger(rightClicked);
		updateTriggers(rightClicked.src);
	}
});

function triggerBlock() {
	var images = document.getElementsByTagName("img");
	chrome.storage.sync.get("triggers", function(triggers) {
		var imagesbuf = [];
		triggerStore = triggers.triggers;
		console.log(triggerStore)
		for (var i = 0; i < images.length; i++) {
			if (!images[i].src.includes('data:')) {
				imagesbuf.push(images[i]);
				if (imagesbuf.length == IMAGES_BUFSIZE) {
					clarifaiTrigger(imagesbuf);
					imagesbuf = [];
				}
			}
		}
		if (imagesbuf.length != 0) {
			clarifaiTrigger(imagesbuf);
		}
	});
}

chrome.extension.sendMessage({text:"EnabledCheck"},function(response){
	if (response.isEnabled == true) {
		window.addEventListener("load", triggerBlock);
	} else {
		var images = document.getElementsByTagName('img');
		for (var i = 0; i < images.length; i++) {
			images[i].setAttribute("style", "-webkit-filter:blur(0px)");
		}
	}
});
