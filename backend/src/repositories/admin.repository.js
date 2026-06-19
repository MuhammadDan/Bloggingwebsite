const { Article, User } = require('../models');
const { Op } = require('sequelize');

class AdminRepository {
  async getDashboardStats() {
    const [totalPosts, publishedPosts, totalUsers, totalViews, totalLikes] = await Promise.all([
      Article.count(),
      Article.count({ where: { published: true } }),
      User.count(),
      Article.sum('views'),
      Article.sum('likesCount'),
    ]);

    return {
      totalPosts: totalPosts || 0,
      publishedPosts: publishedPosts || 0,
      totalUsers: totalUsers || 0,
      totalViews: totalViews || 0,
      totalLikes: totalLikes || 0,
    };
  }

  async getAllArticles() {
    const articles = await Article.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email', 'imageUrl', 'role']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Tag insights — count posts per tag
    const tagStatsRaw = await Article.findAll({
      attributes: ['tags'],
      where: { tags: { [Op.ne]: null } }
    });

    const tagCount = {};
    tagStatsRaw.forEach(article => {
      let tags = article.tags;
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags);
        } catch {
          tags = [];
        }
      }
      if (Array.isArray(tags)) {
        tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });

    const tagStats = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Top posts — highest views first
    const topPostsRaw = await Article.findAll({
      attributes: ['id', 'title', 'slug', 'views', 'likesCount'],
      order: [['views', 'DESC']],
      limit: 5,
    });

    const topPosts = topPostsRaw.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      views: p.views,
      likes: p.likesCount,
    }));

    return { articles, tagStats, topPosts };
  }

  async deleteArticle(id) {
    const article = await Article.findByPk(id);
    if (!article) throw new Error('Article not found');
    await article.destroy();
    return true;
  }
}

module.exports = new AdminRepository();