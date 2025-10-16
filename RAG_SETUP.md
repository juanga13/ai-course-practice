# RAG System Setup Guide

This guide will help you set up the RAG (Retrieval-Augmented Generation) system for your PSA card application.

## Prerequisites

1. **Pinecone Account**: Sign up at [pinecone.io](https://www.pinecone.io/)
2. **Google AI Studio API Key**: Already configured for your existing Gemini integration (will be used for both classification and text embeddings)

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Existing variables (already configured)
GOOGLE_API_KEY=your_google_api_key_here

# New variables for RAG system
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

## Setup Steps

### 1. Pinecone Setup

1. Go to [pinecone.io](https://www.pinecone.io/) and create an account
2. Create a new project
3. Get your API key and environment from the Pinecone console
4. Add these to your `.env.local` file

### 2. Vercel Blob Storage Setup

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab → **Create Database** → **Blob**
3. Copy the `BLOB_READ_WRITE_TOKEN` from Settings → Environment Variables
4. Add it to your `.env.local` file

**Note**: See `VERCEL_BLOB_SETUP.md` for detailed instructions.

### 3. Test the System

1. Start your development server: `pnpm dev`
2. Go to the "NBA Card Classifier" tab
3. Upload a PSA card image to test the classification and embedding generation
4. Switch to the "RAG Card Search" tab
5. Search for cards using text queries

## Features

### Upload and Classify

- Upload PSA card images
- Automatic extraction of card metadata
- Generation of text and image embeddings
- **Permanent image storage** in Vercel Blob (CDN-backed)
- Storage in Pinecone vector database

### Hybrid Search

- Text-based search using Google AI (text-embedding-004) embeddings
- Image-based search using CLIP embeddings
- Tunable weighting between text and image similarity
- Metadata filtering (player, team, year, manufacturer, grade)
- Combined scoring for ranked results

### Search Interface

- Real-time search with customizable parameters
- Advanced filtering options
- Score visualization
- Card preview with metadata

## Troubleshooting

### Common Issues

1. **"Missing API Key" errors**: Check that all environment variables are set correctly
2. **Pinecone connection issues**: Verify your API key and environment
3. **Google AI rate limits**: Check your Google AI Studio usage quotas
4. **CLIP model loading**: The transformers.js library may take time to load models on first use

### Performance Notes

- CLIP model loading can be slow on first use (models are downloaded and cached)
- Pinecone index creation may take a few minutes
- Embedding generation adds latency to the upload process

## Architecture

The RAG system consists of:

1. **Text Embeddings**: Generated using Google AI's text-embedding-004 model (768 dimensions)
2. **Image Embeddings**: Generated using CLIP ViT-B/32 via transformers.js (512 dimensions)
3. **Vector Storage**: Pinecone vector database with metadata filtering
4. **Hybrid Search**: Combines text and image similarity with tunable weights
5. **Search API**: RESTful endpoints for querying the system

### Why Google AI for Text Embeddings?

Google AI Studio's text-embedding-004 model provides:

- **Cost-effective**: Free tier is generous for learning projects
- **High quality**: 768-dimensional embeddings with strong semantic understanding
- **Unified API**: Same API key and SDK as your existing Gemini classification
- **Better integration**: No need to manage multiple API providers

## Next Steps

- Add more sophisticated filtering options
- Implement image-to-image search
- Add card collection management
- Optimize embedding generation performance
- Add user authentication and personal collections
