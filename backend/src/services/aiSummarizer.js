/**
 * AI summarizer service — generates executive summaries via Groq or Gemini LLM APIs.
 */
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const SYSTEM_PROMPT = `You are a Senior Strategic Business Analyst and Data Scientist. 
Given the structured data analysis results from a sales dataset, generate an executive-level summary suitable for C-suite executives and business leaders.

Your summary must be highly professional, data-driven, and clearly structured. 
Include the following sections with exactly these core areas:

1. **Performance Overview** — A high-level view of the dataset scope and overall top-line metrics (revenue, volume, etc., with actual numbers).
2. **Key Insights** — The most significant patterns, trends, and business drivers discovered.
3. **Anomalies or Risks** — Any data quality issues, missing values, outliers, or potential business risks identified in the data.
4. **Recommendations** — 2-3 actionable, strategic business recommendations based on the findings.

Format the output in clean, readable Markdown. Use bullet points to emphasize critical findings. Keep it concise but impactful.`;

/**
 * Generate an AI executive summary from analysis results.
 *
 * @param {object} analysis - Structured analysis output.
 * @returns {Promise<string>} Markdown executive summary.
 */
export async function generateSummary(analysis) {
  const userPrompt = `Analyze this sales dataset and generate an executive summary:\n\n${JSON.stringify(analysis, null, 2)}`;

  if (config.llmProvider === 'groq') {
    return callGroq(userPrompt);
  } else if (config.llmProvider === 'gemini') {
    return callGemini(userPrompt);
  } else {
    throw new Error(`Unsupported LLM provider: ${config.llmProvider}`);
  }
}

/**
 * Call the Groq API (OpenAI-compatible).
 */
async function callGroq(userPrompt) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.groqModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const summary = data.choices[0].message.content;
  logger.info(`Groq summary generated (${summary.length} chars)`);
  return summary;
}

/**
 * Call the Google Gemini API.
 */
async function callGemini(userPrompt) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const summary = data.candidates[0].content.parts[0].text;
  logger.info(`Gemini summary generated (${summary.length} chars)`);
  return summary;
}
