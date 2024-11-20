import express from "express";
import { deleteUser, getAllUser, getUser, newUser, } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
//route - /api/v1/user/new
app.post("/new", newUser);
//route - /api/v1/user/all
app.get("/all", adminOnly, getAllUser);
//route - /api/v1/user/usergivenId
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);
export default app;
