import { Router } from "express";
import { loginUser, logout, refreshAccessTokens, registerUser, resendVerificationCode, verifyUser } from "../controllers/userControllers";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();

router.route('/register').post(registerUser);
router.route('/verify-user').post(verifyUser);
router.route('/resend-verificationCode').post(resendVerificationCode);
router.route('/login').post(loginUser);

// secure route
router.route('/logout').post(verifyAuth, logout);

router.route('/refresh-tokens').post(refreshAccessTokens);
router.route('/forgot-password').post()

export default router;