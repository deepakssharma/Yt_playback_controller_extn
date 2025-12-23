// This script runs in the page context, so it can access the 'window' object of the page,
// including the YouTube player API.

(function () {
    console.log("YouTube Player Speed Controller: Injected script loaded");

    function getPlayer() {
        // 'movie_player' is the standard ID for the YouTube player object
        return document.getElementById('movie_player');
    }

    // Listen for messages from the content script
    window.addEventListener('message', function (event) {
        // We only accept messages from ourselves
        if (event.source !== window) {
            return;
        }

        if (event.data.type && (event.data.type === 'FROM_CONTENT_SCRIPT')) {
            const player = getPlayer();
            if (!player) {
                console.warn("YouTube Player Speed Controller: Player object not found");
                return;
            }

            console.log("YouTube Player Speed Controller: Received command", event.data.command);

            switch (event.data.command) {
                case 'playSpeed1':
                    if (typeof player.playVideo === 'function') player.setPlaybackRate(1);
                    break;
                case 'playSpeed2':
                    if (typeof player.playVideo === 'function') player.setPlaybackRate(1.5);
                    break;
                default:
                    console.log("YouTube Player Speed Controller: Unknown command", event.data.command);
            }
        }
    });
    document.addEventListener('yt-navigate-finish', () => {
        // Wait a moment for the new video element to load
        console.log("Inside yt-finish inject.js");
        setTimeout(() => {
            const video = document.querySelector('video');
            if (video) {
                // Re-apply your custom speed or logic here
                video.playbackRate = 1.5;
                console.log("YouTube Player Speed Controller: Initial Playback Speed:", video.playbackRate);

                // Add listener for future play events
                video.addEventListener('play', () => {
                    console.log("YouTube Player Speed Controller: Video Started/Resumed - Playback Speed:", video.playbackRate);
                });
            }
        }, 1000);
    });

})();
