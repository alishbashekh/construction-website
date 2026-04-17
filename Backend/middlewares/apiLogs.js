const apiLogs = (req, res, next) => {
  const time = new Date().toLocaleString();
  // Log the Method (GET/POST), URL, and Time
  console.log(`[${time}] ${req.method} request to: ${req.url}`);
  next();
};

export default apiLogs;
