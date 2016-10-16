'use strict'

function blockTrigger(image) {
	console.log('blocked: ' + image);
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
