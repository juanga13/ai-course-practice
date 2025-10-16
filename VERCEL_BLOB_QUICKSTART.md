# Quick Start: Vercel Blob Storage

## ✅ Installation Complete!

Vercel Blob Storage has been successfully integrated into your RAG system. Here's what you need to do to get started:

## 🚀 Next Steps

### 1. Get Your Blob Token

**Option A: If you already have a Vercel project deployed:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** → **Blob**
5. Go to **Settings** → **Environment Variables**
6. Copy the `BLOB_READ_WRITE_TOKEN` value

**Option B: If you haven't deployed yet:**

1. Deploy your project to Vercel first: `vercel deploy`
2. Then follow Option A steps above

### 2. Add Token to `.env.local`

Create or update your `.env.local` file:

```env
# Your existing variables
GOOGLE_API_KEY=your_google_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here

# Add this new one:
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 3. Start Your Dev Server

```bash
pnpm dev
```

### 4. Test It Out!

1. Go to `http://localhost:3000`
2. Navigate to the "NBA Card Classifier" tab
3. Upload a PSA card image
4. The image will be:
   - ✅ Uploaded to Vercel Blob Storage
   - ✅ Analyzed by Gemini
   - ✅ Embedded with Google AI + CLIP
   - ✅ Stored in Pinecone with a small URL reference

## 🎯 What Changed?

### Before (Problem):

```typescript
// Base64 encoding - 100-300KB in metadata
const imageUrl = `data:image/jpeg;base64,${huge_string}`;
// ❌ Exceeded Pinecone's 40KB metadata limit
```

### After (Solution):

```typescript
// Upload to Vercel Blob
const blob = await put(fileName, file, { access: 'public' });
const imageUrl = blob.url; // ~80 bytes!
// ✅ Fits easily in Pinecone metadata
```

## 📦 What Was Installed?

- **Package**: `@vercel/blob` - Official Vercel Blob Storage SDK
- **Updated**: Environment configuration to require `BLOB_READ_WRITE_TOKEN`
- **Modified**: `/api/analyze` route to upload images to Blob Storage
- **Added**: Complete documentation in `VERCEL_BLOB_SETUP.md`

## 🔍 How to Verify It's Working

After uploading a card, check the API response:

```json
{
  "playerName": "LeBron James",
  "cardId": "card_1234567890_abc123",
  "imageUrl": "https://xyz.public.blob.vercel-storage.com/cards/LeBron-James-1234567890-def456.jpg",
  "stored": true
}
```

The `imageUrl` should be a Vercel Blob URL, not a data URL!

## 💰 Cost

**Free Tier (Hobby Plan):**

- 500 GB bandwidth/month
- 100 GB storage
- More than enough for learning!

## 🆘 Troubleshooting

### "Missing BLOB_READ_WRITE_TOKEN" Error

**Solution**: You need to add the token to your `.env.local` file. See step 1 above.

### "Access Denied" or "Unauthorized" Error

**Solution**:

- Make sure your token starts with `vercel_blob_rw_`
- Verify you copied the entire token (they're long!)
- Restart your dev server after adding the token

### Images Not Showing in Search Results

**Solution**: The images are stored! Check that:

- The URL in the response looks like: `https://xyz.public.blob.vercel-storage.com/...`
- You can open the URL directly in your browser
- The Search UI is using the `imageUrl` field

## 📚 More Information

- **Detailed Setup**: See `VERCEL_BLOB_SETUP.md`
- **RAG System Overview**: See `RAG_SETUP.md`
- **Google Embeddings**: See `GOOGLE_EMBEDDINGS.md`

## ✨ Benefits

✅ **No more metadata size errors**
✅ **Permanent image storage**
✅ **CDN-backed delivery**
✅ **Works in local dev and production**
✅ **Simple integration**

You're all set! Just add your `BLOB_READ_WRITE_TOKEN` and start uploading cards! 🎉
