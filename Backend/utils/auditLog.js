import AuditLog from '../models/AuditLog.js';
import logger from '../logger.js';

export const createAuditLog = async ({
  performedBy,
  performerRole,
  action,
  category,
  targetModel,
  targetId,
  description,
  previousState,
  newState,
  reason,
  req,
  severity = 'info',
}) => {
  try {
    let ip = req?.ip;
    if (ip && ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    await AuditLog.create({
      performedBy,
      performerRole,
      action,
      category,
      targetModel,
      targetId,
      description,
      previousState,
      newState,
      reason,
      ip,
      userAgent: req?.get?.('User-Agent'),
      severity,
    });
  } catch (error) {
    logger.error('Failed to create audit log:', error);
  }
};
