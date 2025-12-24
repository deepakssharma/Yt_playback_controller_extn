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

        // Fetch settings and initialize
        chrome.storage.sync.get({
            lowSpeed: 1.0,
            highSpeed: 1.5
        }, function (items) {
            const lowSpeed = items.lowSpeed;
            const highSpeed = items.highSpeed;

            // Update UI Labels
            const lowLabel = document.getElementById('speed-low-label');
            const highLabel = document.getElementById('speed-high-label');
            if (lowLabel) lowLabel.innerText = lowSpeed + 'X';
            if (highLabel) highLabel.innerText = highSpeed + 'X';

            // Send config to inject.js
            window.postMessage({
                type: 'FROM_CONTENT_SCRIPT',
                command: 'updateSettings',
                lowSpeed: lowSpeed,
                highSpeed: highSpeed
            }, '*');

            // Add event listener to the toggle switch
            const speedToggleBtn = document.getElementById('btn-speed-toggle');
            if (speedToggleBtn) {
                speedToggleBtn.addEventListener('change', () => {
                    if (speedToggleBtn.checked) {
                        // High speed
                        window.postMessage({ type: 'FROM_CONTENT_SCRIPT', command: 'setSpeed', speed: highSpeed }, '*');
                    } else {
                        // Low speed
                        window.postMessage({ type: 'FROM_CONTENT_SCRIPT', command: 'setSpeed', speed: lowSpeed }, '*');
                    }
                });
            }

            // Add event listener to settings button
            const settingsBtn = document.getElementById('btn-settings');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    window.open(chrome.runtime.getURL('settings.html'), '_blank');
                });
            }
        });
    })
    .catch(err => console.error('Failed to load control panel:', err));

document.body.style.border = "none";
