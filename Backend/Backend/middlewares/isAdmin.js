const isAdmin = (req, res, next) => {
  console.log("🔥 FULL USER OBJECT:", req.user);
  console.log("🔥 ACCOUNT TYPE:", req.user?.accountType); // ✅ correct property

  if (req.user && req.user.accountType === "system_admin") { // ✅ fixed
    return next();
  }

  return res.status(403).json({
    message: "Admin access required"
  });
};

export default isAdmin;