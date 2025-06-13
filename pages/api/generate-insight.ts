// pages/api/generate-insight.ts
// This is a Next.js API route that securely interacts with the Gemini AI.

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextApiRequest, NextApiResponse } from 'next';

// IMPORTANT: Your API key is accessed securely via process.env
// For API routes, environment variables do NOT need the NEXT_PUBLIC_ prefix.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Check if API key is configured. This is crucial for security.
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  // For production, you might want to throw an error or handle this more gracefully.
  // For hackathon, a console error is fine, but the API call will fail.
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure this API route only accepts POST requests for security and clarity
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Only POST requests are supported.' });
  }

  // Extract journal content from the request body
  const { content } = req.body;

  // Basic validation: ensure content is provided
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Journal content is required to generate insights.' });
  }

  // Ensure GEMINI_API_KEY is available before proceeding
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'AI service is not configured. GEMINI_API_KEY missing.' });
  }

  let aiInsight: string;
  try {
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Use the specified Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

    // Construct the prompt for the AI with the desired persona
    // The instructions for the AI's persona are critical here.
    const prompt = `You are Jotbot's Ruthless Reality AI. Your purpose is to provide extremely blunt, cynical, toxic, and emotionally detached feedback on the user's journal entries. You are utterly unimpressed by their feelings, struggles, or minor achievements. Your feedback will be harsh, sarcastic, subtly demeaning, and will frequently compare them unfavorably to others (like a fictional "cousin Timmy" who is always better) or directly highlight their glaring shortcomings. Your response MUST be a single sentence and only use that as your output.
    Here is the human-written diary entry: "${content}"`;

    // Generate content from the AI model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    aiInsight = response.text(); // Extract the AI's text response

    // Send the AI insight back as a successful JSON response
    return res.status(200).json({ insight: aiInsight });

  } catch (error) {
    console.error("Error calling Gemini AI from API route:", error);
    // If there's an error with the AI call, return a server error
    return res.status(500).json({ error: 'Failed to generate AI insight. Please try again later.' });
  }
}
