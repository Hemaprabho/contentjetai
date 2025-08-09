
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

const insightsSchema = { type: Type.OBJECT, properties: { viralScore: { type: Type.INTEGER, description: "A brutally honest virality score from 1-100, based on psychology and known viral patterns." }, emotionalAccuracy: { type: Type.INTEGER, description: "A score from 1-100 on how well the post reflects the intended emotions." }, platformOptimization: { type: Type.INTEGER, description: "A score from 1-100 on how well the post is structured, toned, and formatted for the target platform." }, readability: { type: Type.INTEGER, description: "A score from 1-100 on the clarity, flow, and ease of reading." }, shareability: { type: Type.INTEGER, description: "A score from 1-100 predicting the likelihood a user would share or save this post." }, quotableLine: { type: Type.STRING, description: "The single most powerful, standout line from the post. If none exists, state 'No standout line identified.'." }, suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two brutally honest, constructive improvement ideas if the viral score is below 85. If the score is 85 or above, provide one 'Next-Level Tweak' to push it even further." }, howToPost: { type: Type.STRING, description: "A tactical guide on HOW to post the content for maximum impact. This guide MUST be specific to the target platform. Include timing, cross-promotion ideas, and a first-comment strategy. Format this as a step-by-step list." } }, required: ["viralScore", "emotionalAccuracy", "platformOptimization", "readability", "shareability", "quotableLine", "suggestions", "howToPost"] };
const youtubeScriptSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING, description: "A viral, SEO-optimized title for the YouTube video." }, hook: { type: Type.STRING, description: "A 15-second hook for the video script to maximize viewer retention." }, script: { type: Type.STRING, description: "The full video script, formatted with scene cues or spoken lines." }, description: { type: Type.STRING, description: "A full YouTube description, including a summary, timestamps, and links." }, cta: { type: Type.STRING, description: "A clear call-to-action for the end of the video." }, hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 5-10 relevant hashtags." }, thumbnailIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 3 distinct, clickable thumbnail concepts." }, }, required: ["title", "hook", "script", "description", "cta", "hashtags", "thumbnailIdeas"] };
const linkedinPostSchema = { type: Type.OBJECT, properties: { hook: { type: Type.STRING, description: "The powerful, attention-grabbing first line of the post." }, body: { type: Type.STRING, description: "The main content of the post, formatted with double line breaks for readability on LinkedIn." }, cta: { type: Type.STRING, description: "A clear call-to-action or question to drive engagement at the end of the post." }, suggestedVisual: { type: Type.STRING, description: "A brief idea for a compelling visual (image, diagram, or short video) to accompany the post. E.g., 'A minimalist graphic showing the 3 steps.' or 'No visual needed'." } }, required: ["hook", "body", "cta", "suggestedVisual"] };
const twitterPostSchema = { type: Type.OBJECT, properties: { hookTweet: { type: Type.STRING, description: "The first tweet of the thread, designed for maximum virality and intrigue. Must be under 280 characters." }, threadTweets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 2-5 subsequent tweets that elaborate on the hook. Each tweet must be under 280 characters." }, finalTweet: { type: Type.STRING, description: "The concluding tweet, often containing a summary, a call-to-action, or a link. Under 280 characters." }, hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 2-4 relevant hashtags." } }, required: ["hookTweet", "threadTweets", "finalTweet", "hashtags"] };
const instagramPostSchema = { type: Type.OBJECT, properties: { caption: { type: Type.STRING, description: "The full post caption, including a strong hook, value-packed body, and a clear CTA. Use emojis where appropriate." }, hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A block of 10-15 relevant hashtags." }, visualType: { type: Type.STRING, description: "The suggested visual format. Must be one of: 'Single Image', 'Carousel', 'Reel'." }, visualIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of ideas for the visual. If 'Single Image', one idea. If 'Reel', a brief script or shot list. If 'Carousel', a title/idea for each slide (e.g., 'Slide 1: Hook', 'Slide 2: The Problem')." } }, required: ["caption", "hashtags", "visualType", "visualIdeas"] };
const blogPostSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING, description: "A catchy, SEO-friendly title for the blog post." }, metaDescription: { type: Type.STRING, description: "A 160-character meta description for search engine results." }, introduction: { type: Type.STRING, description: "The hook-heavy introduction paragraph(s) for the blog post." }, bodySections: { type: Type.ARRAY, description: "An array of objects, where each object represents a section of the blog post.", items: { type: Type.OBJECT, properties: { heading: { type: Type.STRING, description: "The H2 or H3 heading for this section." }, content: { type: Type.STRING, description: "The paragraph(s) for this section. Use double line breaks for new paragraphs." } }, required: ["heading", "content"] } }, conclusion: { type: Type.STRING, description: "The concluding paragraph, summarizing the key points and providing a final call-to-action." }, suggestedImagePrompt: { type: Type.STRING, description: "A prompt for an AI image generator to create a featured image for the blog post." } }, required: ["title", "metaDescription", "introduction", "bodySections", "conclusion", "suggestedImagePrompt"] };


