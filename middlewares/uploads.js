import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

// Farmer image upload
export const imageUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'castorcareghana/farmers', 
    },
  }),
});

// User avatar upload
export const userAvatarUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'castorcareghana/users',
    },
  }),
});

