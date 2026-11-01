import express from "express";
import clientController from "../controllers/client.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", clientController.getClients);
router.post("/", clientController.createClient);
router.get("/:id", clientController.getClientById);
router.patch("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);
router.post("/:id/archive", clientController.archiveClient);
router.post("/:id/restore", clientController.restoreClient);

export default router;
