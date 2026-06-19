// BACKEND/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, reply, done) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    done();
  } catch (err) {
    return reply.code(401).send({ message: 'Invalid or expired token' });
  }
};

const isAdmin = (req, reply, done) => {
  if (req.user?.role !== 'admin') {
    return reply.code(403).send({ message: 'Admin access required' });
  }
  done();
};

module.exports = { verifyToken, isAdmin };