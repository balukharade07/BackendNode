import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("email", email);

  if (existedUser) throw new ApiError(409, "User with username or email.");

  const avatatLocalPath = req?.file?.avatar?.[0]?.path;
  const coverImageLocalPath = req?.file?.coverImage?.[0]?.path;
  if (!avatatLocalPath) throw new ApiError(400, "Avatar image is Required.");

  const avatar = await uploadOnCloudinary(avatatLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar image is Required.");

  const user = await User.create({
    fullName,
    username: username?.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );
  if(!createdUser) throw new ApiError(500, "Something went wrong while registering user.");


  return res.status(201).json(
    new ApiResponse(200, createdUser ,"User registered successfully!")
  )

});

export { registreUser };
