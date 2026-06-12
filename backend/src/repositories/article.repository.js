// src/repositories/article.repositories.js
const { Article, User } = require("../models");

class ArticleRepository {
  async create(data, authorId) {
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return await Article.create({ ...data, slug, authorId });
  }

  async findBySlug(slug) {
    return await Article.findOne({
      where: { slug },
      include: [
        { model: User, as: "author", attributes: ["id", "name", "email"] },
      ],
    });
  }

  async findAllPublished({ page = 1, limit = 10, category } = {}) {
    const offset = (page - 1) * limit;
    const where = { published: true };
    if (category) where.category = category;

    return await Article.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "author", attributes: ["name"] }],
    });
  }

  async findMyArticles(authorId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    return await Article.findAndCountAll({
      where: { authorId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id) {
    return await Article.findByPk(id);
  }

  async update(id, data) {
    await Article.update(data, { where: { id } });
    return await this.findById(id);
  }

  async delete(id) {
    return await Article.destroy({ where: { id } });
  }

  async incrementViews(slug) {
    return await Article.increment("views", {
      where: { slug, published: true },
    });
  }

  // ✅ Like toggle
  async incrementLikes(id) {
    await Article.increment("likesCount", { where: { id } });
    return await this.findById(id);
  }

  async decrementLikes(id) {
    const article = await this.findById(id);
    if (article && article.likesCount > 0) {
      await Article.decrement("likesCount", { where: { id } });
    }
    return await this.findById(id);
  }
}

module.exports = new ArticleRepository();
