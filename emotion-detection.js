// NeuroNav Emotion Detection System
// Uses face-api.js for real-time facial expression analysis

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
        this.confidence = 0;
        this.faceDetected = false;
    }

    async initialize() {
        try {
            console.log('🧠 Loading NeuroNav emotion detection models...');
            
            // Load face-api.js models from CDN
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';
            
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
            ]);
            
            console.log('✅ Face-api models loaded successfully');
            
            // Get video and canvas elements
            this.video = document.getElementById('video');
            this.canvas = document.getElementById('overlay');
            
            if (!this.video || !this.canvas) {
                throw new Error('Video or canvas element not found');
            }

            // Setup video stream
            await this.setupVideoStream();
            
            // Setup canvas overlay
            this.setupCanvas();
            
            this.isInitialized = true;
            console.log('🎯 Emotion detection system ready');
            
            // Start detecting emotions
            this.startDetection();
            
        } catch (error) {
            console.error('❌ Error initializing emotion detection:', error);
            this.handleInitializationError(error);
        }
    }

    async setupVideoStream() {
        try {
            const constraints = {
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user',
                    frameRate: { ideal: 15 }
                }
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = stream;
            
            return new Promise((resolve, reject) => {
                this.video.onloadedmetadata = () => {
                    console.log('📹 Camera stream established');
                    resolve();
                };
                
                this.video.onerror = () => {
                    reject(new Error('Failed to load video stream'));
                };
            });
            
        } catch (error) {
            console.error('📹 Camera access error:', error);
            throw new Error(`Camera access denied: ${error.message}`);
        }
    }

    setupCanvas() {
        const displaySize = { 
            width: this.video.videoWidth || this.video.width,
            height: this.video.videoHeight || this.video.height 
        };
        
        faceapi.matchDimensions(this.canvas, displaySize);
        console.log('🎨 Canvas overlay configured');
    }

    startDetection() {
        if (!this.isInitialized || this.isDetecting) return;
        
        this.isDetecting = true;
        this.updateEmotionDisplay('detecting', null, 0);
        
        // Detect emotions every 1 second for optimal performance
        this.detectionInterval = setInterval(async () => {
            await this.detectEmotion();
        }, 1000);
        
        console.log('🔍 Emotion detection started');
    }

    stopDetection() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
        this.isDetecting = false;
        console.log('⏹️ Emotion detection stopped');
    }

    async detectEmotion() {
        if (!this.video || this.video.paused || this.video.ended || !this.isInitialized) {
            return;
        }

        try {
            // Detect faces and expressions
            const detections = await faceapi
                .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions({
                    inputSize: 416,
                    scoreThreshold: 0.5
                }))
                .withFaceExpressions()
                .withFaceLandmarks();

            // Clear previous overlay
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (detections && detections.length > 0) {
                this.faceDetected = true;
                const detection = detections[0];
                const expressions = detection.expressions;
                
                // Get dominant emotion
                const emotionResult = this.analyzeDominantEmotion(expressions);
                
                // Update emotion history
                this.updateEmotionHistory(emotionResult.emotion, emotionResult.confidence);
                
                // Update UI display
                this.updateEmotionDisplay(emotionResult.emotion, expressions, emotionResult.confidence);
                
                // Draw face detection overlay
                this.drawFaceOverlay(detection);
                
                // Trigger UI adaptations
                this.triggerEmotionAdaptations(emotionResult.emotion, expressions);
                
            } else {
                this.faceDetected = false;
                this.updateEmotionDisplay('no_face', null, 0);
            }
            
        } catch (error) {
            console.error('🚨 Detection error:', error);
            this.updateEmotionDisplay('error', null, 0);
        }
    }

    analyzeDominantEmotion(expressions) {
        let maxConfidence = 0;
        let dominantEmotion = 'neutral';
        
        // Find emotion with highest confidence
        Object.entries(expressions).forEach(([emotion, confidence]) => {
            if (confidence > maxConfidence) {
                maxConfidence = confidence;
                dominantEmotion = emotion;
            }
        });
        
        // Only update if confidence is above threshold (30%)
        if (maxConfidence >= 0.3) {
            return {
                emotion: dominantEmotion,
                confidence: maxConfidence
            };
        }
        
        // Keep previous emotion if confidence is too low
        return {
            emotion: this.currentEmotion,
            confidence: this.confidence
        };
    }

    updateEmotionHistory(emotion, confidence) {
        this.emotionHistory.push({
            emotion: emotion,
            confidence: confidence,
            timestamp: Date.now()
        });
        
        // Keep only last 20 detections for analysis
        if (this.emotionHistory.length > 20) {
            this.emotionHistory.shift();
        }
        
        this.currentEmotion = emotion;
        this.confidence = confidence;
    }

    updateEmotionDisplay(emotion, expressions = null, confidence = 0) {
        const emotionTextElement = document.getElementById('emotion-text');
        if (!emotionTextElement) return;

        const emotionConfig = {
            happy: { emoji: '😊', label: 'Happy', color: '#10b981' },
            sad: { emoji: '�', label: 'Sad', color: '#6b7280' },
            angry: { emoji: '😠', label: 'Frustrated', color: '#ef4444' },
            fearful: { emoji: '😨', label: 'Anxious', color: '#f59e0b' },
            disgusted: { emoji: '🤢', label: 'Uncomfortable', color: '#8b5cf6' },
            surprised: { emoji: '😲', label: 'Surprised', color: '#06b6d4' },
            neutral: { emoji: '😐', label: 'Calm', color: '#6b7280' },
            no_face: { emoji: '❓', label: 'No face detected', color: '#9ca3af' },
            detecting: { emoji: '🔍', label: 'Detecting...', color: '#3b82f6' },
            error: { emoji: '⚠️', label: 'Detection error', color: '#ef4444' }
        };

        const config = emotionConfig[emotion] || emotionConfig.neutral;
        
        // Update display text
        emotionTextElement.textContent = `${config.emoji} ${config.label}`;
        emotionTextElement.style.color = config.color;
        
        // Add confidence and detailed info in tooltip
        if (expressions && confidence > 0) {
            const confidencePercent = Math.round(confidence * 100);
            const allEmotions = Object.entries(expressions)
                .map(([emotion, conf]) => `${emotion}: ${Math.round(conf * 100)}%`)
                .join('\n');
            
            emotionTextElement.title = `Confidence: ${confidencePercent}%\n\nAll detected emotions:\n${allEmotions}`;
        } else {
            emotionTextElement.title = config.label;
        }
    }

    drawFaceOverlay(detection) {
        const ctx = this.canvas.getContext('2d');
        const { x, y, width, height } = detection.detection.box;
        
        // Draw face bounding box
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw emotion label
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`${this.currentEmotion} (${Math.round(this.confidence * 100)}%)`, x, y - 10);
        
        // Draw facial landmarks (optional)
        if (detection.landmarks) {
            ctx.fillStyle = '#ff0000';
            detection.landmarks.positions.forEach(point => {
                ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
            });
        }
    }

    triggerEmotionAdaptations(emotion, expressions) {
        const adaptationData = {
            emotion: emotion,
            confidence: this.confidence,
            expressions: expressions,
            history: this.emotionHistory.slice(-5), // Last 5 detections
            timestamp: Date.now(),
            faceDetected: this.faceDetected
        };
        
        // Notify all registered adaptation callbacks
        this.adaptationCallbacks.forEach(callback => {
            try {
                callback(adaptationData);
            } catch (error) {
                console.error('🚨 Adaptation callback error:', error);
            }
        });
    }

    registerAdaptationCallback(callback) {
        if (typeof callback === 'function') {
            this.adaptationCallbacks.push(callback);
            console.log('✅ Adaptation callback registered');
        }
    }

    getEmotionSuggestions(emotion) {
        const suggestions = {
            happy: {
                theme: 'colorful',
                message: '🌈 You seem happy! How about exploring our vibrant collection?',
                products: ['colorful-items', 'entertainment', 'social-products', 'celebration-items'],
                bgColor: '#fef3c7',
                textColor: '#92400e',
                spacing: 'normal'
            },
            sad: {
                theme: 'comfort',
                message: '💙 We notice you might need some comfort. Here are some soothing options.',
                products: ['comfort-items', 'self-care', 'books', 'cozy-products'],
                bgColor: '#e0f2fe',
                textColor: '#0c4a6e',
                spacing: 'spacious'
            },
            angry: {
                theme: 'calm',
                message: '🌿 Let\'s take things easy. Here\'s a calmer browsing experience.',
                products: ['stress-relief', 'meditation', 'calming-items', 'minimal-design'],
                bgColor: '#f0fdf4',
                textColor: '#14532d',
                spacing: 'spacious'
            },
            fearful: {
                theme: 'minimal',
                message: '🛡️ We\'ve simplified the interface to help you focus.',
                products: ['safe-products', 'trusted-brands', 'simple-items', 'essential-items'],
                bgColor: '#f8fafc',
                textColor: '#334155',
                spacing: 'compact'
            },
            surprised: {
                theme: 'focus',
                message: '✨ Surprised by something? Let us help you find what you need.',
                products: ['popular-items', 'recommended', 'trending', 'new-arrivals'],
                bgColor: '#eff6ff',
                textColor: '#1e40af',
                spacing: 'normal'
            },
            disgusted: {
                theme: 'clean',
                message: '🧼 Let\'s find something more appealing for you.',
                products: ['clean-products', 'organic-items', 'premium-quality', 'fresh-items'],
                bgColor: '#fafafa',
                textColor: '#374151',
                spacing: 'spacious'
            },
            neutral: {
                theme: 'default',
                message: '😐 Browse our featured collection at your own pace.',
                products: ['featured', 'categories', 'deals', 'recommendations'],
                bgColor: '#ffffff',
                textColor: '#1f2937',
                spacing: 'normal'
            }
        };
        
        return suggestions[emotion] || suggestions.neutral;
    }

    // Camera control methods
    toggleCamera() {
        if (this.isDetecting) {
            this.stopDetection();
            this.stopVideoStream();
        } else {
            this.initialize();
        }
    }

    stopVideoStream() {
        if (this.video && this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.video.srcObject = null;
            console.log('📹 Camera stream stopped');
        }
    }

    handleInitializationError(error) {
        console.error('🚨 Initialization failed:', error);
        
        const emotionTextElement = document.getElementById('emotion-text');
        if (emotionTextElement) {
            emotionTextElement.textContent = '⚠️ Camera unavailable';
            emotionTextElement.title = `Error: ${error.message}`;
            emotionTextElement.style.color = '#ef4444';
        }
        
        // Hide video elements on error
        if (this.video) this.video.style.display = 'none';
        if (this.canvas) this.canvas.style.display = 'none';
        
        // Show fallback message
        this.showFallbackMessage();
    }

    showFallbackMessage() {
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.1);
            color: #6b7280;
            font-size: 0.875rem;
            text-align: center;
            padding: 1rem;
            border-radius: 8px;
        `;
        fallback.innerHTML = '📱 Camera unavailable<br>Manual theme selection available';
        
        const emotionPanel = document.querySelector('.emotion-panel, .emotion-header-panel');
        if (emotionPanel) {
            emotionPanel.appendChild(fallback);
        }
    }

    // Utility methods
    getEmotionHistory(limit = 10) {
        return this.emotionHistory.slice(-limit);
    }

    getCurrentEmotion() {
        return {
            emotion: this.currentEmotion,
            confidence: this.confidence,
            timestamp: Date.now()
        };
    }

    destroy() {
        this.stopDetection();
        this.stopVideoStream();
        this.adaptationCallbacks = [];
        this.emotionHistory = [];
        this.isInitialized = false;
        console.log('🗑️ Emotion detector destroyed');
    }
}

// Global emotion detector instance
window.emotionDetector = new EmotionDetector();

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 NeuroNav Emotion Detection Loading...');
    
    // Setup camera toggle button
    const toggleButton = document.getElementById('toggle-camera');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            window.emotionDetector.toggleCamera();
        });
    }
    
    // Initialize emotion detection with a small delay
    setTimeout(() => {
        window.emotionDetector.initialize();
    }, 1500);
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.emotionDetector.stopDetection();
        } else if (window.emotionDetector.isInitialized) {
            window.emotionDetector.startDetection();
        }
    });
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.emotionDetector) {
        window.emotionDetector.destroy();
    }
});