import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const SEO_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { name, description } = await req.json();
    if (!name || !description) {
      return NextResponse.json(
        { error: "Product name and description are required" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an Arabic SEO expert.
Generate SEO data in Arabic for this product:
Product name: ${name}
Product description: ${description}

Return only valid JSON with this exact shape:
{
  "seoTitle": "Arabic SEO title, max 60 characters",
  "seoDescription": "Arabic SEO meta description, max 160 characters",
  "seoKeywords": "Arabic keywords separated by commas"
}`;

    const response = await ai.models.generateContent({
      model: SEO_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("Invalid JSON response from AI");
      }
      data = JSON.parse(match[0]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("SEO generation error:", error);
    const message = getErrorMessage(error);

    return NextResponse.json(
      { error: `Failed to generate SEO data: ${message}` },
      { status: 500 }
    );
  }
}
