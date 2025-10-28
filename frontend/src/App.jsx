import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem("orders")) || []);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => console.log("Error fetching products"));
  }, []);

  // Persist Data
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [cart, wishlist, user, orders]);

  // Cart / Wishlist Handlers
  const handleAddToCart = (product) => {
    if (!user) return alert("Please sign in to add to cart!");
    const exists = cart.find((item) => item.id === product.id);
    if (exists) return alert("Item already in cart!");
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const handleWishlist = (product) => {
    if (!user) return alert("Please sign in to add to wishlist!");
    if (wishlist.find((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Auth System
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (authMode === "register") {
      if (users.find((u) => u.email === email)) {
        alert("User already exists!");
        return;
      }
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registered successfully! Please sign in.");
      setAuthMode("signin");
    } else {
      const existing = users.find((u) => u.email === email && u.password === password);
      if (!existing) return alert("Invalid credentials!");
      setUser(existing);
      setShowAuth(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    alert("Logged out successfully!");
  };

  // Checkout & Orders
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    if (!user) return alert("Please sign in to checkout!");
    if (cart.length === 0) return alert("Your cart is empty!");

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: cart,
      total: totalPrice,
      status: "Processing",
    };

    setOrders([...orders, newOrder]);
    setCart([]);
    alert("✅ Order placed successfully!");
    setShowCart(false);
    setShowOrders(true);
  };

  // Filters
  const filteredProducts = products
    .filter(
      (p) =>
        (categoryFilter === "All" || p.category === categoryFilter) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (priceFilter === "low") return a.price - b.price;
      if (priceFilter === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f4f6f9",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {/* ✅ Sticky Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#2874f0",
          color: "white",
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          width: "100%",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "600", cursor: "pointer" }}>ShopKart</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "5px",
              border: "none",
              outline: "none",
              width: "250px",
              fontSize: "14px",
            }}
          />
          <button
            onClick={() => setShowCart(true)}
            style={navBtn}
          >
            🛒 Cart ({cart.length})
          </button>
          <button
            onClick={() => alert(`Wishlist items: ${wishlist.length}`)}
            style={navBtn}
          >
            ❤️ Wishlist ({wishlist.length})
          </button>
          {user && (
            <button onClick={() => setShowOrders(true)} style={navBtn}>
              📦 Orders
            </button>
          )}
          <button
            onClick={() => (user ? handleLogout() : setShowAuth(true))}
            style={navBtn}
          >
            {user ? `Hi, ${user.email}` : "Sign In"}
          </button>
        </div>
      </nav>

      {/* 🏷️ Offer Bar */}
      <div
        style={{
          background: "linear-gradient(to right, #2874f0, #1a56d9)",
          color: "white",
          padding: "12px",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        🔥 Festive Deals — Up to 60% OFF on Top Brands + Free Delivery!
      </div>

      {/* 🖼️ Banner */}
      <div
        style={{
          width: "100%",
          height: "350px",
          marginTop: "10px",
          overflow: "hidden",
          borderRadius: "10px",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1500&q=80"
          alt="Offer Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* 🎚️ Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={filterStyle}
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          style={filterStyle}
        >
          <option value="default">Sort by</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* 🛍️ Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
          padding: "40px",
          maxWidth: "1300px",
          margin: "auto",
        }}
      >
        {filteredProducts.map((p) => (
          <div key={p.id} style={productCard}>
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#172337" }}>{p.name}</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>{p.description}</p>
            <p style={{ fontWeight: "600", color: "#2874f0" }}>₹{p.price}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button onClick={() => handleAddToCart(p)} style={btn}>
                Add to Cart
              </button>
              <button
                onClick={() => handleWishlist(p)}
                style={{
                  ...btn,
                  backgroundColor: wishlist.find((item) => item.id === p.id)
                    ? "#f50057"
                    : "#e0e0e0",
                  color: wishlist.find((item) => item.id === p.id) ? "white" : "#555",
                }}
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Footer */}
      <footer style={footerStyle}>© 2025 ShopKart — Built with ❤️ by Rahul</footer>

      {/* 🛒 Cart Modal */}
      {showCart && (
        <div className="modal">
          <div className="modal-content">
            <h2>🛒 Your Cart</h2>
            {cart.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                    <button onClick={() => handleRemoveFromCart(item.id)}>❌</button>
                  </div>
                ))}
                <hr />
                <h3>Total: ₹{totalPrice}</h3>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </>
            )}
            <button className="close-btn" onClick={() => setShowCart(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* 📦 Orders Modal */}
      {showOrders && (
        <div className="modal">
          <div className="modal-content">
            <h2>📦 Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders placed yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="cart-item">
                  <strong>Order #{order.id}</strong>
                  <p>Date: {order.date}</p>
                  <p>Status: {order.status}</p>
                  <p>Total: ₹{order.total}</p>
                  <ul>
                    {order.items.map((i) => (
                      <li key={i.id}>{i.name}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
            <button className="close-btn" onClick={() => setShowOrders(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* 👤 Auth Modal */}
      {showAuth && (
        <div className="modal">
          <div className="modal-content">
            <h2>{authMode === "signin" ? "Sign In" : "Register"}</h2>
            <form onSubmit={handleAuthSubmit}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit" className="checkout-btn">
                {authMode === "signin" ? "Sign In" : "Register"}
              </button>
            </form>
            <p>
              {authMode === "signin" ? (
                <>
                  New user?{" "}
                  <span onClick={() => setAuthMode("register")} className="link">
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span onClick={() => setAuthMode("signin")} className="link">
                    Sign In
                  </span>
                </>
              )}
            </p>
            <button className="close-btn" onClick={() => setShowAuth(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 Styles
const navBtn = {
  backgroundColor: "white",
  color: "#2874f0",
  border: "none",
  padding: "8px 16px",
  borderRadius: "5px",
  fontWeight: "500",
  cursor: "pointer",
};

const filterStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #2874f0",
  fontSize: "14px",
  color: "#172337",
  fontWeight: "500",
};

const btn = {
  backgroundColor: "#2874f0",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const footerStyle = {
  textAlign: "center",
  padding: "20px",
  backgroundColor: "#172337",
  color: "white",
  fontSize: "14px",
};

const productCard = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease",
};

export default App;
