import express from "express";
import { createProduct, deleteProduct, forgotPassword, getData, getProducts, logIn, logOut, resetPassword, updateProduct, verifyToken } from "../controllers/controllers";
import multer from "multer";
import path from "path";

const router=express.Router();
const storage=multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload=multer({storage});

router.post("/signup", getData);
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/verify-token", verifyToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/get-products", getProducts);
router.post("/create-product", upload.single("productImage"), createProduct);
router.post("/update-product", upload.single("productImage"), updateProduct);
router.post("/delete-product", deleteProduct);

export default router;