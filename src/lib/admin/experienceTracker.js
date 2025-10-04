// src/lib/admin/experienceTracker.ts
// Admin utility to access user experiences
export class ExperienceTracker {
    /**
     * Get all user experiences from localStorage
     */
    static getAllExperiences() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        }
        catch (error) {
            console.error('Error loading experiences:', error);
            return [];
        }
    }
    /**
     * Get experiences summary statistics
     */
    static getExperienceStats() {
        const experiences = this.getAllExperiences();
        if (experiences.length === 0) {
            return {
                totalCount: 0,
                averageScore: 0,
                scoreDistribution: {},
                recentCount: 0
            };
        }
        const scores = experiences.map(e => e.score);
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const scoreDistribution = scores.reduce((acc, score) => {
            acc[score] = (acc[score] || 0) + 1;
            return acc;
        }, {});
        // Count experiences from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentCount = experiences.filter(e => new Date(e.timestamp) > weekAgo).length;
        return {
            totalCount: experiences.length,
            averageScore: Math.round(averageScore * 100) / 100,
            scoreDistribution,
            recentCount
        };
    }
    /**
     * Export experiences as CSV for analysis
     */
    static exportToCSV() {
        const experiences = this.getAllExperiences();
        if (experiences.length === 0) {
            return 'No experiences to export';
        }
        const headers = ['Timestamp', 'Score', 'Feedback', 'User Agent'];
        const csvRows = [
            headers.join(','),
            ...experiences.map(exp => [
                exp.timestamp,
                exp.score,
                `"${exp.feedback.replace(/"/g, '""')}"`, // Escape quotes
                `"${exp.userAgent}"`
            ].join(','))
        ];
        return csvRows.join('\n');
    }
    /**
     * Clear all experiences (admin function)
     */
    static clearAllExperiences() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('All user experiences cleared');
    }
    /**
     * Get recent feedback (last 10 entries)
     */
    static getRecentFeedback(limit = 10) {
        const experiences = this.getAllExperiences();
        return experiences
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
}
ExperienceTracker.STORAGE_KEY = 'train_ai_experiences';
// Console helper functions for admin access
if (typeof window !== 'undefined') {
    window.getTrainingExperiences = () => {
        console.log('=== TRAINING EXPERIENCES ===');
        const stats = ExperienceTracker.getExperienceStats();
        console.log('Stats:', stats);
        const recent = ExperienceTracker.getRecentFeedback(5);
        console.log('Recent Feedback:', recent);
        return {
            stats,
            recent,
            all: ExperienceTracker.getAllExperiences()
        };
    };
    window.exportTrainingExperiences = () => {
        const csv = ExperienceTracker.exportToCSV();
        console.log('CSV Export:');
        console.log(csv);
        // Create downloadable file
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `training-experiences-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        return csv;
    };
}
