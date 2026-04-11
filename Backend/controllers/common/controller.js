import BaseController from '../BaseController.js';
import Project from '../../models/Project.js';
import Flat from '../../models/Flat.js';
import Client from '../../models/Client.js';
import Booking from '../../models/Booking.js';
import getVendorProjectModel from '../../models/VendorProject.js';
import getVendorModel from '../../models/Vendor.js';

class controller extends BaseController {

  constructor() {
    super();
    this.get = this.get.bind(this);
  }

  async get(req, res, next) {
    try {

      // get everything from URL query
      const project       = req.query.project;
      const flat          = req.query.flat;
      const client        = req.query.client;
      const projectId     = req.query.projectId;
      const booking       = req.query.booking;
      const vendorProject = req.query.vendorProject;
      const vendor        = req.query.vendor;
      const flatStatus    = req.query.flatStatus || 'available';

      // empty object - fill it below based on what was asked
      const response = {};

      // if project asked - get all active projects
      if (project) {
        response.project = await Project
          .find({ deletedAt: null, status: 'active' })
          .select('name');
      }

      // if flat asked - get flats (with optional project filter)
      if (flat) {
        const query = { deletedAt: null, status: flatStatus };
        if (projectId) query.project = projectId;

        response.flat = await Flat
          .find(query)
          .select('flatNumber floor size type');
      }

      // if client asked - get all clients
      if (client) {
        response.client = await Client
          .find({ deletedAt: null })
          .select('name cnic');
      }

      // if booking asked - get active bookings (with optional project filter)
      if (booking) {
        const query = { deletedAt: null, status: 'active' };
        if (projectId) query.project = projectId;

        response.booking = await Booking
          .find(query)
          .select('bookingNumber');
      }

      // if vendorProject asked - get all active vendor projects
      if (vendorProject) {
        const VendorProject = getVendorProjectModel();

        response.vendorProject = await VendorProject
          .find({ deletedAt: null, status: 'active' })
          .select('name');
      }

      // if vendor asked - get all vendors
      if (vendor) {
        const Vendor = getVendorModel();

        response.vendor = await Vendor
          .find({ deletedAt: null })
          .select('name category');
      }

      // send back whatever was filled
      return res.status(200).json({ error: false, data: response });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }
}

export default new controller();