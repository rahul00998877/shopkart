import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🛍️ Sample Product Data (with images + categories)
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 65000,
    description: "High-performance laptop for coding and productivity.",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  },
  {
    id: 2,
    name: "Smartphone",
    price: 25000,
    description: "Powerful Android smartphone with great camera and battery life.",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1512499617640-c2f999018b72?w=800&q=80",
  },
  {
    id: 3,
    name: "Headphones",
    price: 3000,
    description: "Wireless Bluetooth headset with deep bass and noise cancellation.",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800&q=80",
  },
  {
    id: 4,
    name: "T-Shirt",
    price: 499,
    description: "Comfortable cotton T-shirt available in multiple colors.",
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  },
  {
    id: 5,
    name: "Novel Book",
    price: 299,
    description: "Bestselling fiction book for readers of all ages.",
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
  },
  {
    id: 6,
    name: "Shoes",
    price: 1999,
    description: "Lightweight and stylish running shoes for men and women.",
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  },
];

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running fine and connected!");
});

// 📦 Route for fetching all products
app.get("/products", (req, res) => {
  res.json(products);
});

// 👤 Placeholder routes for Login/Register (optional front-end integration)
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  res.json({ message: `User ${username} registered successfully (mock).` });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.json({ message: `Welcome back, ${username}! (mock login)` });
});

// 🖥️ Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend server running at: http://localhost:${PORT}`)
);
