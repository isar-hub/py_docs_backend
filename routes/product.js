import express from "express";
import { allReviewsOfProduct, deleteProduct, deleteReview, getAdminProducts, getAllCategories, getAllProducts, getSingleProduct, getlatestProducts, newProduct, newReview, updateProduct, updateProductPhotos, } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
import { multiUpload } from "../middlewares/multer.js";
const app = express.Router();
//To Create New Product  - /api/v1/product/new
app.post("/new", adminOnly, multiUpload, newProduct);
//To get all Products with filters  - /api/v1/product/all
app.get("/all", getAllProducts);
//To get last 10 Products  - /api/v1/product/latest
app.get("/latest", getlatestProducts);
//To get all unique Categories  - /api/v1/product/categories
app.get("/categories", getAllCategories);
//To get all Products   - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);
// To get, update, delete Product
app
    .route("/:id")
    .get(getSingleProduct)
    .put(adminOnly, multiUpload, updateProduct, updateProductPhotos)
    .delete(adminOnly, deleteProduct);
app.get("/reviews/:id", allReviewsOfProduct);
app.post("/review/new/:id", newReview);
app.delete("/review/:id", deleteReview);
export default app;
