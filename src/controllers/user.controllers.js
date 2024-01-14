import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went worng when generating access and refreshToken",
    );
  }
};

const registreUser = asyncHandler(async (req, res, next) => {
  //   await res.status(200).json({
  //     message: "Balu Dilip Kharade",
  //   });
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password]?.some((item) => item?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are Required.");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser)
    throw new ApiError(409, "User with username or email is already exists.");

  const avatatLocalPath = req?.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage?.[0]?.path;

  if (!avatatLocalPath) {
    throw new ApiError(400, "Avatar image is Required.");
  }

  const avatar = await uploadOnCloudinary(avatatLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar image is Required.");
  }

  const user = await User.create({
    fullName,
    username: username?.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken",
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));
});

const option = {
    httpOnly: true,
    secure: true,
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(email || username))
    throw new ApiError(400, "Username or Email is required.");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiError(404, "User is not exist.");
  const isPasswordValid = user?.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Password is not correct.");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id,
  );

  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken",
  );



  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully!",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );


  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User Logged Out!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const oncomingRefreshToken = req?.cookies?.refreshToken || req?.body?.refreshToken;
    if (!oncomingRefreshToken) throw new ApiError(401, "unauthorized request.");

    try {
        const decodedToken = jwt.verify(oncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
        if (!user) throw new ApiError(401, "Invalid Refresh Token.");
    
        if (oncomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh Token is expired.");
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user?._id);
    
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", newRefreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, "Invalid Refresh Token.");
    }

})

export { registreUser, loginUser, logoutUser, refreshAccessToken };
