import jwt from "jsonwebtoken";

const isUser = async (req, res, next) => {
  try {
    // 1. Get token from the header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, please login first" });
    }

    // 2. Verify if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3. Attach user info to the request so controllers can use it
    req.user = decoded;
  
      // 🔥 ADD THIS LINE
    console.log("🔥 DECODED USER:", req.user);


    next(); // Move to the next step
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isUser;
