// src/controllers/comment.controller.js
const commentRepo = require('../repositories/comment.repository');

const addComment = async (request, reply) => {
  try {
    if (!request.user || !request.user.id) {
      return reply.code(401).send({ error: 'Login karein pehle' });
    }

    console.log('Comment body:', request.body); // ← debug ke liye

    const content = request.body?.content;
    const articleId = request.body?.articleId;
    const parentId = request.body?.parentId || null;

    if (!content || !content.trim()) {
      return reply.code(400).send({ error: 'Content zaroori hai' });
    }
    if (!articleId) {
      return reply.code(400).send({ error: 'articleId zaroori hai' });
    }

    const comment = await commentRepo.createComment({
      content: content.trim(),
      articleId,
      userId: request.user.id,
      parentId,
    });

    // User info ke saath wapas bhejo
    const { User } = require('../models');
    const user = await User.findByPk(request.user.id, {
      attributes: ['id', 'name', 'email'],
    });

    reply.code(201).send({ ...comment.toJSON(), user });
  } catch (error) {
    console.error('Add Comment Error:', error);
    reply.code(400).send({ error: error.message });
  }
};

const getComments = async (request, reply) => {
  try {
    const { articleId } = request.params;
    const comments = await commentRepo.getCommentsByArticle(articleId);
    reply.send(comments);
  } catch (error) {
    console.error('Get Comments Error:', error);
    reply.code(400).send({ error: error.message });
  }
};

const deleteComment = async (request, reply) => {
  try {
    await commentRepo.deleteComment(request.params.id, request.user.id);
    reply.code(204).send();
  } catch (error) {
    if (error.message.includes('authorized') || error.message.includes('not found')) {
      return reply.code(403).send({ error: error.message });
    }
    reply.code(400).send({ error: error.message });
  }
};

module.exports = { addComment, getComments, deleteComment };