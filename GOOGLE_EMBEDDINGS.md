# Using Google AI for Text Embeddings

## Overview

Your RAG system now uses **Google AI Studio's text-embedding-004 model** for generating text embeddings instead of OpenAI's API. This provides several advantages:

## Benefits

### 1. **Unified API Provider**

- Same Google API key for both card classification (Gemini) and text embeddings
- No need to manage multiple API providers
- Simplified environment configuration

### 2. **Cost-Effective**

- Google AI Studio offers a generous free tier
- Perfect for learning and development projects
- No additional billing setup required if you're already using Gemini

### 3. **High Quality Embeddings**

- 768-dimensional vectors with strong semantic understanding
- Excellent performance for similarity search
- Optimized for multilingual and domain-specific tasks

### 4. **Better Integration**

- Uses the same `@ai-sdk/google` package you're already using
- Consistent error handling and rate limiting
- Easier debugging with unified logging

## Technical Details

### Embedding Model

- **Model**: `text-embedding-004`
- **Dimensions**: 768 (reduced from OpenAI's 3072, which is more efficient)
- **Use Cases**: Semantic search, clustering, classification

### API Usage

```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embed } from 'ai';

const google = createGoogleGenerativeAI({ apiKey: GOOGLE_API_KEY });

const { embedding } = await embed({
  model: google.textEmbeddingModel('text-embedding-004'),
  value: 'Your text here',
});
```

### Rate Limits

Google AI Studio free tier provides:

- **60 requests per minute (RPM)**
- **1,500 requests per day (RPD)**

More than sufficient for development and learning purposes.

## Migration Notes

### What Changed

1. ✅ Removed OpenAI dependency (`npm uninstall openai`)
2. ✅ Updated `src/utils/embeddings.ts` to use Google AI
3. ✅ Changed embedding dimensions from 3072 → 768
4. ✅ Removed `OPENAI_API_KEY` from environment variables
5. ✅ Updated documentation

### What Stayed the Same

- CLIP image embeddings (still using transformers.js)
- Pinecone vector database integration
- Hybrid search functionality
- Search API endpoints
- UI components

## Performance Comparison

| Feature          | OpenAI (text-embedding-3-large) | Google AI (text-embedding-004) |
| ---------------- | ------------------------------- | ------------------------------ |
| Dimensions       | 3072                            | 768                            |
| Cost (free tier) | Limited                         | Generous                       |
| Quality          | Excellent                       | Excellent                      |
| Speed            | Fast                            | Fast                           |
| Integration      | Separate SDK                    | Same as Gemini                 |

**Note**: While OpenAI's embeddings have more dimensions, Google's 768-dimensional embeddings are highly optimized and provide excellent results for most use cases, especially at this scale.

## Next Steps

1. Make sure your `.env.local` has `GOOGLE_API_KEY` configured
2. No need to add `OPENAI_API_KEY` anymore
3. Test the embedding generation by uploading a card
4. Verify search results quality

## Troubleshooting

### "Missing OPENAI_API_KEY" Error

- **Solution**: This should no longer appear. If it does, restart your dev server.

### Rate Limit Errors

- **Solution**: Google AI Studio has generous limits. If you hit them, wait a minute or upgrade to a paid plan.

### Embedding Quality Issues

- **Solution**: The 768-dimensional embeddings should work excellently. If search quality seems poor, try adjusting the text/image weight ratios in the search interface.

## Resources

- [Google AI Embeddings Documentation](https://ai.google.dev/tutorials/embeddings_quickstart)
- [AI SDK Google Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
- [Vercel AI SDK Embeddings](https://sdk.vercel.ai/docs/ai-sdk-core/embeddings)
