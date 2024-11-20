import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import NodeCache from "node-cache";
import Razorpay from "razorpay";
import { v2 as cloudinary } from "cloudinary";
// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payments.js";
import dashboardRoute from "./routes/stats.js";
// Importing Utilities and Middleware
import { connectDB, connectRedis } from "./utils/feature.js";
import { errorMiddleware } from "./middlewares/error.js";
dotenv.config({ path: "./.env" });
const app = express();
// Configuration
const redisURI = process.env.REDIS_URI || "";
export const redisTTL = process.env.REDIS_TTL || 60 * 60 * 4;
const PORT = process.env.PORT || 3000;
// Connect to Databases and Services
connectDB();
export const redis = connectRedis(redisURI);
export const myCache = new NodeCache();
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "DEFAULT KEY ID",
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
// Routes
app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
// Static Files
app.use("/uploads", express.static("uploads"));
// Error Handling Middleware
app.use(errorMiddleware);
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
