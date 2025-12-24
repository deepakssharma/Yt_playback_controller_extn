// This script runs in the page context, so it can access the 'window' object of the page,
// including the YouTube player API.

(function () {
    console.log("YouTube Player Speed Controller: Injected script loaded");

    // Default settings
    let config = {
        lowSpeed: 1.0,
        highSpeed: 1.5
    };

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

            // Handle Settings Update
            if (event.data.command === 'updateSettings') {
                config.lowSpeed = event.data.lowSpeed;
                config.highSpeed = event.data.highSpeed;
                console.log("YouTube Player Speed Controller: Settings updated", config);
                return;
            }

            if (!player) {
                console.warn("YouTube Player Speed Controller: Player object not found");
                return;
            }

            console.log("YouTube Player Speed Controller: Received command", event.data.command);

            if (event.data.command === 'setSpeed') {
                if (typeof player.playVideo === 'function') player.setPlaybackRate(event.data.speed);
            } else {
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
                // Apply the High Speed by default (as per original logic logic)
                // Note: The manifest description says "Sets default playback speed to 1.5x"
                // So we use config.highSpeed here.
                video.playbackRate = config.highSpeed;
                console.log("YouTube Player Speed Controller: Initial Playback Speed:", video.playbackRate);

                // Add listener for future play events
                video.addEventListener('play', () => {
                    // Optional: Enforce speed on play if needed, but usually initial set is enough.
                    // Just logging for now as per previous request.
                    console.log("YouTube Player Speed Controller: Video Started/Resumed - Playback Speed:", video.playbackRate);
                });
            }
        }, 1000);
    });

})();
