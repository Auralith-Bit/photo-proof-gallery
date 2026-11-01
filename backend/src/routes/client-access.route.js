import express from "express";
import clientAccessController from "../controllers/client-access.controller.js";

const router = express.Router();

router.get("/:accessToken", clientAccessController.resolveAlbumByToken);
router.post("/:accessToken/verify", clientAccessController.verifyAlbumAccess);

export default router;
