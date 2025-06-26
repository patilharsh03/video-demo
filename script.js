const video = document.getElementById('mainVideo');
const videoContainer = document.getElementById('videoContainer');
const playButton = document.getElementById('playButton');
const loadingOverlay = document.getElementById('loadingOverlay');
const ctaButton = document.getElementById('ctaButton');

let autoplayAttempted = false;

// Function to attempt autoplay
function attemptAutoplay() {
    if (autoplayAttempted) return;
    autoplayAttempted = true;

    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Autoplay successful
                videoContainer.classList.remove('video-paused');
                hideLoading();
            })
            .catch(() => {
                // Autoplay failed, show play button
                videoContainer.classList.add('video-paused');
                hideLoading();
            });
    } else {
        // Older browsers
        videoContainer.classList.add('video-paused');
        hideLoading();
    }
}

function hideLoading() {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 300);
}

// Video event listeners
video.addEventListener('loadeddata', () => {
    // Try autoplay when video data is loaded
    setTimeout(attemptAutoplay, 500);
});

video.addEventListener('canplay', () => {
    if (!autoplayAttempted) {
        attemptAutoplay();
    }
});

video.addEventListener('play', () => {
    videoContainer.classList.remove('video-paused');
});

video.addEventListener('pause', () => {
    videoContainer.classList.add('video-paused');
});

// Play button click handler
playButton.addEventListener('click', () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
});

// Video container click handler (for mobile)
videoContainer.addEventListener('click', (e) => {
    if (e.target === video || e.target === videoContainer) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
});

// CTA button interaction
ctaButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Add your call-to-action logic here
    alert('Ready to get started? Contact us for more information!');
});

// Handle user interaction for autoplay on mobile
function enableAutoplayOnInteraction() {
    document.removeEventListener('touchstart', enableAutoplayOnInteraction);
    document.removeEventListener('click', enableAutoplayOnInteraction);

    if (video.paused && !autoplayAttempted) {
        attemptAutoplay();
    }
}

// Listen for user interaction to enable autoplay
document.addEventListener('touchstart', enableAutoplayOnInteraction, { once: true });
document.addEventListener('click', enableAutoplayOnInteraction, { once: true });

// Intersection Observer for autoplay when video comes into view
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !autoplayAttempted) {
                attemptAutoplay();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(video);
}

// Fallback: try autoplay after a short delay
setTimeout(() => {
    if (!autoplayAttempted) {
        attemptAutoplay();
    }
}, 1000);