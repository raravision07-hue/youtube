import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Gemini API Key is missing. Please set GEMINI_API_KEY or VITE_GEMINI_API_KEY in your environment.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export interface TranscriptResult {
  originalTranscript: string;
  translatedTranscript: string;
  language: string;
}

export interface SocialMediaContent {
  titles: string[];
  description: string;
  keywords: string[];
  hashtags: string[];
  platforms: {
    youtube: {
      seoTitles: string[]; // 5-10
      longDescription: string; // hook + summary + CTA
      tags: string[]; // 15-25
      hashtags: string[]; // 5-10
      chapters: string; // timestamps 00:00 format
      thumbnailTextIdeas: string[]; // 3-5
      viralHooks: string[]; // 3
      shortsReelsIdeas: string[]; // 3
      audienceTargeting: string;
      seoScore: number;
      clickabilityScore: number;
      viralScore: number;
    };
    facebook: {
      engagingCaption: string; // emoji + story style
      shortPostVersion: string;
      cta: string;
      hashtags: string[]; // 5-10
      viralHookLines: string[];
      shareabilityScore: number;
      audienceSuggestion: string;
      bestPostingTime: string;
    };
  };
  global: {
    contentAnalysis: string;
    mainTopic: string;
    subtopics: string[];
    viralOptimizationIdeas: string[];
    bestPostingTime: string;
    targetAudienceBreakdown: string;
    scoring: {
      seo: number;
      viral: number;
      clickability: number;
    };
    improvementSuggestions: {
      title: string;
      engagement: string;
    };
  };
}

/**
 * Step 2: Transcribe and detect language
 */
export async function processAudio(audioData: string, mimeType: string): Promise<TranscriptResult> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a premium AI Transcription System.
    1. Transcribe the full audio/video accurately.
    2. Detect the original language of the input.
    3. REMOVE filler words (um, ah, repeated words, stutters).
    4. PRESERVE meaning 100% exactly.
    5. IMPORTANT: The "translatedTranscript" should be in the SAME language as the detected "language". 
       DO NOT translate to another language unless it's to clean it up.
    6. Format the output as JSON with keys: "originalTranscript", "translatedTranscript", "language".
    
    CRITICAL RULE: If input is Bengali, output is Bengali. If input is English, output is English. If input is Hindi, output is Hindi.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            text: "Please transcribe this audio and detect the language."
          },
          {
            inlineData: {
              data: audioData.split(",")[1] || audioData,
              mimeType: mimeType
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalTranscript: { type: Type.STRING },
          translatedTranscript: { type: Type.STRING },
          language: { type: Type.STRING }
        },
        required: ["originalTranscript", "translatedTranscript", "language"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result;
}

/**
 * Step 4: Generate viral content from confirmed transcript
 */
export async function generateViralContent(transcript: string): Promise<SocialMediaContent> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a Premium AI Content Generation System for audio/video.
    Your job is to understand content deeply and generate structured, clean, professional outputs.

    ========================
    CRITICAL RULE (VERY IMPORTANT):
    - Identify the language of the provided transcript.
    - ALL OUTPUT MUST BE IN THE SAME LANGUAGE AS THE TRANSCRIPT.
    - Examples: If transcript is Bengali → ALL OUTPUT in Bengali. If transcript is English → ALL OUTPUT in English.
    - DO NOT MIX LANGUAGES.

    ========================
    STRUCTURED OUTPUT SECTIONS:
    1. UNDERSTANDING: Analysis, Main Topic, Sub Topics, Purpose, Tone, Key Points.
    2. YOUTUBE SERVICE: 
       - SEO Optimized Video Titles (5-10 items)
       - Long Description (hook + summary + CTA)
       - Tags (15-25 items)
       - Hashtags (5-10 items)
       - Chapters (timestamps 00:00 format)
       - Thumbnail Text Ideas (3-5 items)
       - Viral Hooks (3 items)
       - Shorts/Reels Ideas (3 items)
       - Audience Targeting
       - Scores: SEO Score (0-100), Clickability Score (0-100), Viral Score (0-100)
    3. FACEBOOK SERVICE:
       - Engaging Caption (emoji + story style)
       - Short Post Version
       - CTA (call-to-action)
       - Hashtags (5-10 items)
       - Viral Hook Lines
       - Scores: Shareability Score (0-100)
       - Audience Suggestion
       - Best Posting Time
    
    Output MUST be a valid JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Process this transcript following the Premium SaaS Dashboard rules: ${transcript}` }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          platforms: {
            type: Type.OBJECT,
            properties: {
              youtube: {
                type: Type.OBJECT,
                properties: {
                  seoTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  longDescription: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  chapters: { type: Type.STRING },
                  thumbnailTextIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                  viralHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  shortsReelsIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                  audienceTargeting: { type: Type.STRING },
                  seoScore: { type: Type.NUMBER },
                  clickabilityScore: { type: Type.NUMBER },
                  viralScore: { type: Type.NUMBER }
                },
                required: ["seoTitles", "longDescription", "tags", "hashtags", "chapters", "thumbnailTextIdeas", "viralHooks", "shortsReelsIdeas", "audienceTargeting", "seoScore", "clickabilityScore", "viralScore"]
              },
              facebook: {
                type: Type.OBJECT,
                properties: {
                  engagingCaption: { type: Type.STRING },
                  shortPostVersion: { type: Type.STRING },
                  cta: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  viralHookLines: { type: Type.ARRAY, items: { type: Type.STRING } },
                  shareabilityScore: { type: Type.NUMBER },
                  audienceSuggestion: { type: Type.STRING },
                  bestPostingTime: { type: Type.STRING }
                },
                required: ["engagingCaption", "shortPostVersion", "cta", "hashtags", "viralHookLines", "shareabilityScore", "audienceSuggestion", "bestPostingTime"]
              }
            },
            required: ["youtube", "facebook"]
          },
          global: {
            type: Type.OBJECT,
            properties: {
              contentAnalysis: { type: Type.STRING },
              mainTopic: { type: Type.STRING },
              subtopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              viralOptimizationIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
              bestPostingTime: { type: Type.STRING },
              targetAudienceBreakdown: { type: Type.STRING },
              scoring: {
                type: Type.OBJECT,
                properties: {
                  seo: { type: Type.NUMBER },
                  viral: { type: Type.NUMBER },
                  clickability: { type: Type.NUMBER }
                },
                required: ["seo", "viral", "clickability"]
              },
              improvementSuggestions: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  engagement: { type: Type.STRING }
                },
                required: ["title", "engagement"]
              }
            },
            required: ["contentAnalysis", "mainTopic", "subtopics", "viralOptimizationIdeas", "bestPostingTime", "targetAudienceBreakdown", "scoring", "improvementSuggestions"]
          }
        },
        required: ["titles", "description", "keywords", "hashtags", "platforms", "global"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result;
}
