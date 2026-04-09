import User from '../../models/User.js';
import BaseController from '../BaseController.js';
import { createAuditLog } from '../../utils/auditLog.js';

class AuthController extends BaseController {
  
  // --- 1. LOGIN ---
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Khali fields check karna
      if (!email || !password) return res.status(400).json({ message: "Email aur Password lazmi hain!" });

      // User dhoondna
      const user = await User.findOne({ email, deletedAt: null }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return this.handleError(next, 'Ghalat email ya password', 400);
      }

      // Token dena (Chabi)
      const token = this.generateToken(user._id, user.role);

      // Audit Log (History mein save karna)
      await createAuditLog({ action: 'auth_login', description: `${user.fullName} ne login kiya`, req, performedBy: user._id });

      return res.status(200).json({ error: false, message: 'Login successful', data: { user, token } });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // --- 2. CREATE USER (Admin Only) ---
  createUser = async (req, res, next) => {
    try {
      const { email, password, fullName, role } = req.body;

      const existingUser = await User.findOne({ email, deletedAt: null });
      if (existingUser) return this.handleError(next, 'Ye email pehle se majood hai', 400);

      const user = await User.create({ email, password, fullName, role, createdBy: req.user._id });

      await createAuditLog({ action: 'user_create', description: `Naya user ${fullName} banaya gaya`, req });

      return res.status(201).json({ error: false, message: 'User ban gaya!', data: user });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // --- 3. GET ALL USERS (List dikhana) ---
  getAllUsers = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await User.find({ deletedAt: null })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments({ deletedAt: null });

      return res.status(200).json({ error: false, data: users, total });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // --- 4. DELETE USER (Soft Delete) ---
  deleteUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return this.handleError(next, 'User nahi mila', 404);

      user.deletedAt = new Date(); // Asal mein delete nahi kiya, bas stamp laga di
      await user.save();

      await createAuditLog({ action: 'user_delete', description: `${user.fullName} ko delete kiya gaya`, req });

      return res.status(200).json({ error: false, message: 'User delete ho gaya' });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // --- 5. FORGOT PASSWORD ---
  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email, deletedAt: null });
      if (!user) return this.handleError(next, 'Email nahi mila', 404);

      const resetToken = this.generateToken(user._id, 'reset_password', '15m');
      // Yahan email bhejne ka logic hota hai (UniversalMail)
      
      return res.status(200).json({ message: 'Reset link email kar dia gaya hai' });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
}

export default new AuthController();