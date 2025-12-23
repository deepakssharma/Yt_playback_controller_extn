console.log("YouTube Speed Controller extension is active!");
// function to inject the script
function injectScript(file_path) {
    var node = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}

injectScript(chrome.runtime.getURL('inject.js'));

// Load control panel HTML
fetch(chrome.runtime.getURL('control_panel.html'))
    .then(response => response.text())
    .then(html => {
        // Create a container for the HTML
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        // Add event listener to the toggle switch
        const speedToggleBtn = document.getElementById('btn-speed-toggle');
        if (speedToggleBtn) {
            speedToggleBtn.addEventListener('change', () => {
                if (speedToggleBtn.checked) {
                    // Checked = 1.5X
                    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', command: 'playSpeed2' }, '*');
                } else {
                    // Unchecked = 1X
                    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', command: 'playSpeed1' }, '*');
                }
            });
        }
    })
    .catch(err => console.error('Failed to load control panel:', err));

document.body.style.border = "none";
