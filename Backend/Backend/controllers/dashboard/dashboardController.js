import Booking from '../../models/Booking.js';
import Flat from '../../models/Flat.js';
import Payment from '../../models/Payment.js';
import Project from '../../models/Project.js';
import Client from '../../models/Client.js';
import AuditLog from '../../models/AuditLog.js';
import BaseController from '../BaseController.js';

class dashboardController extends BaseController {

  constructor() {
    super();
    this.getDashboard = this.getDashboard.bind(this);
  }

  async getDashboard(req, res, next) {
    try {

      // STEP 1: Date calculations
      const now = new Date();

      // First day of this month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // First day of last month
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      // Last day of last month
      const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

      // STEP 2: Get all dashboard data
      const kpiData            = await this._getKpiData(startOfMonth, startOfPrevMonth, endOfPrevMonth);
      const unitsStatusData    = await this._getUnitsStatusData();
      const revenueData        = await this._getRevenueData();
      const projectPerformance = await this._getProjectPerformance();
      const paymentTrendData   = await this._getPaymentTrendData();
      const recentActivities   = await this._getRecentActivities();
      const topClients         = await this._getTopClients();

      // STEP 3: Send everything
      return res.status(200).json({
        error: false,
        data: {
          kpiData,
          unitsStatusData,
          revenueData,
          projectPerformance,
          paymentTrendData,
          recentActivities,
          topClients,
        }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async _getKpiData(startOfMonth, startOfPrevMonth, endOfPrevMonth) {

    // Count projects
    const totalProjects      = await Project.countDocuments({ deletedAt: null });
    const projectsThisMonth  = await Project.countDocuments({ deletedAt: null, createdAt: { $gte: startOfMonth } });

    // Count flats
    const totalFlats         = await Flat.countDocuments({ deletedAt: null });
    const flatsThisMonth     = await Flat.countDocuments({ deletedAt: null, createdAt: { $gte: startOfMonth } });

    // Count clients
    const activeClients          = await Client.countDocuments({ deletedAt: null });
    const activeClientsThisMonth = await Client.countDocuments({ deletedAt: null, createdAt: { $gte: startOfMonth } });

    // Calculate total revenue (all time)
    const totalRevenueResult = await Payment.aggregate([
      { $match: { deletedAt: null, isRefund: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Calculate revenue of last month
    const prevMonthRevenueResult = await Payment.aggregate([
      { $match: { deletedAt: null, isRefund: false, paymentDate: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Calculate revenue of this month
    const thisMonthRevenueResult = await Payment.aggregate([
      { $match: { deletedAt: null, isRefund: false, paymentDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get actual numbers from aggregate results
    const totalRev     = totalRevenueResult[0]?.total     || 0;
    const prevMonthRev = prevMonthRevenueResult[0]?.total || 0;
    const thisMonthRev = thisMonthRevenueResult[0]?.total || 0;

    // Calculate revenue % change from last month to this month
    // Example: last month 100, this month 120 → change = +20%
    const revenueChange = prevMonthRev > 0
      ? Math.round(((thisMonthRev - prevMonthRev) / prevMonthRev) * 100)
      : 0;

    // Return 4 KPI cards
    return [
      {
        title:      'Total Projects',
        value:      totalProjects,
        change:     projectsThisMonth > 0 ? `+${projectsThisMonth}` : '0',
        changeType: projectsThisMonth > 0 ? 'increase' : 'neutral',
      },
      {
        title:      'Total Units',
        value:      totalFlats,
        change:     flatsThisMonth > 0 ? `+${flatsThisMonth}` : '0',
        changeType: flatsThisMonth > 0 ? 'increase' : 'neutral',
      },
      {
        title:      'Active Clients',
        value:      activeClients,
        change:     activeClientsThisMonth > 0 ? `+${activeClientsThisMonth}` : '0',
        changeType: activeClientsThisMonth > 0 ? 'increase' : 'neutral',
      },
      {
        title:      'Total Revenue',
        value:      totalRev,
        change:     revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`,
        changeType: revenueChange >= 0 ? 'increase' : 'decrease',
      },
    ];
  }


  async _getUnitsStatusData() {

    // Count flats grouped by status
    const statuses = await Flat.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$status', value: { $sum: 1 } } }
    ]);

    // Color for each status on the pie chart
    const colorMap = {
      available: '#10b981', // green
      booked:    '#3b82f6', // blue
      sold:      '#ef4444', // red
      blocked:   '#f59e0b', // yellow
    };

    // Display name for each status
    const nameMap = {
      available: 'Available',
      booked:    'Booked',
      sold:      'Sold',
      blocked:   'Blocked',
    };

    // Build the result for all 4 statuses
    // If a status has 0 flats, still show it with value 0
    return ['available', 'booked', 'sold', 'blocked'].map(status => {
      const found = statuses.find(s => s._id === status);
      return {
        name:  nameMap[status],
        value: found?.value || 0,
        color: colorMap[status],
      };
    });
  }


  async _getRevenueData() {

    const now = new Date();

    // Start from 6 months ago
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Get revenue grouped by month
    const revenueByMonth = await Payment.aggregate([
      { $match: { deletedAt: null, isRefund: false, paymentDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get bookings count grouped by month
    const bookingsByMonth = await Booking.aggregate([
      { $match: { deletedAt: null, bookingDate: { $gte: sixMonthsAgo }, status: { $in: ['active', 'completed'] } } },
      {
        $group: {
          _id: { year: { $year: '$bookingDate' }, month: { $month: '$bookingDate' } },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const d     = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year  = d.getFullYear();
      const month = d.getMonth() + 1;

      const rev = revenueByMonth.find(r => r._id.year === year && r._id.month === month);

    
      const bkg = bookingsByMonth.find(b => b._id.year === year && b._id.month === month);

      result.push({
        month:    monthNames[month - 1],
        revenue:  rev?.revenue  || 0,
        bookings: bkg?.bookings || 0,
      });
    }

    return result;
  }


  async _getProjectPerformance() {

    // Get all active projects
    const projects = await Project
      .find({ deletedAt: null, status: 'active' })
      .select('name')
      .lean();

    // Get flat counts grouped by project and status
    const flatStats = await Flat.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id:   { project: '$project', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]);

    // For each project, build its performance data
    return projects.map(project => {

      // Get only this project's flat stats
      const projectFlats = flatStats.filter(f =>
        f._id.project.toString() === project._id.toString()
      );

      // Helper to get count of a specific status
      const getCount = (status) =>
        projectFlats.find(f => f._id.status === status)?.count || 0;

      return {
        project:   project.name,
        sold:      getCount('sold'),
        booked:    getCount('booked'),
        available: getCount('available'),
        blocked:   getCount('blocked'),
      };
    });
  }

  async _getPaymentTrendData() {

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Get payments grouped by month and payment mode
    const payments = await Payment.aggregate([
      { $match: { deletedAt: null, isRefund: false, paymentDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year: '$paymentDate' },
            month: { $month: '$paymentDate' },
            mode:  '$paymentMode',             
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];

    // Loop last 6 months
    for (let i = 5; i >= 0; i--) {
      const d     = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year  = d.getFullYear();
      const month = d.getMonth() + 1;

      // Helper to get total for a specific payment mode this month
      const getTotal = (mode) =>
        payments.find(p =>
          p._id.year === year && p._id.month === month && p._id.mode === mode
        )?.total || 0;

      result.push({
        month:  monthNames[month - 1],
        cash:   getTotal('cash'),
        bank:   getTotal('bank'),
        cheque: getTotal('cheque'),
      });
    }

    return result;
  }

  async _getRecentActivities() {

    // Get last 5 audit logs of these categories
    const activities = await AuditLog.find({
      deletedAt: null,
      category: { $in: ['booking', 'payment', 'refund', 'client', 'flat'] }
    })
      .populate('performedBy', 'fullName') // get user name
      .sort({ createdAt: -1 })             // newest first
      .limit(5)
      .lean();

    // Format and return
    return activities.map(activity => ({
      id:          activity._id,
      action:      activity.action,
      category:    activity.category,
      description: activity.description,
      performedBy: activity.performedBy?.fullName || 'System',
      time:        activity.createdAt,
      severity:    activity.severity,
    }));
  }

  async _getTopClients() {

   
    const topClients = await Payment.aggregate([
      { $match: { deletedAt: null, isRefund: false } },
      {
        $group: {
          _id:        '$client',
          totalSpent: { $sum: '$amount' },
          bookings:   { $addToSet: '$booking' } // unique booking IDs
        }
      },
      { $sort: { totalSpent: -1 } }, // highest spender first
      { $limit: 10 },                // top 10 only

      // Join with clients collection to get name
      {
        $lookup: {
          from:         'clients',
          localField:   '_id',
          foreignField: '_id',
          as:           'clientDetails'
        }
      },
      { $unwind: '$clientDetails' }, // convert array to object

      // Only return these fields
      {
        $project: {
          name:       '$clientDetails.name',
          totalSpent: 1,
          units:      { $size: '$bookings' } // count of unique bookings
        }
      }
    ]);

    return topClients;
  }
}

export default new dashboardController();