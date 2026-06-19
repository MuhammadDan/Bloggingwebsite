const nodemailer = require('nodemailer');
require('dotenv').config();

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // optional: tls settings agar chahiye
    tls: {
      rejectUnauthorized: false // agar self-signed cert issue ho
    }
  });
};

// Export transporter instance (ek baar create hoga)
const transporter = createEmailTransporter();

// Test connection on load (development mein helpful)
if (process.env.NODE_ENV !== 'production') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email transporter ready ✅');
    }
  });
}

module.exports = transporter;