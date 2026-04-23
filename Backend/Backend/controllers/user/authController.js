import User from '../../models/User.js';
import BaseController from '../BaseController.js';
import { createAuditLog } from '../../utils/auditLog.js';

class AuthController extends BaseController {

  // --- 1. LOGIN ---
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Email or password required" });

      const user = await User.findOne({ email, deletedAt: null }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return this.handleError(next, 'wrong email or password', 400);
      }

      const token = this.generateToken(user._id, user.role);

      // ✅ FIXED AUDIT LOG
      await createAuditLog({
        performedBy: user._id,
        performerRole: user.role,
        action: 'auth_login',
        category: 'auth',
        description: `${user.fullName} has logged in`,
        req,
      });

      return res.status(200).json({
        error: false,
        message: 'Login successful',
        data: { user, token }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };


  // --- 2. CREATE USER ---
  createUser = async (req, res, next) => {
    try {
      const { email, password, fullName, role } = req.body;

      const existingUser = await User.findOne({ email, deletedAt: null });

      if (existingUser)
        return this.handleError(next, 'already exist email', 400);

      const user = await User.create({
        email,
        password,
        fullName,
        role,
        createdBy: req.user._id
      });

      // ✅ FIXED AUDIT LOG
      await createAuditLog({
        performedBy: req.user._id,
        performerRole: req.user.role,
        action: 'user_create',
        category: 'user_management',
        description: `new user ${fullName} has been created`,
        req,
      });

      return res.status(201).json({
        error: false,
        message: 'User created successfully!',
        data: user
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };


  // --- 3. GET ALL USERS ---
  getAllUsers = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const users = await User.find({ deletedAt: null })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments({ deletedAt: null });

      return res.status(200).json({
        error: false,
        data: users,
        total
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };


  // --- 4. DELETE USER ---
  deleteUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user)
        return this.handleError(next, 'User not found', 404);

      user.deletedAt = new Date();
      await user.save();

      // ✅ FIXED AUDIT LOG
      await createAuditLog({
        performedBy: req.user._id,
        performerRole: req.user.role,
        action: 'user_delete',
        category: 'user_management',
        description: `${user.fullName} has been deleted`,
        req,
      });

      return res.status(200).json({
        error: false,
        message: 'User delete successfully!'
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };


  // --- 5. FORGOT PASSWORD ---
  forgotPassword = async (req, res, next) => {
    try {
      // console.log("🔥 req.body =", req.body);
      // console.log("🔥 Content-Type =", req.headers['content-type']);
      const { email } = req.body;

      const user = await User.findOne({ email, deletedAt: null });

      if (!user)
        return this.handleError(next, 'Email not found', 404);

      const resetToken = this.generateToken(user._id, 'reset_password', '15m');

      return res.status(200).json({
        message: 'Reset link email kar dia gaya hai'
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

}

export default new AuthController();