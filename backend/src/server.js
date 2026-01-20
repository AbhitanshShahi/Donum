import express from "express";
import { connectDB } from "./lib/db.js";
import adminRoutes from "./routes/admin.route.js";
import collectionRoutes from "./routes/collection.route.js";
import productRoutes from "./routes/product.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";
import { ENV } from "./lib/env.js";
import multer from "multer";

const app = express();

const PORT = ENV.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",             
    "https://donum-store.vercel.app",    
    "https://abs-donum.vercel.app"       
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Image size too large (max 10MB)"
          : err.message,
    });
  }
  next(err);
});

app.use("/api/admin", adminRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  return res.send("This is the homepage of your website");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
