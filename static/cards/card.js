/**
 * Virtual Card JavaScript - WolvCapital
 * Vanilla JS - no dependencies
 */

// ─────────────────────────────────────────────────────────────────────────
// Card Flip Animation
// ─────────────────────────────────────────────────────────────────────────

function wcFlipCard() {
    const cardFlip = document.getElementById('cardFlip');
    if (cardFlip) {
        cardFlip.classList.toggle('flipped');
    }
}

// ─────────────────────────────────────────────────────────────────────────
// Copy to Clipboard
// ─────────────────────────────────────────────────────────────────────────

function wcCopyToClipboard(value, label) {
    // Use modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function() {
            wcShowToast(label + ' copied to clipboard!');
        }).catch(function(err) {
            wcFallbackCopy(value, label);
        });
    } else {
        wcFallbackCopy(value, label);
    }
}

function wcFallbackCopy(value, label) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        wcShowToast(label + ' copied to clipboard!');
    } catch (err) {
        wcShowToast('Failed to copy. Please try again.', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

// ─────────────────────────────────────────────────────────────────────────
// Toast Notification
// ─────────────────────────────────────────────────────────────────────────

function wcShowToast(message, type = 'success') {
    const toast = document.getElementById('copyToast');
    const toastMessage = document.getElementById('copyToastMessage');

    if (!toast || !toastMessage) {
        console.error('Toast element not found');
        return;
    }

    toastMessage.textContent = message;
    toast.classList.add('show');

    // Set background color based on type
    if (type === 'error') {
        toast.style.backgroundColor = '#ef4444';
    } else {
        toast.style.backgroundColor = '#22c55e';
    }

    // Hide after 3 seconds
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// ─────────────────────────────────────────────────────────────────────────
// Toggle Card Freeze Status
// ─────────────────────────────────────────────────────────────────────────

function wcToggleFreezeCard() {
    const freezeBtn = document.getElementById('freezeBtn');
    if (!freezeBtn) {
        console.error('Freeze button not found');
        return;
    }

    // Disable button during request
    freezeBtn.disabled = true;
    freezeBtn.textContent = '⏳ Processing...';

    // Get CSRF token from global variable or DOM
    const csrfToken = typeof CSRF_TOKEN !== 'undefined' ? CSRF_TOKEN : wcGetCsrfToken();

    // Send POST request to freeze/unfreeze endpoint
    fetch('/dashboard/card/freeze/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(function(response) {
        if (!response.ok) {
            return response.json().then(function(data) {
                throw new Error(data.message || 'Failed to toggle card status');
            });
        }
        return response.json();
    })
    .then(function(data) {
        // Update UI based on response
        wcUpdateCardStatus(data.frozen, data.status);
        wcShowToast(data.message, 'success');
    })
    .catch(function(error) {
        console.error('Error toggling card:', error);
        wcShowToast('Error: ' + error.message, 'error');
    })
    .finally(function() {
        // Re-enable button
        freezeBtn.disabled = false;
        // Button text will be updated by page reload or manual update
    });
}

function wcUpdateCardStatus(isFrozen, status) {
    const freezeBtn = document.getElementById('freezeBtn');
    const statusIndicator = document.querySelector('.wc-status-indicator');
    const statusText = document.querySelector('.wc-status-text');
    const statusNote = document.querySelector('.wc-card-status-note');
    const frozenOverlay = document.querySelector('.wc-card-frozen-overlay');

    if (!freezeBtn || !statusIndicator) {
        return;
    }

    if (isFrozen) {
        // Card is frozen
        freezeBtn.classList.remove('wc-btn-freeze');
        freezeBtn.classList.add('wc-btn-unfreeze');
        freezeBtn.innerHTML = '🔓 Unfreeze Card';

        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('frozen');
        if (statusText) statusText.textContent = 'Card is FROZEN';

        if (statusNote) {
            statusNote.textContent = 'Your card is currently frozen and cannot be used for purchases. Click "Unfreeze Card" to resume spending.';
        }

        if (!frozenOverlay) {
            addFrozenOverlay();
        }
    } else {
        // Card is active
        freezeBtn.classList.remove('wc-btn-unfreeze');
        freezeBtn.classList.add('wc-btn-freeze');
        freezeBtn.innerHTML = '❄️ Freeze Card';

        statusIndicator.classList.remove('frozen');
        statusIndicator.classList.add('active');
        if (statusText) statusText.textContent = 'Card is ACTIVE';

        if (statusNote) {
            statusNote.textContent = 'Your card is active and ready to use. Click "Freeze Card" to temporarily disable it for security.';
        }

        if (frozenOverlay) {
            frozenOverlay.remove();
        }
    }
}

function addFrozenOverlay() {
    const cardFront = document.querySelector('.wc-card-front');
    if (!cardFront) return;

    const overlay = document.createElement('div');
    overlay.className = 'wc-card-frozen-overlay';
    overlay.innerHTML = '<div class="wc-frozen-badge">FROZEN</div>';
    cardFront.appendChild(overlay);
}

// ─────────────────────────────────────────────────────────────────────────
// CSRF Token Helper
// ─────────────────────────────────────────────────────────────────────────

function wcGetCsrfToken() {
    // Try to get from DOM meta tag
    const tokenElement = document.querySelector('meta[name="csrf-token"]');
    if (tokenElement) {
        return tokenElement.getAttribute('content');
    }

    // Try to get from cookie
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            return cookie.substring('csrftoken='.length);
        }
    }

    console.warn('CSRF token not found');
    return '';
}

// ─────────────────────────────────────────────────────────────────────────
// Initialize
// ─────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    // Any initialization code here
    console.log('Virtual Card initialized');
});
