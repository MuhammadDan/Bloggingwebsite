const articleRepository = require('../repositories/article.repository');

class ArticleService {
  async createArticle(data, authorId) {
    return await articleRepository.create(data, authorId);
  }

  async getPublishedArticles(query) {
    return await articleRepository.findAllPublished(query);
  }

  async getArticleBySlug(slug) {
    const article = await articleRepository.findBySlug(slug);
    if (article && article.published) {
      await articleRepository.incrementViews(slug);
    }
    return article;
  }

  async getMyArticles(authorId, query) {
    return await articleRepository.findMyArticles(authorId, query);
  }

  async updateArticle(id, data, authorId) {
     console.log('SERVICE RECEIVED:', JSON.stringify(data));
    const article = await articleRepository.findById(id);
    if (!article || article.authorId !== authorId) {
      throw new Error('Article not found or you are not authorized');
    }
    return await articleRepository.update(id, data);
  }

  async deleteArticle(id, authorId) {
    const article = await articleRepository.findById(id);
    if (!article || article.authorId !== authorId) {
      throw new Error('Article not found or you are not authorized');
    }
    return await articleRepository.delete(id);
  }
}

module.exports = new ArticleService();