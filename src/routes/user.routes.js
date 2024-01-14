import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registreUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registreUser,
);

//LoggedInUser
router.route("/login").post(loginUser);

//logout User
router.route("/logout").post(verifyJWT, logoutUser);

//refresh token
router.route("refresh-token").post(refreshAccessToken);

export default router;
