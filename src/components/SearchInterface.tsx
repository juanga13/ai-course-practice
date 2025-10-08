import { useState, useCallback } from 'react';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SearchResult, SearchQuery } from '@/app/types';

export const SearchInterface = () => {
  const [query, setQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    textWeight: 0.7,
    imageWeight: 0.3,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    playerName: '',
    team: '',
    year: '',
    manufacturer: '',
    grade: '',
  });

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const searchQuery: SearchQuery = {
        query: query.trim(),
        limit: searchParams.limit,
        textWeight: searchParams.textWeight,
        imageWeight: searchParams.imageWeight,
        filters: Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value.trim() !== '')
        ),
      };

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchQuery),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        const errorData = await response.json();
        setError(errorData.reason || 'Search failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [query, searchParams, filters]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderResults = () => {
    if (isSearching) {
      return (
        <div className="bg-white win95-shadow-inset h-full flex items-center justify-center">
          <Text className="text-gray-600">Searching...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white win95-shadow-inset h-full flex items-center justify-center">
          <Text className="text-red-600 text-center">{error}</Text>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="bg-white win95-shadow-inset h-full flex items-center justify-center">
          <Text className="text-gray-600">
            No results found. Try a different search.
          </Text>
        </div>
      );
    }

    return (
      <div className="bg-white win95-shadow-inset h-full overflow-y-auto">
        <div className="p-4 space-y-4">
          <Text className="text-lg font-bold">
            Search Results ({results.length})
          </Text>

          {results.map(result => (
            <div key={result.id} className="border-b pb-4 last:border-b-0">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={result.imageUrl}
                    alt={result.cardData.playerName}
                    className="w-24 h-32 object-cover border"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Text className="text-lg font-bold">
                      {result.cardData.playerName}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Score: {result.combinedScore.toFixed(3)}
                    </Text>
                  </div>

                  <Text className="text-sm text-gray-600 mb-2">
                    {result.cardData.team} • {result.cardData.year}
                  </Text>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Text className="font-semibold">Card Details:</Text>
                      <Text>Manufacturer: {result.cardData.manufacturer}</Text>
                      <Text>Set: {result.cardData.setName}</Text>
                      <Text>Type: {result.cardData.parallelOrVariant}</Text>
                      <Text>Card #: {result.cardData.cardNumber}</Text>
                    </div>

                    <div>
                      <Text className="font-semibold">PSA Grade:</Text>
                      <Text>
                        Grade: {result.cardData.psa.grade}
                        {result.cardData.psa.qualifier}
                      </Text>
                      <Text>Cert #: {result.cardData.psa.certNumber}</Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        Text: {result.textScore.toFixed(3)} | Image:{' '}
                        {result.imageScore.toFixed(3)}
                      </Text>
                    </div>
                  </div>

                  {result.cardData.notes && (
                    <div className="mt-2">
                      <Text className="font-semibold text-sm">Notes:</Text>
                      <Text className="text-sm">{result.cardData.notes}</Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-background p-2 gap-2 h-full overflow-hidden">
      {/* Search Input */}
      <div className="bg-white win95-shadow-inset p-4 flex-shrink-0">
        <div className="flex gap-2 mb-4">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for cards..."
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Advanced Options */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Text className="font-semibold mb-2">Search Weights:</Text>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Text className="w-20">Text:</Text>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={searchParams.textWeight}
                  onChange={e =>
                    setSearchParams(prev => ({
                      ...prev,
                      textWeight: parseFloat(e.target.value) || 0.7,
                    }))
                  }
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Text className="w-20">Image:</Text>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={searchParams.imageWeight}
                  onChange={e =>
                    setSearchParams(prev => ({
                      ...prev,
                      imageWeight: parseFloat(e.target.value) || 0.3,
                    }))
                  }
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Text className="w-20">Limit:</Text>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={searchParams.limit}
                  onChange={e =>
                    setSearchParams(prev => ({
                      ...prev,
                      limit: parseInt(e.target.value) || 10,
                    }))
                  }
                  className="w-20"
                />
              </div>
            </div>
          </div>

          <div>
            <Text className="font-semibold mb-2">Filters:</Text>
            <div className="space-y-2">
              <Input
                placeholder="Player name"
                value={filters.playerName}
                onChange={e =>
                  setFilters(prev => ({ ...prev, playerName: e.target.value }))
                }
                className="w-full"
              />
              <Input
                placeholder="Team"
                value={filters.team}
                onChange={e =>
                  setFilters(prev => ({ ...prev, team: e.target.value }))
                }
                className="w-full"
              />
              <Input
                placeholder="Year"
                value={filters.year}
                onChange={e =>
                  setFilters(prev => ({ ...prev, year: e.target.value }))
                }
                className="w-full"
              />
              <Input
                placeholder="Manufacturer"
                value={filters.manufacturer}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    manufacturer: e.target.value,
                  }))
                }
                className="w-full"
              />
              <Input
                placeholder="Grade"
                value={filters.grade}
                onChange={e =>
                  setFilters(prev => ({ ...prev, grade: e.target.value }))
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 min-h-0">{renderResults()}</div>
    </div>
  );
};
