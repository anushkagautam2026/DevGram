import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
// export const updateProfilePicture = async (req, res) => {
//   try {
//     const { userId } = req.params; // Get userId from the route parameter
//     const { profilePicture } = req.body; // Cloudinary URL from the request body

//     // Check if required data is present
//     if (!userId) {
//       return res.status(400).json({ success: false, message: 'User ID is required' });
//     }

//     if (!profilePicture) {
//       return res.status(400).json({ success: false, message: 'Profile picture URL is required' });
//     }

//     // Update the profile picture in the database
//     const updatedUser = await User.findByIdAndUpdate(
//       userId, // User ID from the route parameter
//       { profilePicture }, // Update only the profilePicture field
//       { new: true } // Return the updated user document
//     );

//     // Check if the user was found and updated
//     if (!updatedUser) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Respond with the updated user details (excluding password for security)
//     const { password, ...rest } = updatedUser._doc;
//     res.status(200).json({ success: true, updatedUser: rest });
//   } catch (error) {
//     console.error('Error updating profile picture:', error);
//     res.status(500).json({ success: false, message: 'Error updating profile picture' });
//   }
// };
