// Login page functionality with emotion-adaptive UI
document.addEventListener('DOMContentLoaded', () => {
    initializeLoginPage();
});

function initializeLoginPage() {
    setupFormHandling();
    setupThemeAdaptation();
    setupAccessibilityOptions();
}

function setupFormHandling() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Store user preferences
    storeUserPreferences();
    
    // Simulate login success and redirect
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 500);
}

function storeUserPreferences() {
    const preferences = {
        highContrast: document.getElementById('high-contrast').checked,
        largeText: document.getElementById('large-text').checked,
        reduceMotion: document.getElementById('reduce-motion').checked,
        timestamp: Date.now()
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

function setupThemeAdaptation() {
    // Register emotion adaptation callback
    if (window.emotionDetector) {
        window.emotionDetector.registerAdaptationCallback(adaptUIBasedOnEmotion);
    }
    
    // Setup manual theme selection
    const uiSuggestions = document.getElementById('ui-suggestions');
    if (uiSuggestions) {
        uiSuggestions.addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
    }
}

function adaptUIBasedOnEmotion(emotionData) {
    const { emotion } = emotionData;
    
    // Get suggestions based on emotion
    const suggestions = window.emotionDetector.getEmotionSuggestions(emotion);
    
    // Auto-apply theme if no manual selection
    const uiSuggestions = document.getElementById('ui-suggestions');
    if (uiSuggestions && !uiSuggestions.value) {
        setTimeout(() => {
            applyTheme(suggestions.theme);
            updateUIMessage(suggestions.message);
        }, 2000); // Delay to avoid too frequent changes
    }
}

function applyTheme(themeName) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-calm', 'theme-focus', 'theme-comfort', 'theme-minimal', 'theme-colorful', 'theme-dark');
    
    // Apply new theme
    if (themeName && themeName !== 'default') {
        body.classList.add(`theme-${themeName}`);
    }
    
    console.log(`Applied theme: ${themeName}`);
}

function updateUIMessage(message) {
    // Create or update emotion message
    let messageEl = document.getElementById('emotion-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'emotion-message';
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 10000;
            max-width: 300px;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.style.opacity = '1';
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
    }, 3000);
}

function setupAccessibilityOptions() {
    // High contrast mode
    const highContrastCheckbox = document.getElementById('high-contrast');
    if (highContrastCheckbox) {
        highContrastCheckbox.addEventListener('change', (e) => {
            document.body.classList.toggle('high-contrast', e.target.checked);
        });
    }
    
    // Large text mode
    const largeTextCheckbox = document.getElementById('large-text');
    if (largeTextCheckbox) {
        largeTextCheckbox.addEventListener('change', (e) => {
            document.body.classList.toggle('large-text', e.target.checked);
        });
    }
    
    // Reduce motion mode
    const reduceMotionCheckbox = document.getElementById('reduce-motion');
    if (reduceMotionCheckbox) {
        reduceMotionCheckbox.addEventListener('change', (e) => {
            document.body.classList.toggle('reduce-motion', e.target.checked);
        });
    }
}