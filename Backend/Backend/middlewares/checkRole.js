const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // console.log("🔥 req.user =", req.user);
    // console.log("🔥 allowedRoles =", allowedRoles);

    if (!req.user || !allowedRoles.includes(req.user.accountType)) {
      return res.status(403).json({
        message: "You don't have permission to perform this action",
      });
    }

    next();
  };
};

export default checkRole;