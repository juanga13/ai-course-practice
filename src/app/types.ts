export type HistoryItem = {
  id: string;
  name: string;
  url: string;
  result: any | null;
  error?: { error: string; reason: string } | null;
};


