import { Router } from "express";
import { registerUser } from "../controllers/userControllers";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post();
router.route('/logout').post();
router.route('/forgot-password').post()

export default router;