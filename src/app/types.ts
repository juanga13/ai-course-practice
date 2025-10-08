export type HistoryItem = {
  id: string;
  name: string;
  url: string;
  result: unknown | null;
  error?: { error: string; reason: string } | null;
};

export type StoredCard = {
  id: string;
  cardData: {
    type: 'nba_psa_card';
    playerName: string;
    team: string;
    year: string;
    manufacturer: string;
    setName: string;
    cardNumber: string;
    parallelOrVariant: string;
    psa: {
      grade: string;
      certNumber: string;
      qualifier: string;
    };
    notes: string;
    imageInsights: string[];
  };
  imageUrl: string;
  textEmbedding: number[];
  imageEmbedding: number[];
  createdAt: string;
  updatedAt: string;
};

export type SearchQuery = {
  query: string;
  limit?: number;
  textWeight?: number;
  imageWeight?: number;
  filters?: {
    playerName?: string;
    team?: string;
    year?: string;
    manufacturer?: string;
    grade?: string;
  };
};

export type SearchResult = {
  id: string;
  cardData: StoredCard['cardData'];
  imageUrl: string;
  textScore: number;
  imageScore: number;
  combinedScore: number;
  createdAt: string;
};
