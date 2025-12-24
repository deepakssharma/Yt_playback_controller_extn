// Saves options to chrome.storage
function save_options() {
  var lowSpeed = parseFloat(document.getElementById('lowSpeed').value);
  var highSpeed = parseFloat(document.getElementById('highSpeed').value);

  if (isNaN(lowSpeed)) lowSpeed = 1.0;
  if (isNaN(highSpeed)) highSpeed = 1.5;

  chrome.storage.sync.set({
    lowSpeed: lowSpeed,
    highSpeed: highSpeed
  }, function() {
    var status = document.getElementById('status');
    status.style.display = 'block';
    setTimeout(function() {
      status.style.display = 'none';
    }, 2000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    lowSpeed: 1.0,
    highSpeed: 1.5
  }, function(items) {
    document.getElementById('lowSpeed').value = items.lowSpeed;
    document.getElementById('highSpeed').value = items.highSpeed;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
