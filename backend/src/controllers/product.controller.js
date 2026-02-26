import Product from "../models/product.model.js";
import Collection from "../models/collection.model.js";
import cloudinary from "../lib/cloudinary.js"; 

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, collection, isFeatured } = req.body;

    if (!name || !price || !collection) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const col = await Collection.findById(collection);
    if (!col) {
      return res.status(400).json({ message: "Invalid collection" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const imageUrls = req.files.map((file) => file.path);

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      images: imageUrls,
      collection,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { collection: slug, search } = req.query;

    const filter = {};

    if (slug) {
      const col = await Collection.findOne({ slug });
      if (col) filter.collection = col._id;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).populate("collection");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("collection");
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = "data:" + file.mimetype + ";base64," + b64;
          const res = await cloudinary.uploader.upload(dataURI, {
            folder: "donum-products",
          });
          return res.secure_url;
        })
      );
      updates.images = imageUrls;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};