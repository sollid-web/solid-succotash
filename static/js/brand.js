/**
 * WolvCapital Brand JavaScript Utilities
 * Provides helper functions for brand-related UI interactions
 */

const WolvCapitalBrand = {
    // Brand colors
    colors: {
        primary: '#2196F3',
        primaryLight: '#6EC1E4',
        primaryDark: '#0D47A1',
        accentGold: '#FFD700',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    },

    /**
     * Initialize brand theme
     */
    init() {
        this.applyTheme();
        this.setupAnimations();
        console.log('🐺 WolvCapital Brand Initialized');
    },

    /**
     * Apply brand theme to document
     */
    applyTheme() {
        const root = document.documentElement;
        Object.entries(this.colors).forEach(([key, value]) => {
            root.style.setProperty(`--brand-${key}`, value);
        });
    },

    /**
     * Setup scroll animations
     */
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.brand-card, .brand-feature').forEach(el => {
            observer.observe(el);
        });
    },

    /**
     * Show success toast notification
     */
    showSuccess(message, duration = 3000) {
        this.showToast(message, 'success', duration);
    },

    /**
     * Show error toast notification
     */
    showError(message, duration = 3000) {
        this.showToast(message, 'error', duration);
    },

    /**
     * Show info toast notification
     */
    showInfo(message, duration = 3000) {
        this.showToast(message, 'info', duration);
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `brand-toast brand-toast-${type}`;
        
        const colors = {
            success: this.colors.success,
            error: this.colors.danger,
            warning: this.colors.warning,
            info: this.colors.primary
        };

        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;

        toast.innerHTML = `
            <span style="font-size: 1.25rem;">${icons[type]}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Format currency
     */
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Calculate ROI
     */
    calculateROI(initialInvestment, finalValue) {
        const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
        return roi.toFixed(2);
    },

    /**
     * Format percentage
     */
    formatPercent(value, decimals = 2) {
        return `${value.toFixed(decimals)}%`;
    },

    /**
     * Animate number counter
     */
    animateNumber(element, start, end, duration = 2000) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    },

    /**
     * Smooth scroll to element
     */
    scrollTo(selector, offset = 80) {
        const element = document.querySelector(selector);
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    },

    /**
     * Copy to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess('Copied to clipboard!');
            return true;
        } catch (err) {
            this.showError('Failed to copy');
            return false;
        }
    },

    /**
     * Debounce function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WolvCapitalBrand.init());
} else {
    WolvCapitalBrand.init();
}

// Export for use in other scripts
window.WolvCapitalBrand = WolvCapitalBrand;
