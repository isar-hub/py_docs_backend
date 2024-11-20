import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { v4 as uuidv4 } from "uuid";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob, password, mobile } = req.body;
    // Check if _id is provided or generate a new one
    let userId = _id || uuidv4();
    try {
        // Check if user with this _id already exists
        let user = await User.findById(userId);
        if (user) {
            return res.status(200).json({
                success: true,
                message: `Welcome, ${user.name}`,
            });
        }
        // Handle Google Sign-In (no password)
        if (!password) {
            user = await User.findOne({ email });
            if (user) {
                return res.status(200).json({
                    success: true,
                    message: `Welcome back, ${user.name}`,
                });
            }
            // Create new user for Google Sign-In
            user = await User.create({
                name,
                email,
                photo,
                gender,
                _id: userId,
                dob: dob ? new Date(dob) : undefined,
                mobile,
                password: "",
            });
            return res.status(201).json({
                success: true,
                message: `New Google user created: ${user.name}`,
            });
        }
        // Standard signup flow
        if (!password || !email || !name) {
            return next(new ErrorHandler("Please add all required fields", 400));
        }
        // Parse date of birth if provided
        let parsedDob;
        if (dob) {
            parsedDob = new Date(dob);
            if (isNaN(parsedDob.getTime())) {
                return next(new ErrorHandler("Invalid date format", 400));
            }
        }
        // Create new user for standard signup
        user = await User.create({
            name,
            email,
            photo,
            gender,
            _id: userId,
            dob: parsedDob,
            mobile,
            password,
        });
        return res.status(201).json({
            success: true,
            message: `New user created: ${user.name}`,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return next(new ErrorHandler("Error creating user", 500));
    }
});
export const getAllUser = TryCatch(async (req, res, next) => {
    const allUsers = await User.find({});
    return res.status(200).json({
        success: true,
        allUsers,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    return res.status(200).json({
        success: true,
        user,
    });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    return res.status(200).json({
        success: true,
        message: "User deleted Successfully",
    });
});
