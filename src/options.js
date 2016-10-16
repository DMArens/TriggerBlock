function save_options() {
    obj = {test: "test"}
  chrome.storage.sync.set({
    obj
  }, function() {
    console.log("saved to sync")
  });
}

document.getElementById('save-trigger').addEventListener('click', save_options);
