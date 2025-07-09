// Emotion Detection System for NeuroNav
class EmotionDetector {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.isInitialized = false;
        this.isDetecting = false;
        this.currentEmotion = 'neutral';
        this.emotionHistory = [];
        this.detectionInterval = null;
        this.adaptationCallbacks = [];
    }

    async initialize() {
        try {
            console.log('Loading face-api models...');
            
            // Load required models
            await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights');
            await faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights');
            
            console.log('Face-api models loaded successfully');
            
            this.video = document.getElementById('video');
            this.canvas = document.getElementById('overlay');
            
            if (!this.video || !this.canvas) {
                throw new Error('Video or canvas element not found');
            }

            // Setup video stream
            await this.setupVideo();
            
            // Setup canvas
            this.setupCanvas();
            
            this.isInitialized = true;
            console.log('Emotion detection initialized successfully');
            
            // Start detection
            this.startDetection();
            
        } catch (error) {
            console.error('Error initializing emotion detection:', error);
            this.handleError(error);
        }
    }

    async setupVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            });
            
            this.video.srcObject = stream;
            
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    resolve();
                };
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
            throw new Error('Could not access camera. Please ensure camera permissions are granted.');
        }
    }

    setupCanvas() {
        const displaySize = { width: this.video.width, height: this.video.height };
        faceapi.matchDimensions(this.canvas, displaySize);
    }

    startDetection() {
        if (!this.isInitialized || this.isDetecting) return;
        
        this.isDetecting = true;
        this.detectionInterval = setInterval(() => {
            this.detectEmotion();
        }, 1000); // Detect every second
        
        console.log('Emotion detection started');
    }

    stopDetection() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
        this.isDetecting = false;
        console.log('Emotion detection stopped');
    }

    async detectEmotion() {
        if (!this.video || this.video.paused || this.video.ended) return;

        try {
            // Detect face and expressions
            const detections = await faceapi
                .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detections && detections.length > 0) {
                const detection = detections[0];
                const expressions = detection.expressions;
                
                // Find dominant emotion
                const dominantEmotion = this.getDominantEmotion(expressions);
                
                // Update emotion history
                this.updateEmotionHistory(dominantEmotion);
                
                // Update UI
                this.updateEmotionDisplay(dominantEmotion, expressions);
                
                // Trigger adaptations
                this.triggerAdaptations(dominantEmotion, expressions);
                
                // Draw detection overlay
                this.drawDetectionOverlay(detection);
                
            } else {
                this.updateEmotionDisplay('no_face');
            }
        } catch (error) {
            console.error('Error during emotion detection:', error);
        }
    }

    getDominantEmotion(expressions) {
        let maxConfidence = 0;
        let dominantEmotion = 'neutral';
        
        Object.keys(expressions).forEach(emotion => {
            if (expressions[emotion] > maxConfidence) {
                maxConfidence = expressions[emotion];
                dominantEmotion = emotion;
            }
        });
        
        // Only update if confidence is above threshold
        if (maxConfidence > 0.3) {
            return dominantEmotion;
        }
        
        return this.currentEmotion; // Keep previous emotion if confidence is low
    }

    updateEmotionHistory(emotion) {
        this.emotionHistory.push({
            emotion: emotion,
            timestamp: Date.now()
        });
        
        // Keep only last 10 detections
        if (this.emotionHistory.length > 10) {
            this.emotionHistory.shift();
        }
        
        this.currentEmotion = emotion;
    }

    updateEmotionDisplay(emotion, expressions = null) {
        const emotionTextElement = document.getElementById('emotion-text');
        if (!emotionTextElement) return;

        const emotionEmojis = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            fearful: '😨',
            disgusted: '🤢',
            surprised: '😲',
            neutral: '😐',
            no_face: '❓'
        };

        const emotionLabels = {
            happy: 'Happy',
            sad: 'Sad',
            angry: 'Frustrated',
            fearful: 'Anxious',
            disgusted: 'Uncomfortable',
            surprised: 'Surprised',
            neutral: 'Calm',
            no_face: 'No face detected'
        };

        const emoji = emotionEmojis[emotion] || '😐';
        const label = emotionLabels[emotion] || 'Unknown';
        
        emotionTextElement.textContent = `${emoji} ${label}`;
        
        // Add confidence display if available
        if (expressions && emotion !== 'no_face') {
            const confidence = Math.round(expressions[emotion] * 100);
            emotionTextElement.title = `Confidence: ${confidence}%`;
        }
    }

    drawDetectionOverlay(detection) {
        if (!this.canvas) return;
        
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw face detection box
        const { x, y, width, height } = detection.detection.box;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw emotion label
        ctx.fillStyle = '#00ff00';
        ctx.font = '16px Arial';
        ctx.fillText(this.currentEmotion, x, y - 10);
    }

    triggerAdaptations(emotion, expressions) {
        const adaptationData = {
            emotion: emotion,
            expressions: expressions,
            history: this.emotionHistory
        };
        
        // Call all registered adaptation callbacks
        this.adaptationCallbacks.forEach(callback => {
            try {
                callback(adaptationData);
            } catch (error) {
                console.error('Error in adaptation callback:', error);
            }
        });
    }

    registerAdaptationCallback(callback) {
        this.adaptationCallbacks.push(callback);
    }

    getEmotionSuggestions(emotion) {
        const suggestions = {
            happy: {
                theme: 'colorful',
                message: 'You seem happy! How about exploring our vibrant collection?',
                products: ['colorful-items', 'entertainment', 'social-products']
            },
            sad: {
                theme: 'comfort',
                message: 'We notice you might need some comfort. Here are some soothing options.',
                products: ['comfort-items', 'self-care', 'books']
            },
            angry: {
                theme: 'calm',
                message: 'Let\'s take things easy. Here\'s a calmer browsing experience.',
                products: ['stress-relief', 'meditation', 'calming-items']
            },
            fearful: {
                theme: 'minimal',
                message: 'We\'ve simplified the interface to help you focus.',
                products: ['safe-products', 'trusted-brands', 'simple-items']
            },
            surprised: {
                theme: 'focus',
                message: 'Surprised by something? Let us help you find what you need.',
                products: ['popular-items', 'recommended', 'trending']
            },
            neutral: {
                theme: 'default',
                message: 'Browse our featured collection at your own pace.',
                products: ['featured', 'categories', 'deals']
            }
        };
        
        return suggestions[emotion] || suggestions.neutral;
    }

    handleError(error) {
        console.error('Emotion detection error:', error);
        
        const emotionTextElement = document.getElementById('emotion-text');
        if (emotionTextElement) {
            emotionTextElement.textContent = '⚠️ Camera unavailable';
            emotionTextElement.title = error.message;
        }
        
        // Hide video elements if camera fails
        const video = document.getElementById('video');
        const canvas = document.getElementById('overlay');
        if (video) video.style.display = 'none';
        if (canvas) canvas.style.display = 'none';
    }

    toggleCamera() {
        if (this.isDetecting) {
            this.stopDetection();
            if (this.video && this.video.srcObject) {
                this.video.srcObject.getTracks().forEach(track => track.stop());
                this.video.srcObject = null;
            }
        } else {
            this.initialize();
        }
    }

    async reinitialize() {
        this.stopDetection();
        await this.initialize();
    }

    destroy() {
        this.stopDetection();
        
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        
        this.adaptationCallbacks = [];
        this.emotionHistory = [];
        this.isInitialized = false;
    }
}

// Global emotion detector instance
window.emotionDetector = new EmotionDetector();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add toggle camera functionality
    const toggleButton = document.getElementById('toggle-camera');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            window.emotionDetector.toggleCamera();
        });
    }
    
    // Initialize emotion detection
    setTimeout(() => {
        window.emotionDetector.initialize();
    }, 1000); // Small delay to ensure page is fully loaded
});