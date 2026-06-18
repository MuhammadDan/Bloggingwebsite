// src/controllers/userdashboard.controller.js
const { Article, Comment } = require('../models');

const getUserDashboard = async (req, reply) => {
  const userId = req.user.id;

  try {
    const totalPosts = await Article.count({ where: { authorId: userId } });
    const publishedPosts = await Article.count({ 
      where: { authorId: userId, published: true } 
    });

    const totalViews = await Article.sum('views', { where: { authorId: userId } }) || 0;
    const totalLikes = await Article.sum('likesCount', { where: { authorId: userId } }) || 0;

    const totalComments = await Comment.count({ where: { userId } });

    // Tag Insights
    const articlesWithTags = await Article.findAll({
      where: { authorId: userId },
      attributes: ['tags'],
      raw: true
    });

    const tagCounts = {};
    articlesWithTags.forEach(article => {
      const tags = Array.isArray(article.tags) ? article.tags : [];
      tags.forEach(tag => {
        if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const totalTagged = Object.values(tagCounts).reduce((a, b) => a + b, 0) || 1;
    const tagInsights = Object.entries(tagCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalTagged) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Top Posts
    const topPosts = await Article.findAll({
      where: { authorId: userId },
      order: [['views', 'DESC'], ['likesCount', 'DESC']],
      limit: 3,
      attributes: ['id', 'title', 'slug', 'views', 'likesCount']
    });

    reply.send({
      success: true,
      data: {
        totalPosts,
        publishedPosts,
        totalViews,
        totalLikes,
        totalComments,
        tagInsights,
        topPosts: topPosts.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          views: p.views || 0,
          likes: p.likesCount || 0
        }))
      }
    });
  } catch (error) {
    console.error("User Dashboard Error:", error);
    reply.code(500).send({ success: false, message: "Could not fetch dashboard data" });
  }
};

module.exports = { getUserDashboard };