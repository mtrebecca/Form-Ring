import { Router } from "express";
import { RingController } from "../controllers/RingController";

const router = Router();
const ringController = new RingController();

router.post("/rings", ringController.create);
router.get("/rings", ringController.list);
router.put("/rings/:id", ringController.update);
router.delete("/rings/:id", ringController.delete);
router.get("/rings/:id", ringController.getRingById);
router.get("/forjadores/count", ringController.getForjadoresCount);


export { router as RingRoutes };
