export const getReflexesForInput = (input, type = 'text') => {
    const reflexes = [];
    if (type === 'text' && typeof input === 'string') {
        if (input.includes('always') || input.includes('never')) {
            reflexes.push({
                id: 'vx-ov01',
                name: 'Overgeneralization',
                description: 'Flags extreme generalizations.',
                trigger: () => true,
                confidence: 0.85,
                type
            });
        }
    }
    if (type === 'audio' && input instanceof File) {
        reflexes.push({
            id: 'vx-em08-audio',
            name: 'Tone Manipulation (Audio)',
            description: 'Detects emotional drift in voice tone.',
            trigger: () => true,
            confidence: 0.78,
            type
        });
    }
    if (type === 'image' && input instanceof File) {
        reflexes.push({
            id: 'vx-vi01',
            name: 'Visual Bias',
            description: 'Detects emotionally manipulative imagery.',
            trigger: () => true,
            confidence: 0.72,
            type
        });
    }
    return reflexes;
};
