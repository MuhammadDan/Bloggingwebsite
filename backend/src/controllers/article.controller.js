// src/controllers/article.controller.js
const articleService = require('../services/article.service');
const { uploadToCloudinary } = require('../utils/uploadToCloudinay');
const articleRepo = require('../repositories/article.repository');

const uploadImage = async (request, reply) => {
  try {
    if (!request.file) return reply.code(400).send({ error: 'No image provided' });
    const result = await uploadToCloudinary(request.file, 'blog-featured');
    reply.send({ imageUrl: result.url });
  } catch (error) {
    reply.code(500).send({ error: 'Image upload failed' });
  }
};

const createArticle = async (request, reply) => {
  try {
    if (!request.user || !request.user.id) {
      return reply.code(401).send({ error: 'Authentication failed. Please login again.' });
    }

    const rawTags = request.body.tags;
    let tags = [];

    if (Array.isArray(rawTags)) {
      tags = rawTags.filter(Boolean);
    } else if (typeof rawTags === 'string' && rawTags.trim()) {
      tags = [rawTags.trim()];
    }

    // ✅ Category automatically tag bane
    const category = request.body.category || null;
    if (category && !tags.includes(category)) {
      tags = [category, ...tags];
    }

    const articleData = {
      title: request.body.title,
      content: request.body.content,
      category,
      published: request.body.published || false,
      featuredImage: request.body.featuredImage || null,
      tags,
    };

    const article = await articleService.createArticle(articleData, request.user.id);
    reply.code(201).send(article);
  } catch (error) {
    reply.code(400).send({ error: error.message || 'Something went wrong' });
  }
};

const getPublishedArticles = async (request, reply) => {
  try {
    const query = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 10,
      category: request.query.category
    };
    const result = await articleService.getPublishedArticles(query);
    reply.send(result);
  } catch (error) {
    reply.code(400).send({ error: error.message });
  }
};

const getArticleBySlug = async (request, reply) => {
  try {
    const article = await articleService.getArticleBySlug(request.params.slug);
    if (!article) return reply.code(404).send({ error: 'Article not found' });

    // ✅ Views increment
    await articleRepo.incrementViews(request.params.slug);
    article.views = (article.views || 0) + 1;

    reply.send(article);
  } catch (error) {
    reply.code(400).send({ error: error.message });
  }
};

// ✅ ID se fetch — edit page ke liye
const getArticleById = async (request, reply) => {
  try {
    const article = await articleRepo.findById(request.params.id);
    if (!article) return reply.code(404).send({ error: 'Article not found' });
 
    // Sirf apna article edit kar sake
    if (article.authorId !== request.user.id) {
      return reply.code(403).send({ error: 'Not authorized' });
    }
 
    reply.send(article);
  } catch (error) {
    reply.code(400).send({ error: error.message });
  }
};

const getMyArticles = async (request, reply) => {
  try {
    const query = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 10,
    };
    const result = await articleService.getMyArticles(request.user.id, query);
    reply.send(result);
  } catch (error) {
    reply.code(400).send({ error: error.message });
  }
};

const updateArticle = async (request, reply) => {
  try {
    const rawTags = request.body.tags;
    let tags = undefined;
    if (rawTags !== undefined) {
      if (Array.isArray(rawTags)) tags = rawTags.filter(Boolean);
      else if (typeof rawTags === 'string' && rawTags.trim()) tags = [rawTags.trim()];
      else tags = [];
    }

    const payload = {
      title: request.body.title,
      content: request.body.content,
      category: request.body.category || null,
      published: request.body.published === 'true' || request.body.published === true,
      ...(tags !== undefined && { tags }),
    };
 console.log('PAYLOAD BEING SENT:', JSON.stringify(payload));
    if (request.file && request.file.buffer) {
      const uploadResult = await uploadToCloudinary(request.file, 'blog-featured');
      payload.featuredImage = uploadResult.url;
    } else if (request.body.featuredImage) {
      payload.featuredImage = request.body.featuredImage;
    }

    const article = await articleService.updateArticle(
      request.params.id,
      payload,
      request.user.id
    );
    reply.send(article);
  } catch (error) {
    if (error.message.includes('authorized') || error.message.includes('not found')) {
      return reply.code(403).send({ error: error.message });
    }
    reply.code(400).send({ error: error.message });
  }
};

const deleteArticle = async (request, reply) => {
  try {
    await articleService.deleteArticle(request.params.id, request.user.id);
    reply.code(204).send();
  } catch (error) {
    if (error.message.includes('authorized') || error.message.includes('not found')) {
      return reply.code(403).send({ error: error.message });
    }
    reply.code(400).send({ error: error.message });
  }
};

// ✅ Like toggle
const toggleLike = async (request, reply) => {
  try {
    const { id } = request.params;
    const action = request.body.action; // "like" ya "unlike"

    let article;
    if (action === 'like') {
      article = await articleRepo.incrementLikes(id);
    } else {
      article = await articleRepo.decrementLikes(id);
    }

    if (!article) return reply.code(404).send({ error: 'Article not found' });

    reply.send({
      likesCount: article.likesCount,
      liked: action === 'like'
    });
  } catch (error) {
    reply.code(400).send({ error: error.message });
  }
};

module.exports = {
  uploadImage,
  createArticle,
  getPublishedArticles,
  getArticleBySlug,
  getArticleById,
  getMyArticles,
  updateArticle,
  deleteArticle,
  toggleLike,
};