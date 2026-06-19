// src/schemas/ai.schema.js

const generatePostSchema = {
  description: 'Generate blog post content using AI (Gemini)',
  tags: ['AI'],
  body: {
    type: 'object',
    properties: {
      title: { 
        type: 'string', 
        minLength: 3, 
        maxLength: 300,
        description: 'Post title for AI to generate content'
      },
      category: { 
        type: 'string', 
        nullable: true,
        default: 'Technology'
      }
    },
    required: ['title'],
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            suggestedTitle: { type: 'string' },
            content: { type: 'string' },
            wordCount: { type: 'integer' }
          }
        }
      }
    },
    400: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  }
};

module.exports = {
  generatePostSchema
};