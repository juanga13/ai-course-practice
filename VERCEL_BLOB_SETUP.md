# Vercel Blob Storage Setup Guide

## Overview

Your RAG system now uses **Vercel Blob Storage** to persist card images. This solves the Pinecone metadata size limit issue and provides permanent, CDN-backed storage for your card images.

## Why Vercel Blob?

- ✅ **No metadata size issues** - URLs are small (~80 bytes vs 100KB+ base64 strings)
- ✅ **Persistent storage** - Images survive deployments and restarts
- ✅ **CDN-backed** - Fast global access to images
- ✅ **Works locally** - Easy development with the same token
- ✅ **Generous free tier** - 500GB bandwidth, 100GB storage per month

## Setup Instructions

### 1. Enable Blob Storage in Vercel Dashboard

**For Production (Vercel Deployed):**

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the **Storage** tab
3. Click **Create Database** → **Blob**
4. Vercel will automatically create and inject the `BLOB_READ_WRITE_TOKEN` environment variable

**For Local Development:**

1. After enabling Blob Storage in your Vercel project, go to **Settings** → **Environment Variables**
2. Find the `BLOB_READ_WRITE_TOKEN` variable
3. Copy its value
4. Add it to your local `.env.local` file (see below)

### 2. Update Your `.env.local` File

Add the Blob token to your environment variables:

```env
# Existing variables
GOOGLE_API_KEY=your_google_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here

# New: Vercel Blob Storage token
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 3. Test Locally

```bash
pnpm dev
```

1. Go to the "NBA Card Classifier" tab
2. Upload a PSA card image
3. The image will be uploaded to Vercel Blob Storage
4. You'll receive a permanent URL like: `https://xyz.public.blob.vercel-storage.com/cards/...`

### 4. Deploy to Vercel

```bash
git add .
git commit -m "Add Vercel Blob Storage integration"
git push
```

Vercel will automatically deploy with the Blob Storage token already configured!

## How It Works

### Upload Flow

1. **User uploads image** → Your Next.js API receives the file
2. **Gemini analyzes** → Extracts card metadata
3. **Upload to Blob** → Image stored in Vercel Blob Storage
4. **Generate embeddings** → Text and image embeddings created
5. **Store in Pinecone** → Embeddings + small Blob URL stored (no size issues!)
6. **Return to user** → Card data with permanent image URL

### File Organization

Images are stored with this naming pattern:

```
cards/Player-Name-1234567890.jpg
```

With `addRandomSuffix: true`, Vercel adds a unique suffix to prevent collisions:

```
cards/Player-Name-1234567890-abc123.jpg
```

## Cost & Limits

### Free Tier (Hobby Plan)

- **500 GB** bandwidth per month
- **100 GB** storage
- Perfect for learning projects!

### After Free Tier

- **$0.15/GB** bandwidth
- **$0.02/GB** storage per month

### Example Usage

- Average card image: ~200KB
- 100 cards uploaded: ~20MB storage
- 1000 searches viewing images: ~200MB bandwidth
- **Well within free tier limits!**

## Troubleshooting

### "Missing BLOB_READ_WRITE_TOKEN" Error

**Solution:**

1. Make sure you've enabled Blob Storage in your Vercel project
2. Copy the token from Vercel Dashboard → Settings → Environment Variables
3. Add it to your `.env.local` file
4. Restart your dev server: `pnpm dev`

### "Access Denied" Error

**Solution:**

- Verify your token starts with `vercel_blob_rw_`
- Make sure you copied the full token (they're long!)
- Check that the token hasn't expired or been regenerated

### Images Not Loading in Search Results

**Solution:**

- Check that the `imageUrl` field is being returned from the API
- Verify the URL format: `https://xyz.public.blob.vercel-storage.com/...`
- Images are public by default, so no authentication needed

### Local Development Not Working

**Solution:**

1. Ensure `.env.local` exists in your project root
2. Restart your dev server after adding the token
3. Check the console for any error messages
4. Verify the token is valid by testing in production first

## Advanced: Managing Blob Storage

### View Your Stored Files

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# List blobs
vercel blob ls
```

### Delete Old Files

```bash
# Delete a specific file
vercel blob rm cards/Player-Name-1234567890-abc123.jpg

# Or use the Vercel Dashboard → Storage → Blob → Browse
```

### Set Up Automatic Cleanup (Optional)

You can create a cron job to delete old images:

```typescript
// app/api/cron/cleanup/route.ts
import { list, del } from '@vercel/blob';

export async function GET() {
  const { blobs } = await list();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  for (const blob of blobs) {
    if (new Date(blob.uploadedAt).getTime() < thirtyDaysAgo) {
      await del(blob.url);
    }
  }

  return Response.json({ cleaned: true });
}
```

## Benefits Over Base64 Storage

| Feature        | Base64 in Metadata | Vercel Blob Storage  |
| -------------- | ------------------ | -------------------- |
| Metadata size  | 100-300KB          | ~80 bytes (URL only) |
| Pinecone limit | ❌ Exceeds 40KB    | ✅ Well under limit  |
| Persistence    | ❌ Lost on restart | ✅ Permanent         |
| CDN delivery   | ❌ No              | ✅ Yes               |
| Performance    | ❌ Slow            | ✅ Fast              |
| Cost           | Included           | Free tier generous   |

## Next Steps

- ✅ Images are now permanently stored
- ✅ No more metadata size errors
- ✅ Search results can display actual images
- ✅ Works in both development and production

Your RAG system is now production-ready with proper image storage! 🚀

## Resources

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob API Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
- [Pricing Details](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)
