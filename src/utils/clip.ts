import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

let clipPipeline: FeatureExtractionPipeline | null = null;

export async function getCLIPPipeline(): Promise<FeatureExtractionPipeline> {
  if (!clipPipeline) {
    clipPipeline = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      { quantized: true }
    );
  }
  return clipPipeline;
}

export async function generateImageEmbedding(
  image: string | string[]
): Promise<number[]> {
  try {
    const pipeline = await getCLIPPipeline();

    console.log('[CLIP] Feature extraction pipeline', pipeline);
    const result = await pipeline(image, {
      pooling: 'mean',
      normalize: true,
    });

    const resultArray = Array.from(result.data);
    console.log('[CLIP] Result', resultArray);
    return resultArray;
  } catch (error) {
    console.error('[CLIP] Error generating image embedding:', error);
    throw new Error('Failed to generate image embedding');
  }
}

export async function generateTextEmbeddingForCLIP(
  text: string
): Promise<number[]> {
  try {
    const pipeline = await getCLIPPipeline();
    console.log('[CLIP] Feature extraction pipeline', pipeline);

    const result = await pipeline(text, {
      pooling: 'mean',
      normalize: true,
    });

    const resultArray = Array.from(result.data);
    console.log('[CLIP] Result', resultArray);
    return resultArray;
  } catch (error) {
    console.error('Error generating CLIP text embedding:', error);
    throw new Error('Failed to generate CLIP text embedding');
  }
}
