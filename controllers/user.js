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

    const user = await UserModel.create({
      ...value,
      password: hashedPassword,
    });

         const emailContent = `
                <p>Hi ${user.firstName}<p>
                            <p>Account created successfully on ${new Date().toDateString()} as a ${user.role}.</p>
                            <p>LogIn to interract with us. Click the link below.</p>
                            <a style="font-size: 14px;" href="${process.env.CLIENT_URL}/login">${process.env.CLIENT_URL}/login</a>`
                // Send professional a confirmation email
                await mailTransporter.sendMail({
                    from: `Castor Care Ghana <${process.env.EMAIL_USER}`,
                    to: value.email,
                    subject: "User Registration",
                    replyTo: 'info@castorcareghana.com',
                    html: registerEmailTemplate(emailContent)
                });
    res.status(201).json({ message: "Registered user!", user });
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
      { id: user.id },
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
    const user = await UserModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// ✅ Get All Users (admin only ideally)
export const getAllProfile = async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// ✅ Logout (client should delete token)
export const logOutUser = (req, res, next) => {
  res.json({ message: "User logged out" });
};

// ✅ Update Profile
export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateUserValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    if (req.file) value.avatar = req.file.path;

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.auth.id,
      value,
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user: updatedUser });
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
