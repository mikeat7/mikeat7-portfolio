export interface ProcessedData {
  id: string;
  content: string;
  type: 'text' | 'url' | 'object';
  metadata: {
    length: number;
    timestamp: number;
    source?: string;
  };
}

export const processData = (rawData: any[]): any[] => {
  // Your original preprocessing logic
  return rawData.filter(item => item && typeof item === 'object');
};

export const processDataEnhanced = (data: any[]): ProcessedData[] => {
  return data.map((item, index) => {
    let content: string;
    let type: 'text' | 'url' | 'object';
    
    if (typeof item === 'string') {
      content = item;
      type = item.includes('http') ? 'url' : 'text';
    } else if (item && typeof item === 'object') {
      content = JSON.stringify(item);
      type = 'object';
    } else {
      content = String(item);
      type = 'text';
    }
    
    return {
      id: `item_${index}_${Date.now()}`,
      content,
      type,
      metadata: {
        length: content.length,
        timestamp: Date.now(),
        source: type === 'url' ? (() => {
          try {
            return new URL(content).hostname;
          } catch {
            return 'invalid-url';
          }
        })() : undefined
      }
    };
  });
};

export const filterData = (data: ProcessedData[], minLength: number = 10): ProcessedData[] => {
  return data.filter(item => item.metadata.length >= minLength);
};

export const groupByType = (data: ProcessedData[]): Record<string, ProcessedData[]> => {
  return data.reduce((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as Record<string, ProcessedData[]>);
};

// Utility function that works with both object and string data
export const normalizeData = (rawData: any[]): string[] => {
  return rawData
    .filter(item => item != null) // Remove null/undefined
    .map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object') return JSON.stringify(item);
      return String(item);
    })
    .filter(item => item.length > 0); // Remove empty strings
};