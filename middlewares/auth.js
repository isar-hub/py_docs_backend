import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
//middleware for admin only things
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("user is not logged in", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid id", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler("Not an admin", 401));
    //if we don't pass any error in next then it will activate next handler function in the chain
    //app.get("/all", adminOnly, getAllUser); like here it will activate getAllUser
    next();
});
// "api/v1/user/asc123?key=24" after question mark  is query string . req.query will give us that
// 401 - unauthorized
