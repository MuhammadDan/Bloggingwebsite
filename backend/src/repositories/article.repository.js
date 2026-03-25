const { Article } = require('../models');

class ArticleRepository {
  static async findAllPublished() {
    return Article.findAll({ 
      where: { published: true },
      include: [{ model: require('../models').User, as: 'author', attributes: ['name', 'imageUrl'] }]
    });
  }

  static async create(articleData) {
    return Article.create(articleData);
  }

  // aur baki methods...
}

module.exports = ArticleRepository;