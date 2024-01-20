import { Router } from "express";
import {
  changeCurrentPassword,
  getUserChannelProfile,
  getWatchedHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registreUser,
  updatedAccountDetails,
  updatedUserAvatar,
  updatedUserCoverImage,
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
  registreUser
);

//LoggedInUser
router.route("/login").post(loginUser);

//logout User
router.route("/logout").post(verifyJWT, logoutUser);

//refresh token
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changeCurrentPassword);
router.route("/currenct-user").post(verifyJWT, getUserChannelProfile);
router.route("/updated-user").patch(verifyJWT, updatedAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updatedUserAvatar);
router
  .route("/cover-iamge")
  .patch(verifyJWT, upload.single("coverImage"), updatedUserCoverImage);

router.route("c/:username").get(verifyJWT, getUserChannelProfile);
router.route("history").get(verifyJWT, getWatchedHistory);
export default router;
