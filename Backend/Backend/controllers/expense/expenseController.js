import Expense from '../../models/Expense.js';
import BaseController from '../BaseController.js';
import { createAuditLog } from '../../utils/auditLog.js';

class expenseController extends BaseController {

  constructor() {
    super();
    this.create  = this.create.bind(this);
    this.getAll  = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update  = this.update.bind(this);
    this.delete  = this.delete.bind(this);
  }


  async create(req, res, next) {
    try {

      // STEP 1: Check title is given
      const validation = this.validateRequiredFields(req.body, ['title']);
      if (validation) return res.status(400).json(validation);

      // STEP 2: Check amount is given
      const amount = req.body.amount;
      if (amount === undefined || amount === null || amount === '') {
        return res.status(400).json({ success: false, message: 'The following fields are required: amount' });
      }

      // STEP 3: Convert amount to number and validate
      const numAmount = Number(amount);

      // isNaN check - is it a valid number?
      // numAmount < 0 check - is it negative?
      if (Number.isNaN(numAmount) || numAmount < 0) {
        return res.status(400).json({ success: false, message: 'Amount must be a valid non-negative number' });
      }

      // STEP 4: Create expense in database
      const expense = await Expense.create({
        title:     req.body.title,
        amount:    numAmount,
        createdBy: req.user._id
      });

      // STEP 5: Save audit log
      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'expense_create',
        category:      'expense',
        targetModel:   'Expense',
        targetId:      expense._id,
        description:   `Created expense "${expense.title}" (${expense.amount})`,
        newState:      expense.toJSON(),
        req,
      });

      // STEP 6: Send response
      return res.status(201).json({
        error: false,
        message: 'Expense created successfully',
        data: expense
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

 
  async getAll(req, res, next) {
    try {

      // STEP 1: Get filters from URL
      const page      = req.query.page      || 1;
      const limit     = req.query.limit     || 10;
      const search    = req.query.search    || null;
      const startDate = req.query.startDate || null;
      const endDate   = req.query.endDate   || null;

      // STEP 2: Base query
      const query = { deletedAt: null };

      // STEP 3: Search in title
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      // STEP 4: Date range filter
      if (startDate || endDate) {
        query.createdAt = {};

        // From this date
        if (startDate) query.createdAt.$gte = new Date(startDate);

        // Until this date
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // STEP 5: Get expenses from database
      const expenses = await Expense.find(query)
        .populate('createdBy', 'fullName email role')
        .sort({ createdAt: -1 })          // newest first
        .skip((page - 1) * limit)         // pagination skip
        .limit(parseInt(limit, 10));      // limit records

      // STEP 6: Total count for pagination
      const total = await Expense.countDocuments(query);

      // STEP 7: Send response
      return res.status(200).json({
        error: false,
        data: expenses,
        pagination: {
          total,
          page:  parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async getById(req, res, next) {
    try {

      // STEP 1: Check if ID is valid
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Invalid expense ID', 400);
      }

      // STEP 2: Find the expense
      const expense = await Expense.findOne({ _id: req.params.id, deletedAt: null })
        .populate('createdBy', 'fullName email role');

      if (!expense) return this.handleError(next, 'Expense not found', 404);

      // STEP 3: Send response
      return res.status(200).json({ error: false, data: expense });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async update(req, res, next) {
    try {

      // STEP 1: Check if ID is valid
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Invalid expense ID', 400);
      }

      // STEP 2: Find the expense
      const expense = await Expense.findOne({ _id: req.params.id, deletedAt: null });
      if (!expense) return this.handleError(next, 'Expense not found', 404);

      // STEP 3: Save old data for audit log
      const previousState = expense.toJSON();

      // STEP 4: Update title if given
      if (req.body.title !== undefined) {
        expense.title = req.body.title;
      }

      // STEP 5: Update amount if given
      if (req.body.amount !== undefined) {
        const numAmount = Number(req.body.amount);

        // Validate the new amount
        if (Number.isNaN(numAmount) || numAmount < 0) {
          return res.status(400).json({ success: false, message: 'Amount must be a valid non-negative number' });
        }

        expense.amount = numAmount;
      }

      // STEP 6: Save updated expense
      await expense.save();

      // STEP 7: Save audit log
      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'expense_update',
        category:      'expense',
        targetModel:   'Expense',
        targetId:      expense._id,
        description:   `Updated expense "${expense.title}"`,
        previousState,
        newState:      expense.toJSON(),
        req,
      });

      // STEP 8: Send response
      return res.status(200).json({
        error: false,
        message: 'Expense updated successfully',
        data: expense
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async delete(req, res, next) {
    try {

      // STEP 1: Check if ID is valid
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Invalid expense ID', 400);
      }

      // STEP 2: Find the expense
      const expense = await Expense.findOne({ _id: req.params.id, deletedAt: null });
      if (!expense) return this.handleError(next, 'Expense not found', 404);

      // STEP 3: Soft delete - just add timestamp, dont actually remove
      expense.deletedAt = new Date();
      await expense.save();

      // STEP 4: Save audit log
      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'expense_delete',
        category:      'expense',
        targetModel:   'Expense',
        targetId:      expense._id,
        description:   `Deleted expense "${expense.title}"`,
        req,
        severity:      'warning',
      });

      // STEP 5: Send response
      return res.status(200).json({
        error: false,
        message: 'Expense deleted successfully'
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

}

export default new expenseController();