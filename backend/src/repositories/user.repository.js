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

 static async findById(id) {
    return User.findByPk(id);
  }

  // ✅ Added
  static async updatePlan(id, plan, credits) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    user.plan = plan;
    user.aiCredits = credits;
    await user.save();
    return user;
  }
}

module.exports = UserRepository;