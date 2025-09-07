// src/data/types.ts
export interface ReflexUISchemaEntry {
  id: string;
  label: string;
  tone: string;
  priority: number;
  threshold: number;
  tags: string[];
  uiColor: string;
  routes: string[];
  linkedLesson: string;
  quoteAnchorId: string;
}