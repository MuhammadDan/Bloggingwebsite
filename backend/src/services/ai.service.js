// src/service/ai.service.js

// src/services/ai.service.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateBlogPost = async (title, category = "Technology") => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.75,
      max_tokens: 1600,
      messages: [
        {
          role: "system",
          content: `You are a professional human blog writer. 
Write in a natural, conversational, and engaging style like a real person.
Rules:
- Use proper markdown headings (# for main, ## for subheadings) naturally.
- Do NOT use **bold** unnecessarily.
- Do NOT put ** around words like **Write**, **Introduction** etc.
- Keep the tone friendly and readable.
- Use bullet points only when needed.`
        },
        {
          role: "user",
          content: `Write a complete blog post.

Title: ${title}
Category: ${category}

Write it like a real experienced blogger. Make it interesting, smooth, and natural to read.`
        }
      ],
    });

    let content = completion.choices[0].message.content;

    // Extra safety: unnecessary ** bold hatane ke liye
    content = content.replace(/\*\*(.*?)\*\*/g, '$1');

    return {
      suggestedTitle: title,
      content: content,
      wordCount: content.split(/\s+/).length
    };

  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to generate content with AI");
  }
};

module.exports = {
  generateBlogPost
};

// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const generateBlogPost = async (title, category = "Technology") => {
//   try {
//     // ✅ Yeh latest working model hai
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-2.0-flash"   // ya "gemini-1.5-flash-latest"
//     });

//     const prompt = `
// You are a professional, engaging blog writer. 
// Write a complete, well-structured blog post in markdown.

// Title: ${title}
// Category: ${category}

// - Use proper headings (##, ###)
// - Add bullet points and bold text where needed
// - Keep natural and interesting tone
// - Write 600-900 words
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const content = response.text();

//     return {
//       suggestedTitle: title,
//       content: content,
//       wordCount: content.split(/\s+/).length
//     };

//   } catch (error) {
//     console.error("AI Service Error:", error);
//     throw new Error("Failed to generate content with AI");
//   }
// };

// module.exports = {
//   generateBlogPost
// };

//---------------------------

// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const generateBlogPost = async (title, category = "Technology") => {
//   try {
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-1.5-flash"   // fast aur sasta, agar better chahiye to "gemini-1.5-pro" use karo
//     });

//     const prompt = `
// You are a professional, engaging blog writer. 
// Write a complete, well-structured, SEO-friendly blog post in markdown format.

// Title: ${title}
// Category: ${category}

// Instructions:
// - Write 800-1200 words
// - Use proper markdown (## headings, bullet points, bold, etc.)
// - Engaging introduction and strong conclusion
// - Add practical examples or tips
// - Make it natural and human-like
// - Use conversational tone
// `;

//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const content = response.text();

//     return {
//       suggestedTitle: title,
//       content: content,
//       wordCount: content.split(/\s+/).length
//     };
//   } catch (error) {
//     console.error("AI Service Error:", error);
//     throw new Error("Failed to generate content with AI");
//   }
// };

// module.exports = {
//   generateBlogPost
// };