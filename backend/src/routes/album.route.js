import express from "express";
import albumController from "../controllers/album.controller.js";
import photoController from "../controllers/photo.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", albumController.getAlbums);
router.post("/", albumController.createAlbum);

router.get("/:id", albumController.getAlbumById);
router.patch("/:id", albumController.updateAlbum);
router.delete("/:id", albumController.deleteAlbum);

router.post("/:id/archive", albumController.archiveAlbum);
router.post("/:id/restore", albumController.restoreAlbum);

router.patch("/:id/access", albumController.setAccessEnabled);
router.patch("/:id/downloads", albumController.setDownloadPermission);

router.put("/:id/password", albumController.setAlbumPassword);
router.delete("/:id/password", albumController.removeAlbumPassword);

router.post("/:id/regenerate-link", albumController.regenerateAlbumLink);

// Photo management endpoints
router.get("/:albumId/photos", photoController.getPhotosByAlbum);
router.post("/:albumId/photos", uploadSingleImage, photoController.uploadPhoto);
router.delete("/:albumId/photos/:photoId", photoController.deletePhoto);
router.put("/:albumId/cover/:photoId", photoController.setCoverPhoto);

export default router;
