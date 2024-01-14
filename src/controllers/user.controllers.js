import { asyncHandler } from "../utils/asyncHandler.js";

const registreUser = asyncHandler(async (req, res, next) => {
  await res.status(200).json({
    message: "Balu Dilip Kharade",
  });
});

export { registreUser };
