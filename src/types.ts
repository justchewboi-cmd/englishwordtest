export interface WordItem {
  id: string;
  word: string;
  meaning: string;
  example?: string;
  memorized: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export type WordFormData = {
  word: string;
  meaning: string;
  example: string;
  memorized: boolean;
};

export type FilterStatus = 'all' | 'learning' | 'memorized';
