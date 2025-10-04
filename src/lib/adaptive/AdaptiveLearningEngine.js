// src/lib/adaptive/AdaptiveLearningEngine.ts
// Real-time adaptive learning system for VX detection calibration
class AdaptiveLearningEngine {
    constructor() {
        this.adjustments = new Map();
        this.learningHistory = [];
        this.STORAGE_KEY = 'vx-adaptive-learning';
        this.MAX_ADJUSTMENT = 0.3; // Maximum confidence adjustment
        this.LEARNING_RATE = 0.05; // How much each feedback affects confidence
        this.loadFromStorage();
    }
    /**
     * Apply real-time confidence adjustment based on user feedback
     */
    adjustConfidence(reflexId, originalConfidence, userFeedback, context) {
        const feedbackType = this.classifyFeedback(userFeedback);
        const adjustment = this.calculateAdjustment(reflexId, feedbackType, userFeedback);
        // Record the learning event
        const learningRecord = {
            reflexId,
            originalConfidence,
            userFeedback,
            feedbackType,
            timestamp: Date.now(),
            context: context.substring(0, 100), // Store context snippet
            adjustmentApplied: adjustment
        };
        this.recordLearning(learningRecord);
        // Apply adjustment with bounds checking
        const adjustedConfidence = Math.max(0.05, Math.min(0.95, originalConfidence + adjustment));
        console.log(`🧠 Adaptive Learning: ${reflexId} confidence ${originalConfidence} → ${adjustedConfidence} (${adjustment >= 0 ? '+' : ''}${adjustment.toFixed(3)})`);
        return adjustedConfidence;
    }
    /**
     * Classify user feedback into actionable categories
     */
    classifyFeedback(feedback) {
        const lower = feedback.toLowerCase();
        if (lower.includes('false positive') || lower.includes('wrong') || lower.includes('incorrect')) {
            return 'false_positive';
        }
        if (lower.includes('missed') || lower.includes('should detect') || lower.includes('false negative')) {
            return 'false_negative';
        }
        if (lower.includes('correct') || lower.includes('right') || lower.includes('accurate')) {
            return 'correct';
        }
        return 'disputed';
    }
    /**
     * Calculate confidence adjustment based on feedback type and history
     */
    calculateAdjustment(reflexId, feedbackType, feedback) {
        const existing = this.adjustments.get(reflexId);
        let baseAdjustment = 0;
        switch (feedbackType) {
            case 'false_positive':
                baseAdjustment = -this.LEARNING_RATE;
                break;
            case 'false_negative':
                baseAdjustment = +this.LEARNING_RATE;
                break;
            case 'correct':
                baseAdjustment = 0; // No adjustment needed
                break;
            case 'disputed':
                baseAdjustment = -this.LEARNING_RATE * 0.5; // Small reduction for disputes
                break;
        }
        // Apply intensity modifiers based on feedback strength
        const intensity = this.getFeedbackIntensity(feedback);
        const finalAdjustment = baseAdjustment * intensity;
        // Respect maximum adjustment bounds
        if (existing) {
            const newTotal = existing.adjustmentFactor + finalAdjustment;
            if (Math.abs(newTotal) > this.MAX_ADJUSTMENT) {
                return Math.sign(newTotal) * this.MAX_ADJUSTMENT - existing.adjustmentFactor;
            }
        }
        return finalAdjustment;
    }
    /**
     * Determine feedback intensity (1.0 = normal, 2.0 = strong, 0.5 = weak)
     */
    getFeedbackIntensity(feedback) {
        const lower = feedback.toLowerCase();
        if (lower.includes('completely wrong') || lower.includes('totally incorrect'))
            return 2.0;
        if (lower.includes('very wrong') || lower.includes('clearly incorrect'))
            return 1.5;
        if (lower.includes('somewhat') || lower.includes('maybe'))
            return 0.5;
        return 1.0; // Default intensity
    }
    /**
     * Record learning event and update pattern adjustments
     */
    recordLearning(record) {
        this.learningHistory.push(record);
        // Update or create pattern adjustment
        const existing = this.adjustments.get(record.reflexId);
        if (existing) {
            existing.adjustmentFactor += record.adjustmentApplied;
            existing.learningHistory.push(record);
            existing.lastUpdated = Date.now();
        }
        else {
            this.adjustments.set(record.reflexId, {
                reflexId: record.reflexId,
                baseConfidence: record.originalConfidence,
                adjustmentFactor: record.adjustmentApplied,
                learningHistory: [record],
                lastUpdated: Date.now()
            });
        }
        // Persist to storage
        this.saveToStorage();
        // Cleanup old records (keep last 1000)
        if (this.learningHistory.length > 1000) {
            this.learningHistory = this.learningHistory.slice(-1000);
        }
    }
    /**
     * Get current adjustment for a pattern
     */
    getPatternAdjustment(reflexId) {
        const adjustment = this.adjustments.get(reflexId);
        return adjustment ? adjustment.adjustmentFactor : 0;
    }
    /**
     * Get learning statistics for debugging/monitoring
     */
    getLearningStats() {
        const totalAdjustments = this.adjustments.size;
        const totalFeedback = this.learningHistory.length;
        const recentFeedback = this.learningHistory.filter(r => Date.now() - r.timestamp < 24 * 60 * 60 * 1000).length;
        return {
            totalAdjustments,
            totalFeedback,
            recentFeedback,
            adjustmentsSummary: Array.from(this.adjustments.entries()).map(([id, adj]) => ({
                reflexId: id,
                adjustment: adj.adjustmentFactor,
                feedbackCount: adj.learningHistory.length
            }))
        };
    }
    /**
     * Reset learning for a specific pattern (if needed)
     */
    resetPattern(reflexId) {
        this.adjustments.delete(reflexId);
        this.learningHistory = this.learningHistory.filter(r => r.reflexId !== reflexId);
        this.saveToStorage();
        console.log(`🔄 Reset learning for pattern: ${reflexId}`);
    }
    /**
     * Persist learning data to localStorage
     */
    saveToStorage() {
        try {
            const data = {
                adjustments: Array.from(this.adjustments.entries()),
                learningHistory: this.learningHistory.slice(-500) // Keep recent history
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        }
        catch (error) {
            console.warn('Failed to save learning data:', error);
        }
    }
    /**
     * Load learning data from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                this.adjustments = new Map(data.adjustments || []);
                this.learningHistory = data.learningHistory || [];
                console.log(`🧠 Loaded ${this.adjustments.size} pattern adjustments from storage`);
            }
        }
        catch (error) {
            console.warn('Failed to load learning data:', error);
        }
    }
}
// Singleton instance
export const adaptiveLearning = new AdaptiveLearningEngine();
export default AdaptiveLearningEngine;
