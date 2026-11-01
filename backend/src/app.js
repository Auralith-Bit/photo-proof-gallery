import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import albumRoutes from "./routes/album.route.js";
import clientRoutes from "./routes/client.route.js";
import clientAccessRoutes from "./routes/client-access.route.js";
import settingsRoutes from "./routes/settings.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Photo studio API is running..",
  });
});

app.use(["/api/v1/auth", "/api/auth"], authRoutes);
app.use(["/api/v1/albums", "/api/albums"], albumRoutes);
app.use(["/api/v1/clients", "/api/clients"], clientRoutes);
app.use(["/api/v1/settings", "/api/settings"], settingsRoutes);
app.use(["/api/v1/analytics", "/api/analytics"], analyticsRoutes);
app.use(["/api/v1/a", "/api/a"], clientAccessRoutes);

export default app;