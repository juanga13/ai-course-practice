import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { getEnv } from "@/env";
import { cardSchema } from "@/lib/cardSchema";

// initialize per-request to ensure env is available at runtime
function getGoogle() {
  const { GOOGLE_API_KEY } = getEnv();
  return createGoogleGenerativeAI({ apiKey: GOOGLE_API_KEY, });
}

const SUPPORTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const uploadSchema = z.object({ file: z.instanceof(Blob) });

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "image_not_supported", reason: "No file provided" },
        { status: 400 },
      );
    }

    if (!SUPPORTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "image_not_supported",
          reason: `Unsupported type: ${file.type}`,
        },
        { status: 400 },
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const isImage = file.type.startsWith("image/");

    const systemPrompt =
      "You extract structured data from an NBA PSA certified trading card image. Return as JSON per schema. If not a PSA graded NBA card, explain why.";

    const google = getGoogle();
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: cardSchema,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract the card details from this card." },
            ...(isImage
              ? ([{ type: "image", image: bytes }] as any)
              : ([{ type: "file", data: bytes }] as any)),
          ],
        },
      ],
    });

    // Basic plausibility check: require playerName non-empty
    if (!object.playerName) {
      return NextResponse.json(
        {
          error: "image_not_supported",
          reason:
            "Could not identify an NBA PSA certified card or missing key fields",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(object);
  } catch (err: unknown) {
    const reason = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "image_not_supported", reason },
      { status: 400 },
    );
  }
}


