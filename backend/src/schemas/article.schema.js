// src/schemas/article.schema.js

const articleSchemas = {
 createArticle: {
  description: 'Create a new blog article',
  tags: ['Articles'],
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 300 },
      content: { type: 'string', minLength: 10 },
      category: { type: 'string', nullable: true },
      published: { type: 'boolean', default: false },
      featuredImage: { 
        type: 'string',
        nullable: true 
      }   // ← Yeh line important hai
    },
    required: ['title', 'content'],
    additionalProperties: false
  },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          slug: { type: 'string' },
          content: { type: 'string' },
          category: { type: ['string', 'null'] },
          featuredImage: { type: ['string', 'null'] },
          authorId: { type: 'string', format: 'uuid' },
          likesCount: { type: 'integer' },
          views: { type: 'integer' },
          published: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },

  updateArticle: {
    description: 'Update an existing article',
    tags: ['Articles'],
    consumes: ['multipart/form-data'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' }
      },
      required: ['id']
    },
    body: {
      type: 'object',
      properties: {
        title: { type: 'string', minLength: 3, maxLength: 300 },
        content: { type: 'string', minLength: 10 },
        category: { type: 'string', nullable: true },
        published: { type: 'boolean' }
      },
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          slug: { type: 'string' },
          featuredImage: { type: ['string', 'null'] }
        }
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      },
      403: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },

  getAllArticles: {
    description: 'Get all published articles with pagination',
    tags: ['Articles'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
        category: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          count: { type: 'integer' },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                title: { type: 'string' },
                slug: { type: 'string' },
                category: { type: ['string', 'null'] },
                featuredImage: { type: ['string', 'null'] },
                likesCount: { type: 'integer' },
                views: { type: 'integer' },
                published: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                author: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  getArticleBySlug: {
    description: 'Get single article by slug',
    tags: ['Articles'],
    params: {
      type: 'object',
      properties: {
        slug: { type: 'string' }
      },
      required: ['slug']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          slug: { type: 'string' },
          content: { type: 'string' },
          category: { type: ['string', 'null'] },
          featuredImage: { type: ['string', 'null'] },
          likesCount: { type: 'integer' },
          views: { type: 'integer' },
          published: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          author: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          }
        }
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },

  getMyArticles: {
    description: 'Get logged in user\'s all articles',
    tags: ['Articles'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          count: { type: 'integer' },
          rows: { type: 'array', items: { type: 'object' } }
        }
      }
    }
  },

  deleteArticle: {
    description: 'Delete an article',
    tags: ['Articles'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' }
      },
      required: ['id']
    },
    response: {
      204: { type: 'null' },
      403: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
};

module.exports = articleSchemas;