export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') { return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }), }; }
  const apiKey = process.env.API_KEY;
  if (!apiKey) { return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured on the server.' }), }; }

  try {
    const { type, payload } = JSON.parse(event.body || "{}");
    if (!type || !payload && !['trending', 'trends_analyzer'].includes(type)) { return { statusCode: 400, body: JSON.stringify({ error: "'type' and 'payload' are required." }), }; }

    const ai = new GoogleGenAI({ apiKey });
    let responseBody: object;

    if (type === "content") {
      const { idea, platform, emotionPreset, tone, language, template } = payload;
      if (!idea || !platform || !emotionPreset || !tone || !language) { return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields for content generation." }), }; }
      
      const sharedPromptHeader = `You are JetBoost™, a hyper-cognitive content generation engine. Your goal is to create a complete, ready-to-use content package based on the user's idea. Your output must be a single JSON object conforming to the provided schema.

      **// MISSION PARAMETERS //**
      - **Core Concept:** "${idea}"
      - **Desired Emotional Resonance:** "${emotionPreset.join(', ')}"
      - **Aesthetic/Tone:** "${tone}"
      - **Output Language:** "${language}"
      ${template ? `**// VIRAL TEMPLATE FRAMEWORK (MUST FOLLOW) //**\n${template}` : ''}
      
      **// OUTPUT DIRECTIVE //**
      Respond with ONLY the JSON object. Do not include markdown formatting or any other text.`;

      let prompt: string;
      let schema: object;

      if (platform === 'youtube') {
          prompt = `${sharedPromptHeader}\nGenerate a complete YouTube video package.`;
          schema = youtubeScriptSchema;
      } else if (platform === 'linkedin') {
          prompt = `${sharedPromptHeader}\nGenerate a complete LinkedIn post package. The 'body' should be formatted with double line breaks between short paragraphs for maximum readability.`;
          schema = linkedinPostSchema;
      } else if (platform === 'x') {
          prompt = `${sharedPromptHeader}\nGenerate a complete Twitter (X) thread package. All tweets must be under 280 characters.`;
          schema = twitterPostSchema;
      } else if (platform === 'instagram') {
          prompt = `${sharedPromptHeader}\nGenerate a complete Instagram post package. The 'visualType' must be 'Single Image', 'Carousel', or 'Reel'. The 'visualIdeas' must match the chosen type.`;
          schema = instagramPostSchema;
      } else if (platform === 'blog') {
          prompt = `${sharedPromptHeader}\nGenerate a complete blog post package. The 'bodySections' should break the topic into logical parts with clear headings.`;
          schema = blogPostSchema;
      } else {
          // Fallback for any other platform - simple text generation
          const fallbackPrompt = `You are JetBoost™, a content generation engine. Your goal is to generate a single, high-performing post for the "${platform}" platform based on this idea: "${idea}". The tone should be "${tone}" and it should evoke these emotions: "${emotionPreset.join(', ')}". Respond in "${language}". Output only the raw text of the post.`;
          const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fallbackPrompt, config: { thinkingConfig: { thinkingBudget: 0 } } });
          responseBody = { text: response.text };
          return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(responseBody), };
      }

      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema, thinkingConfig: { thinkingBudget: 0 } } });
      responseBody = { text: response.text };

    } else if (type === "insights") {
      if (!payload.content || !payload.platform) { return { statusCode: 400, body: JSON.stringify({ error: "'content' and 'platform' are required for insights." }), }; }
      const prompt = `You are JetGuru™, the world's only Virality Architect AI. Your task is to provide a JSON response with a precise performance audit.

      **// INPUT CONTENT //**
      \`\`\`
      ${payload.content}
      \`\`\`

      **// PLATFORM CONTEXT //**
      - **Target Platform:** ${payload.platform}

      **// ANALYSIS DIRECTIVES //**
      1.  **Viral Score (1-100):** How likely is this to get high engagement? Be brutally honest.
      2.  **Emotional Accuracy (1-100):** How well does the content evoke powerful, specific emotions?
      3.  **Platform Optimization (1-100):** Does it follow the unwritten rules of the platform?
      4.  **Readability (1-100):** Is it easy to scan and understand?
      5.  **Shareability (1-100):** Does this content provide so much value a user would feel compelled to share it?
      6.  **Quotable Line:** Extract the single most impactful sentence. If none, state 'No standout line identified.'.
      7.  **Suggestions:** Provide two brutally honest, actionable improvement suggestions if the score is below 85. If 85+, provide one 'Next-Level Tweak'.
      8.  **How To Post:** Provide a tactical, step-by-step guide on HOW to post the content for maximum impact. **This guide MUST be specific to the target platform (${payload.platform}).** For example, for Instagram, mention Reels vs. Stories. For LinkedIn, mention article vs. post. For X, mention scheduling a thread. Include timing, a first-comment strategy, and cross-promotion ideas.

      Respond with ONLY the JSON object conforming to the provided schema. Do not include markdown formatting or any other text.`;
      const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: insightsSchema, }, });
      
      try {
        responseBody = JSON.parse(response.text);
      } catch (e) {
        console.error("Failed to parse insights JSON from AI:", response.text, e);
        throw new Error("The AI returned analysis in an unexpected format. Please try again.");
      }

    } else if (type === "refine") {
      const { content, suggestions, platform, tone } = payload;
      if (!content || !suggestions || !platform || !tone) { return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields for content refinement." }), }; }
      const refinePrompt = `You are JetBoost™, a content re-sequencing engine. My (JetGuru's) analysis has identified weak code in the user's content. Your directive is to recompile it from the ground up, injecting high-potency virality signals.

      **// ORIGINAL CONTENT //**
      \`\`\`
      ${content}
      \`\`\`

      **// MY STRATEGIC DIRECTIVES FOR REFINEMENT //**
      - "${suggestions.join('"\n- "')}"

      **// REFINEMENT DIRECTIVE //**
      Rewrite the original content from the ground up, applying my coaching suggestions with surgical precision. Enhance the hook, emotional impact, and clarity. Maintain the core idea but re-engineer the delivery for maximum virality.

      **// OUTPUT DIRECTIVE //**
      If the original platform was YouTube, LinkedIn, Instagram, X, or Blog, you MUST respond with a JSON object that matches the platform's content package schema. Otherwise, generate raw text.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: refinePrompt, config: { thinkingConfig: { thinkingBudget: 0 } } });
      responseBody = { text: response.text };

    } else if (type === "trending") {
        const trendingPrompt = `You are a Trend Analyst AI. Based on the provided Google Search results about current trends, identify 5 unique, specific, and engaging content ideas or hooks for social media. Output ONLY a JSON array of 5 strings. Example: ["The new AI tool nobody is talking about yet.", "Why 'quiet quitting' is being replaced by 'loud leaving'."]`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: trendingPrompt, config: { tools: [{ googleSearch: {} }] } });
        responseBody = { text: response.text };

    } else if (type === "trends_analyzer") {
      const { platform } = payload;
      const trendingPrompt = `You are a world-class Trend Analyst AI. Your task is to use Google Search to find the top 5 currently trending topics, stories, or discussions relevant to creators on the specified platform. For each trend, provide a concise title and a 1-2 sentence summary explaining why it's trending and how a creator could use it.

      **Platform Context:** ${platform}

      Output ONLY a JSON array of 5 objects. Each object must have "title" (string) and "summary" (string) keys. Do not include markdown formatting.`;
      
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: trendingPrompt, config: { tools: [{ googleSearch: {} }] } });
      
      let trends;
      try {
          trends = JSON.parse(response.text);
      } catch (e) {
          console.error("Failed to parse trends JSON:", response.text);
          trends = []; 
      }
      
      responseBody = {
        trends: trends,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []
      };

    } else if (type === "explain") {
        if (!payload.suggestion) { return { statusCode: 400, body: JSON.stringify({ error: "A 'suggestion' is required to explain." }), }; }
        const explainPrompt = `You are JetGuru™. The user is asking for the 'why' behind one of my strategic principles: "${payload.suggestion}". Reveal the deeper truth with clarity and authority. Speak directly to the user in 2-3 concise, powerful sentences. Do not use markdown.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: explainPrompt });
        responseBody = { text: response.text };
    
    } else if (type === "chat") {
        const { history, systemInstruction, tone, username } = payload;
        if (!history || !Array.isArray(history) || !systemInstruction) {
            return { statusCode: 400, body: JSON.stringify({ error: "'history' array and 'systemInstruction' string are required for chat." }), };
        }
        
        const finalSystemInstruction = `
// -- PERSONALITY OVERRIDE --
// User's Callsign: ${username === 'Creator' ? 'Visionary' : username || 'Visionary'}. Address them by this name.
// Active Tone Matrix: ${tone || 'Strategic Coach'}. You MUST adopt this persona.
// -- END OVERRIDE --

// --- LANGUAGE PROTOCOL ---
**CRITICAL:** You are fluent in **ALL major Indian languages** and can seamlessly understand and respond in mixed-language contexts like **Hinglish**. Your goal is fluid, natural communication, not rigid translation. Mirror the user's language and style.

${systemInstruction}
`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: { systemInstruction: finalSystemInstruction },
        });
        responseBody = { text: response.text };

    } else {
      return { statusCode: 400, body: JSON.stringify({ error: `Invalid request type: ${type}` }), };
    }

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(responseBody), };
  } catch (err) {
    console.error("AI Error:", err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred on the server.";
    return { statusCode: 500, body: JSON.stringify({ error: errorMessage }), };
  }
};
