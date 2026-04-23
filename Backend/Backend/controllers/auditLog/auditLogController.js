import AuditLog from '../../models/AuditLog.js';
import BaseController from '../BaseController.js';
import User from '../../models/User.js';

class auditLogController extends BaseController {

  constructor() {
    super();
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
  }

  async getAll(req, res, next) {
    try {
      const page             = req.query.page             || 1;
      const limit            = req.query.limit            || 20;
      const action           = req.query.action           || null;
      const category         = req.query.category         || null;
      const performedByEmail = req.query.performedByEmail || null;
      const severity         = req.query.severity         || null;
      const targetModel      = req.query.targetModel      || null;
      const startDate        = req.query.startDate        || null;
      const endDate          = req.query.endDate          || null;
      const search           = req.query.search           || null;

      const query = { deletedAt: null };
      if (action) {
        query.action = action;
      }

      // Category filter
      if (category) {
        query.category = category;
      }
      if (severity) {
        query.severity = severity;
      }
      if (targetModel) {
        query.targetModel = targetModel;
      }
      if (performedByEmail) {
        const user = await User.findOne({ email: performedByEmail, deletedAt: null });
        if (!user) {
          return this.handleError(next, 'user with this email is not found', 404);
        }
        query.performedBy = user._id;
      }
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate);
        }
      }
      if (search) {
        query.description = {
          $regex: search, 
          $options: 'i'    
        };
      }
     //logs from database
      const logs = await AuditLog.find(query)
        .populate('performedBy', 'fullName email role') 
        .sort({ createdAt: -1 })                        
        .skip((page - 1) * limit)                       
        .limit(parseInt(limit));                        

      const total = await AuditLog.countDocuments(query);

      return res.status(200).json({
        error: false,
        data: logs,
        pagination: {
          total,                          
          page: parseInt(page),           
          limit: parseInt(limit),        
          pages: Math.ceil(total / limit) 
        }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }


  async getById(req, res, next) {
    try {
      const id = req.params.id;
      if (!this.isValidId(id)) {
        return this.handleError(next, 'wrong ID', 400);
      }

      const log = await AuditLog.findOne({
        _id: id,           
        deletedAt: null 
      }).populate('performedBy', 'fullName email role');

      if (!log) {
        return this.handleError(next, 'no logs found', 404);
      }

      return res.status(200).json({
        error: false,
        data: log
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

}

export default new auditLogController();