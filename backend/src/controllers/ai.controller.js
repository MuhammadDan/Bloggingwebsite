// src/controllers/ai.controller.js

const { generateBlogPost } = require('../services/ai.service');

const generatePost = async (req, reply) => {
  try {
    const { title, category } = req.body;

    const result = await generateBlogPost(title, category || 'Technology');

    reply.send({
      success: true,
      message: "Blog generated successfully with AI",
      data: result
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    
    reply.code(500).send({
      success: false,
      message: error.message || "Failed to generate content with AI"
    });
  }
};

module.exports = {
  generatePost
};