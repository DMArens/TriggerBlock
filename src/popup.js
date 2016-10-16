var bg = chrome.extension.getBackgroundPage()


$("#toggle").on("click", function(e) {
    var h = $("#status")
    if (bg.isEnabled) {
        h.text("Currently Disabled")
        bg.isEnabled = false
    } else {
        h.text("Currently Enabled")
        bg.isEnabled = true
    }
})
