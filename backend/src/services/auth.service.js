// src/services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const UserRepository = require('../repositories/user.repository');
require('dotenv').config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

async function sendOTP(email, otp) {
  try {
    await transporter.sendMail({
      from: `"Blog App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Signup',
      text: `Your OTP is: ${otp}\nValid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Welcome to Blog App!</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 10px; color: #4CAF50;">${otp}</h1>
          <p>Valid for 10 minutes. Do not share.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('OTP send failed:', err);
    throw new Error('Failed to send OTP');
  }
}

async function sendWelcomeEmail(email, name) {
  try {
    await transporter.sendMail({
      from: `"Blog App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Blog App!',
      text: `Hi ${name}, your account is verified! Start blogging.`,
      html: `<h2>Welcome ${name}!</h2><p>Account verified. Enjoy!</p>`,
    });
  } catch (err) {
    console.error('Welcome email failed:', err);
  }
}

// Register (sab users ke liye same flow – OTP bhejega)
async function register({ name, email, password, imageUrl }) {
  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await UserRepository.create({
    name,
    email,
    password: hashedPassword,
    imageUrl: imageUrl || null,
    role: 'user',           // Default sabka user – admin manually DB se set karenge
    isVerified: false
  });

  const otp = crypto.randomInt(100000, 999999).toString();
  await sendOTP(email, otp);

  const tempToken = jwt.sign(
    { userId: user.id, purpose: 'otp_verify' },
    JWT_SECRET,
    { expiresIn: '10m' }
  );

  return {
    message: 'OTP sent to your email. Verify within 10 minutes.',
    tempToken,
    email: user.email
  };
}

// Verify OTP (permanent token + role wapas bhejega)
async function verifyOtp({ tempToken, otp, email }) {
  let decoded;
  try {
    decoded = jwt.verify(tempToken, JWT_SECRET);
    if (decoded.purpose !== 'otp_verify') throw new Error('Invalid token');
  } catch (err) {
    throw new Error('Invalid or expired temporary token');
  }

  const user = await UserRepository.findByEmail(email);
  if (!user || user.id !== decoded.userId) {
    throw new Error('Invalid request');
  }

  if (user.isVerified) throw new Error('Account already verified');

  user.isVerified = true;
  await user.save();

  await sendWelcomeEmail(email, user.name);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    message: 'Account verified successfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,          // yeh frontend ko bata dega admin hai ya user
      imageUrl: user.imageUrl || null
    }
  };
}
async function login({ email, password }) {
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    throw new Error('Please verify your email first');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl || null
    }
  };
}

module.exports = {
  register,
  verifyOtp,
  login
};