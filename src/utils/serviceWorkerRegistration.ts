// Service worker registration utility

// Check if service workers are supported
const isServiceWorkerSupported = 'serviceWorker' in navigator;

// Register the service worker
export const registerServiceWorker = (): void => {
  if (!isServiceWorkerSupported) {
    console.log('Service workers are not supported in this browser');
    return;
  }

  // Wait for the page to load
  window.addEventListener('load', () => {
    const swUrl = `${window.location.origin}/service-worker.js`;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Check for updates on page load
        registration.update();

        // Handle updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available, notify the user
                console.log('New content is available; please refresh.');
                
                // Dispatch an event that can be caught by the application
                window.dispatchEvent(new CustomEvent('swUpdate'));
              } else {
                // Content is cached for offline use
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Error during service worker registration:', error);
      });
  });
};

// Unregister all service workers
export const unregisterServiceWorker = (): void => {
  if (!isServiceWorkerSupported) return;

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.unregister();
    })
    .catch((error) => {
      console.error(error.message);
    });
};

// Check for service worker updates
export const checkForUpdates = (): void => {
  if (!isServiceWorkerSupported) return;

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.update();
    })
    .catch((error) => {
      console.error('Error checking for service worker updates:', error);
    });
};

// Force the waiting service worker to become active
export const updateServiceWorker = (): void => {
  if (!isServiceWorkerSupported) return;

  navigator.serviceWorker.ready
    .then((registration) => {
      if (registration.waiting) {
        // Send a message to the waiting service worker
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    })
    .catch((error) => {
      console.error('Error updating service worker:', error);
    });
};
