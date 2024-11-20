import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"],
    },
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Please enter your email"],
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: false,
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: false,
    },
    dob: {
        type: Date,
        required: false,
    },
    mobile: {
        type: String,
    },
}, { timestamps: true });
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
// userSchema.pre<IUser>("save", async function (next: HookNextFunction) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   try {
//     const hashedPassword = await bcrypt.hash(this.password as string, 10);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
// userSchema.methods.comparePassword = async function (password: string) {
//   return await bcrypt.compare(password, this.password);
// };
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    }
    catch (error) {
        next();
    }
});
userSchema.methods.comparePassword = async function (password) {
    try {
        const match = await bcrypt.compare(password, this.password);
        return match;
    }
    catch (error) {
        throw new Error(String(error));
    }
};
userSchema.virtual("age").get(function () {
    if (this.dob) {
        const today = new Date();
        const dob = this.dob;
        let age = today.getFullYear() - dob.getFullYear();
        if (today.getMonth() < dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }
    return null;
});
export const User = mongoose.model("User", userSchema);
