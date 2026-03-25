const { User } = require('../models');

class UserRepository {
  // Find user by email
  static async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  // Create new user
  static async create(userData) {
    return User.create(userData);
  }

  // Optional: future mein aur methods add kar sakte ho
  // static async findById(id) { ... }
  // static async update(id, data) { ... }
  // static async delete(id) { ... }
}

module.exports = UserRepository;