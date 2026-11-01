import jwt from "jsonwebtoken";
import config from "../config/config.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = req.cookies?.token || bearerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT Error:", error.name, error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;