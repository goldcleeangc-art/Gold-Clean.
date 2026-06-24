import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    const prompt = `أنت خبير في تحسين محركات البحث (SEO). 
قم بتوليد بيانات SEO لمنتج باللغة العربية بناءً على المعلومات التالية:
اسم المنتج: ${name}
وصف المنتج: ${description}

المطلوب إرجاعه هو JSON بالصيغة التالية فقط بدون أي نصوص إضافية:
{
  "seoTitle": "عنوان مناسب لمحركات البحث (لا يتجاوز 60 حرف)",
  "seoDescription": "وصف مناسب لمحركات البحث (لا يتجاوز 160 حرف)",
  "seoKeywords": "كلمات مفتاحية مفصولة بفواصل"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "";
    let data;
    try {
        data = JSON.parse(text);
    } catch(e) {
        // Fallback in case of parsing error
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            data = JSON.parse(match[0]);
        } else {
            throw new Error("Invalid JSON response from AI");
        }
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("SEO generation error:", error);
    return NextResponse.json({ error: "Failed to generate SEO data" }, { status: 500 });
  }
}
