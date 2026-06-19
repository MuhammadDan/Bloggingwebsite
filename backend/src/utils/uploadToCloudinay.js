// src/utils/uploadToCloudinary.js
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (file, folder = 'blog-featured') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 630, crop: 'fill' },
        { quality: 'auto:good' }
      ]
    });

    // Delete temporary file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

module.exports = { uploadToCloudinary };