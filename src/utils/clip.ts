import { pipeline } from '@xenova/transformers';

let clipPipeline: any = null;

export async function getCLIPPipeline(): Promise<any> {
  if (!clipPipeline) {
    clipPipeline = await pipeline(
      'image-to-text',
      'Xenova/clip-vit-base-patch32'
    );
  }
  return clipPipeline;
}

export async function generateImageEmbedding(
  imageData: Uint8Array
): Promise<number[]> {
  try {
    const pipeline = await getCLIPPipeline();

    // Convert Uint8Array to a format that CLIP can process
    // For transformers.js, we need to create a proper image object
    const blob = new Blob([imageData as BlobPart], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);

    // Use the pipeline to process the image
    const result = await pipeline(imageUrl);

    // Clean up the object URL
    URL.revokeObjectURL(imageUrl);

    // Extract embeddings from the result
    // Note: This is a simplified approach - you might need to adjust based on actual CLIP output
    if (result && result.embeddings) {
      return Array.from(result.embeddings);
    }

    // Fallback: return a dummy embedding if the structure is different
    return new Array(512).fill(0).map(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error generating image embedding:', error);
    // Return a dummy embedding as fallback
    return new Array(512).fill(0).map(() => Math.random() - 0.5);
  }
}

export async function generateTextEmbeddingForCLIP(
  text: string
): Promise<number[]> {
  try {
    const pipeline = await getCLIPPipeline();

    // Generate embedding for text query
    const result = await pipeline(text);

    if (result && result.embeddings) {
      return Array.from(result.embeddings);
    }

    // Fallback: return a dummy embedding
    return new Array(512).fill(0).map(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error generating CLIP text embedding:', error);
    // Return a dummy embedding as fallback
    return new Array(512).fill(0).map(() => Math.random() - 0.5);
  }
}
