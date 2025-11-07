import { UserModel } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  loginUserValidator,
  registerUserValidator,
  updateUserValidator,
  resetPasswordValidator,
} from "../validators/user.js";
import { mailTransporter } from "../utils/mail.js";
import { FarmerModel } from "../models/farmer.js";
import { getChannel } from "../utils/rabbitmq.js";
import { registerEmailTemplate } from "../utils/emailTemplate.js";

// ✅ Register User
// ✅ Register User
export const registerUser = async (req, res, next) => {
  try {
    const { error, value } = registerUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }

    const userExists = await UserModel.findOne({ email: value.email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(value.password, 10);

    // ✅ Detect if request is from an authenticated admin
    let createdBy = null;
    if (req.auth && req.auth.role === "admin") {
      createdBy = req.auth.id;
    }

    const user = await UserModel.create({
      ...value,
      password: hashedPassword,
      createdBy, // null if self-registration, admin ID if admin-created

    });

    const emailContent = `
      <p>Hi ${user.name}</p>
      <p>Your account was successfully created on ${new Date().toDateString()} as a ${user.role}.</p>
      <p>Login to interact with us:</p>
      <a style="font-size: 14px;" href="${process.env.CLIENT_URL}/login">${process.env.CLIENT_URL}/login</a>`;

    // Send email via queue
    const channel = getChannel();
    await channel.assertQueue("emailQueue");
    channel.sendToQueue(
      "emailQueue",
      Buffer.from(
        JSON.stringify({
          to: value.email,
          subject: "User Registration",
          html: registerEmailTemplate(emailContent),
        })
      )
    );

    res.status(201).json({
      message: createdBy
        ? "User registered by admin successfully!"
        : "Registered successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};


// ✅ Login User
export const logInUser = async (req, res, next) => {
  try {
    const { error, value } = loginUserValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const user = await UserModel.findOne({ email: value.email });
    if (!user) return res.status(404).json({ message: "User does not exist!" });

    const correctPassword = bcrypt.compareSync(value.password, user.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "24h" }
    );

    res.json({
      message: "User logged in",
      accessToken: token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Profile (current user or by ID)
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.auth.id;
    const user = await UserModel.findById(userId).select("-password").populate("createdBy", "name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// ✅ Get All Users (admin only ideally)
export const getAllProfile = async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password").populate("createdBy", "name email");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// ✅ Logout (client should delete token)
export const logOutUser = (req, res, next) => {
  res.json({ message: "User logged out" });
};

// ✅ Update Profile (self or by ID)
export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateUserValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    // if avatar uploaded
    if (req.file) value.avatar = req.file.path;

    // ✅ Determine which user to update
    const userId = req.params.id || req.auth.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      value,
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    return res.json({
      message: "Profile updated",
      user: updatedUser,
    });

  } catch (error) {
    next(error);
  }
};


// ✅ Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await mailTransporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset link sent", user });
  } catch (error) {
    next(error);
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    const user = await UserModel.findById(decodedToken.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { error, value } = resetPasswordValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const hashedPassword = bcrypt.hashSync(value.password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully", user });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Farmers belonging to a User
export const getUserFarmers = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}", limit = 10, skip = 0 } = req.query;

    const farmers = await FarmerModel.find({
      ...JSON.parse(filter),
      user: req.auth.id,
    })
      .sort(JSON.parse(sort))
      .limit(Number(limit))
      .skip(Number(skip));

    res.json(farmers);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.deleted = true;
    await user.save();
    res.json({ message: "User deleted", user });
  } catch (error) {
    next(error);
  }
}
export const restoreUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.deleted = false;
    await user.save();
    res.json({ message: "User restored", user });
  } catch (error) {
    next(error);
  }
};
