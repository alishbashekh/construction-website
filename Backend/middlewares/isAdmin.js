const isAdmin = (req, res, next) => {
  // Only allow if role is system_admin
  if (req.user && req.user.role === "system_admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};

export default isAdmin;
