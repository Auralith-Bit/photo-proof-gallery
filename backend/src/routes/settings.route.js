import express from "express";
import settingsController from "../controllers/settings.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", settingsController.getSettings);
router.get("/profile", settingsController.getProfile);
router.put("/profile", settingsController.updateProfile);
router.get("/branding", settingsController.getBranding);
router.put("/branding", settingsController.updateBranding);
router.get("/preferences", settingsController.getPreferences);
router.put("/preferences", settingsController.updatePreferences);
router.get("/security", settingsController.getSecurity);
router.put("/security", settingsController.updateSecurity);
router.post("/change-password", settingsController.changePassword);
router.get("/storage", settingsController.getStorage);
router.get("/activity", settingsController.getActivity);
router.post("/upload-image", uploadSingleImage, settingsController.uploadImage);

export default router;
