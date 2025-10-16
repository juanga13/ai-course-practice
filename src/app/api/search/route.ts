import { NextRequest, NextResponse } from 'next/server';
import { generateTextEmbedding } from '@/utils/embeddings';
import { generateTextEmbeddingForCLIP } from '@/utils/clip';
import { searchSimilarCards } from '@/utils/vectorStore';
import { SearchQuery } from '@/app/types';

export async function POST(req: NextRequest) {
  try {
    const body: SearchQuery = await req.json();
    const {
      query,
      limit = 10,
      textWeight = 0.7,
      imageWeight = 0.3,
      filters,
    } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const [textEmbedding, clipTextEmbedding] = await Promise.all([
      generateTextEmbedding(query),
      generateTextEmbeddingForCLIP(query),
    ]);

    // Perform hybrid search
    const results = await searchSimilarCards(
      query,
      textEmbedding,
      clipTextEmbedding,
      textWeight,
      imageWeight,
      limit,
      filters
    );

    return NextResponse.json({
      query,
      results,
      totalResults: results.length,
      searchParams: {
        textWeight,
        imageWeight,
        limit,
        filters,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    const reason = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Search failed', reason },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const textWeight = parseFloat(searchParams.get('textWeight') || '0.7');
    const imageWeight = parseFloat(searchParams.get('imageWeight') || '0.3');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const filters: Record<string, unknown> = {};
    const playerName = searchParams.get('playerName');
    const team = searchParams.get('team');
    const year = searchParams.get('year');
    const manufacturer = searchParams.get('manufacturer');
    const grade = searchParams.get('grade');

    if (playerName) filters.playerName = { $eq: playerName };
    if (team) filters.team = { $eq: team };
    if (year) filters.year = { $eq: year };
    if (manufacturer) filters.manufacturer = { $eq: manufacturer };
    if (grade) filters.grade = { $eq: grade };

    const [textEmbedding, clipTextEmbedding] = await Promise.all([
      generateTextEmbedding(query),
      generateTextEmbeddingForCLIP(query),
    ]);

    const results = await searchSimilarCards(
      query,
      textEmbedding,
      clipTextEmbedding,
      textWeight,
      imageWeight,
      limit,
      Object.keys(filters).length > 0 ? filters : undefined
    );

    return NextResponse.json({
      query,
      results,
      totalResults: results.length,
      searchParams: {
        textWeight,
        imageWeight,
        limit,
        filters,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    const reason = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Search failed', reason },
      { status: 500 }
    );
  }
}
