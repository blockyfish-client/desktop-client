// Saves options to chrome.storage
function save_options() {
  var Halloween = document.getElementById('like').checked;
  chrome.storage.sync.set({
    'Halloween' : Halloween
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    chrome.runtime.sendMessage('sync-settings');
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    Halloween: true
  }, function(items) {
    document.getElementById('like').checked = items.Halloween;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);