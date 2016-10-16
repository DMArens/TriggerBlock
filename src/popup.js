var bg = chrome.extension.getBackgroundPage()

function toggle() {
    var h = $("#status")
    if (bg.isEnabled) {
        h.text("Currently Disabled").css("color", "red")
        bg.isEnabled = false
    } else {
        h.text("Currently Enabled").css("color", "green")
        bg.isEnabled = true
    }
}

function checkStatus() {
    var h = $("#status")
    if (!bg.isEnabled) {
        h.text("Currently Disabled").css("color", "red")
    } else {
        h.text("Currently Enabled").css("color", "green")
    }
}

$("#toggle").on("click", function(e) {
    toggle()
})

checkStatus()
