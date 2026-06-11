// src/repositories/comment.repository.js
const { Comment, User } = require('../models/index');

const createComment = async ({ content, userId, articleId, parentId = null }) => {
  console.log('Creating comment with:', { content, userId, articleId, parentId });
  console.log('Comment model:', Comment); // debug
  return await Comment.create({ content, userId, articleId, parentId });
};

const getCommentsByArticle = async (articleId) => {
  return await Comment.findAll({
    where: { articleId, parentId: null },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) throw new Error('Comment not found');
  if (comment.userId !== userId) throw new Error('Not authorized');
  await comment.destroy();
  return true;
};

module.exports = { createComment, getCommentsByArticle, deleteComment };