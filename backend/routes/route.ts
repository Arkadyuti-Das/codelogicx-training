import express from "express";
import {
  createProduct,
  deleteProduct,
  forgotPassword,
  getData,
  getProducts,
  logIn,
  logOut,
  resetPassword,
  updateProduct,
  verifyToken,
} from "../controllers/controllers";
import multer from "multer";
import path from "path";
import { authenticateUser } from "../middleware/middleware";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/signup", getData);
/**
     * @openapi
     * '/api/login':
     *  post:
     *     tags:
     *     - Login
     *     summary: Login as a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - username
     *              - password
     *            properties:
     *              username:
     *                type: string
     *                default: johndoe
     *              password:
     *                type: string
     *                default: johnDoe20!@
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/verify-token", verifyToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/**
 * @openapi
 * '/api/get-products':
 *  get:
 *     tags:
 *      - Products
 *     summary: Get all products
 *     description: Returns a list of all available products with optional search, sorting, and pagination.
 *     parameters:
 *       - name: searchValues
 *         in: query
 *         description: Search keyword for filtering products
 *         required: false
 *         schema:
 *           type: string
 *           default: ""
 *       - name: rowsPerPage
 *         in: query
 *         description: Number of products per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: sortField
 *         in: query
 *         description: Field to sort by
 *         required: false
 *         schema:
 *           type: string
 *           default: "name"
 *       - name: sortBy
 *         in: query
 *         description: Sort order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *       - name: page
 *         in: query
 *         description: The page number (starting from 0)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       name:
 *                         type: string
 *                         example: "Laptop"
 *                       price:
 *                         type: number
 *                         example: 999.99
 *                 total:
 *                   type: integer
 *                   example: 100
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */


router.get("/get-products", authenticateUser, getProducts);
// router.get("/get-products", getProducts);
router.post("/create-product", authenticateUser, upload.single("productImage"), createProduct);
router.post("/update-product", authenticateUser, upload.single("productImage"), updateProduct);
router.post("/delete-product", authenticateUser, deleteProduct);

export default router;