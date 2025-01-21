import express from 'express';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {signup,signin,google } from '../controllers/auth.controller.js';
import dotenv from 'dotenv';
dotenv.config();
const router=express.Router();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Replace with your API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your API secret
  });
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'DevGram', // Ensure the folder is set correctly
      allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file formats
    },
  });
  const upload = multer({ storage });
 
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
export default router;