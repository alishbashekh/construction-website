const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user exists and their role is in the allowed list
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You don't have permission to perform this action",
      });
    }
    next();
  };
};

export default checkRole;
