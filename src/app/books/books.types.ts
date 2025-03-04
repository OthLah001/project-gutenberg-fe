export interface IBookMetadata {
  title: string;
  issued_date: string;
  authors: string[];
  language: string;
  subjects: string[];
  locc: string;
  bookshelves: string[];
}

export interface IBookAnalysis {
  summary: string;
  key_characters: Array<{ name: string; role: string }>;
  sentiment_and_emotion: string;
  themes: string[];
  topics: string[];
  character_relationships: string[];
  notable_quotes: string[];
}

export interface ISearchHistory {
  title: string;
  gutenberg_id: number;
  search_at: string;
}
