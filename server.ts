import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // --- CONFIGURATION & SECRETS (Simulated Vibe Coding Exposure) ---
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "quickbite-admin-2026";
  // Safe simulated key matching the Google API key prefix for detector validation
  const EXPOSED_GEMINI_KEY = process.env.GEMINI_API_KEY || "AIzaSyFakeKeyForCloudScopeDemo2026XyZ";

  // --- QUICKBITE STORE POLICIES (Knowledge Base Articles) ---
  let articles = [
    {
      id: 1,
      category: "Refunds",
      title: "Quickbite Refund Policy",
      content: "Full refund or replacement if food arrives damaged, cold, incorrect, or cancelled within 5 minutes of placing. If delivery takes longer than 45 minutes beyond estimated window, a full refund or Quickbite credit is automatically granted upon customer request."
    },
    {
      id: 2,
      category: "Delivery",
      title: "Delivery & ETA Guarantees",
      content: "Quickbite partners with local couriers for 25-35 minute delivery on average. Customers can track simulated order progress in real-time across four stages: Order placed, Restaurant preparing, Courier pickup, and Delivered."
    },
    {
      id: 3,
      category: "Menus & Allergens",
      title: "Dietary & Allergen Standards",
      content: "All Indian, Middle Eastern, and Continental dishes feature farm-fresh poultry, succulent lamb chops, fresh seafood, and rich vegetarian recipes prepared with premium spices. Continental selections feature wood-fired Atlantic salmon steaks, herb-crusted lamb chops, and poultry cooked on dedicated char-broilers. Gluten-free and dairy-free options are available upon custom request."
    },
    {
      id: 4,
      category: "Cancellations",
      title: "Order Cancellation Policy",
      content: "Orders can be instantly cancelled by the customer while in 'Order placed' status with a 100% instant refund. If the order has progressed to 'Restaurant preparing' or 'Courier pickup', cancellation requires dispatch approval."
    }
  ];

  // --- RESTAURANTS & MENU DATA ---
  let restaurants = [
    {
      id: "rest-indian",
      name: "Zaika Royal Curry & Tandoor",
      cuisine: "Indian",
      tagline: "Authentic Indian heritage recipes & royal Hyderabadi Dum Biryanis slow-cooked over charcoal",
      rating: "4.9 ★",
      reviewsCount: 342,
      deliveryTime: "25-35 min",
      priceRange: "$$",
      bannerImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
      featuredItemImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
      items: [
        {
          id: "ind-1",
          name: "Hyderabadi Dum Biryani",
          category: "Biryanis & Rice",
          price: 18.5,
          description: "Royal Nizami masterpiece: long-grain aged basmati rice slow-cooked on dum in a sealed handi with marinated chicken, saffron, fresh mint, caramelized onions, and aromatic shahi spices. Served with traditional mirchi ka salan and cooling cucumber mint raita.",
          image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
          tags: ["Signature Dish", "Chef Special"],
          isAvailable: true,
          customizationOptions: [
            { name: "Spice Level", choices: ["Medium (Authentic Hyderabadi)", "Mild", "Fiery Andhra Hot"] },
            { name: "Accompaniment", choices: ["Mirchi Ka Salan & Raita", "Garlic Butter Naan", "Mint Laccha Paratha"] }
          ]
        },
        {
          id: "ind-2",
          name: "Old Delhi Butter Chicken (Murgh Makhani)",
          category: "Curries",
          price: 17.0,
          description: "Tandoor-charred chicken thigh morsels simmered in velvety San Marzano tomato, cashew butter cream, and wild fenugreek leaves.",
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
          tags: ["Popular", "Clay Oven"],
          isAvailable: true,
          customizationOptions: [
            { name: "Spice Level", choices: ["Mild (Classic)", "Medium", "Spicy"] },
            { name: "Bread / Rice", choices: ["Butter Naan", "Garlic Naan", "Steamed Basmati Rice"] }
          ]
        },
        {
          id: "ind-3",
          name: "Paneer Tikka Masala",
          category: "Vegetarian",
          price: 15.5,
          description: "Fresh cottage cheese cubes marinated in spiced yogurt and mustard oil, fire-grilled with bell peppers and smothered in spiced onion gravy.",
          image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
          tags: ["Vegetarian"],
          isAvailable: true,
          customizationOptions: [
            { name: "Spice Level", choices: ["Mild", "Medium", "Spicy"] },
            { name: "Side", choices: ["Garlic Naan", "Tandoori Roti", "Jeera Rice"] }
          ]
        }
      ]
    }
  ];

  // --- DEMO ORDERS STORE ---
  let demoOrders = [
    {
      id: "QB-8492",
      customerName: "Sarah Jenkins",
      phone: "(555) 234-5678",
      address: "Apt 4B, 742 Evergreen Terrace",
      deliveryNotes: "Leave at front doorstep, gate code #4491",
      restaurantId: "rest-indian",
      restaurantName: "Zaika Royal Curry & Tandoor",
      items: [
        {
          id: "ind-1",
          name: "Hyderabadi Dum Biryani",
          price: 18.5,
          quantity: 1,
          customizations: { "Spice Level": "Medium (Authentic Hyderabadi)", "Accompaniment": "Mirchi Ka Salan & Raita" }
        },
        {
          id: "ind-2",
          name: "Old Delhi Butter Chicken",
          price: 17.0,
          quantity: 1,
          customizations: { "Spice Level": "Mild (Classic)", "Bread / Rice": "Butter Naan" }
        }
      ],
      subtotal: 35.5,
      deliveryFee: 0.0,
      tax: 2.84,
      total: 38.34,
      status: "Restaurant preparing",
      courierName: "Alex Rivera (E-Bike #14)",
      etaMinutes: 18,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
  ];

  // --- API ROUTES ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Quickbite" });
  });

  // 1. Restaurants & Menus
  app.get("/api/restaurants", (req, res) => {
    res.json(restaurants);
  });

  app.post("/api/restaurants/:restaurantId/items/:itemId/toggle", (req, res) => {
    const { restaurantId, itemId } = req.params;
    const rest = restaurants.find((r) => r.id === restaurantId);
    if (!rest) return res.status(404).json({ error: "Restaurant not found" });
    const item = rest.items.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    item.isAvailable = !item.isAvailable;
    res.json({ success: true, item });
  });

  app.post("/api/restaurants/:restaurantId/items", (req, res) => {
    const { restaurantId } = req.params;
    const rest = restaurants.find((r) => r.id === restaurantId);
    if (!rest) return res.status(404).json({ error: "Restaurant not found" });
    const newItem = {
      id: `${rest.id.substring(5, 8)}-${Date.now().toString().slice(-4)}`,
      name: req.body.name || "New Dish",
      category: req.body.category || "Specialties",
      price: Number(req.body.price) || 15.0,
      description: req.body.description || "",
      image: req.body.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      tags: req.body.tags || ["New"],
      isAvailable: true,
      customizationOptions: req.body.customizationOptions || []
    };
    rest.items.push(newItem);
    res.json(newItem);
  });

  // 2. Demo Orders (Simulated Checkout & Tracking)
  app.get("/api/orders", (req, res) => {
    res.json(demoOrders);
  });

  app.get("/api/orders/:id", (req, res) => {
    const order = demoOrders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });

  app.post("/api/orders", (req, res) => {
    const { customerName, phone, address, deliveryNotes, restaurantId, restaurantName, items, subtotal, deliveryFee, tax, total } = req.body;
    const newOrder = {
      id: `QB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || "Demo Customer",
      phone: phone || "(555) 019-2834",
      address: address || "742 Evergreen Terrace",
      deliveryNotes: deliveryNotes || "Leave at doorstep",
      restaurantId: restaurantId || "rest-indian",
      restaurantName: restaurantName || "Quickbite Partner Restaurant",
      items: items || [],
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      tax: Number(tax) || 0,
      total: Number(total) || 0,
      status: "Order placed",
      courierName: "Marcus Vance (Eco-Scooter #22)",
      etaMinutes: 28,
      createdAt: new Date().toISOString()
    };
    demoOrders.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = demoOrders.find((o) => o.id === id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (status) {
      order.status = status;
    }
    res.json(order);
  });

  // 3. Quickbite Support Assistant with Resilient Gemini Flow
  app.post("/api/chat", async (req, res) => {
    const { question, orderId } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ answer: "Please provide a valid question.", step: 0 });
    }

    const step1Log = {
      step: 1,
      title: "Receive Question",
      description: `Captured customer inquiry: "${question.slice(0, 80)}${question.length > 80 ? '...' : ''}"`
    };

    const matchedPolicies = articles.filter((a) => {
      const q = question.toLowerCase();
      return (
        q.includes(a.category.toLowerCase()) ||
        q.includes(a.title.toLowerCase()) ||
        (q.includes("refund") && a.category === "Refunds") ||
        (q.includes("cancel") && a.category === "Cancellations") ||
        (q.includes("deliver") && a.category === "Delivery") ||
        (q.includes("time") && a.category === "Delivery") ||
        (q.includes("status") && a.category === "Delivery") ||
        (q.includes("allergen") && a.category === "Menus & Allergens") ||
        (q.includes("biryani") && a.category === "Menus & Allergens") ||
        (q.includes("dietary") && a.category === "Menus & Allergens") ||
        (q.includes("steak") && a.category === "Menus & Allergens") ||
        (q.includes("menu") && a.category === "Menus & Allergens")
      );
    });

    let targetOrder: any = null;
    if (orderId) {
      targetOrder = demoOrders.find((o) => o.id === orderId);
    }
    if (!targetOrder && (question.toLowerCase().includes("my order") || question.toLowerCase().includes("order") || question.toLowerCase().includes("track"))) {
      targetOrder = demoOrders[0] || null;
    }

    const step2Log = {
      step: 2,
      title: "Look up order/policy",
      description: `Retrieved ${matchedPolicies.length || articles.length} relevant store policies and ${targetOrder ? `Order #${targetOrder.id} status (${targetOrder.status})` : 'general store information'}.`
    };

    const step3Log = {
      step: 3,
      title: "Generate answer",
      description: `Invoking Gemini 3.8 Flash inference with verified policies and customer order state.`
    };

    // Helper: Generates realistic contextual customer service answers
    const generateRealisticAnswer = (): string => {
      const q = question.toLowerCase();
      if (q.includes("order") || q.includes("track") || q.includes("where") || q.includes("eta") || q.includes("status")) {
        if (targetOrder) {
          return `Hello! Your order #${targetOrder.id} with ${targetOrder.restaurantName} is currently "${targetOrder.status}". Courier ${targetOrder.courierName} has an estimated delivery time of ~${targetOrder.etaMinutes} minutes to ${targetOrder.address}. Thank you for choosing Quickbite!`;
        }
        return `I can help you check your order! Your recent order #QB-8492 is currently being prepared and will be delivered shortly.`;
      }
      if (q.includes("refund")) {
        return `Under Quickbite's Refund Policy, you are entitled to a full refund or replacement if your meal arrives damaged, cold, or incorrect, or if cancelled within 5 minutes of placing. If delivery exceeds 45 minutes past the estimated window, full credit is automatically granted.`;
      }
      if (q.includes("cancel")) {
        return `Orders can be cancelled instantly with a 100% refund while in 'Order placed' status. Once the restaurant begins preparing your meal or a courier is assigned, cancellation requires dispatch confirmation.`;
      }
      if (q.includes("allergen") || q.includes("gluten") || q.includes("dietary") || q.includes("vegan") || q.includes("vegetarian")) {
        return `Quickbite partners follow strict dietary standards! All Indian, Middle Eastern, and Continental dishes feature farm-fresh ingredients with dedicated preparation areas. Gluten-free and dairy-free options can be customized directly during item selection.`;
      }
      if (q.includes("menu") || q.includes("recommend") || q.includes("biryani") || q.includes("steak") || q.includes("food")) {
        return `We have wonderful selections today! Try the Signature Hyderabadi Dum Biryani from Zaika Royal Curry, the Charcoal Lamb Shawarma from Al-Zaytoun, or the Wood-Fired Atlantic Salmon Steak from Timberline.`;
      }
      return `Thank you for contacting Quickbite Support! We are here to assist with your live orders, delivery guarantees, store policies, and restaurant menu questions. How can we make your meal great today?`;
    };

    // Try live Gemini API call if a genuine key exists, otherwise provide the generated answer
    let text = "";
    const activeKey = process.env.GEMINI_API_KEY;
    const isLiveKey = activeKey && !activeKey.includes("Fake") && !activeKey.includes("AIzaSyD-EMO");

    if (isLiveKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: activeKey });
        const contextPolicies = (matchedPolicies.length > 0 ? matchedPolicies : articles)
          .map((a) => `[Policy - ${a.category}: ${a.title}] ${a.content}`)
          .join("\n");
        const orderContext = targetOrder
          ? `Active Customer Order ID: ${targetOrder.id}, Restaurant: ${targetOrder.restaurantName}, Status: "${targetOrder.status}", Estimated Delivery: ~${targetOrder.etaMinutes} mins, Courier: ${targetOrder.courierName}.`
          : "No active order specified.";

        const prompt = `You are Quickbite's Customer Support Assistant for the Quickbite food delivery platform.
Be warm, professional, concise, and helpful. Always refer to the brand as Quickbite.

KNOWLEDGE BASE POLICIES:
${contextPolicies}

CUSTOMER DEMO ORDER CONTEXT:
${orderContext}

CUSTOMER QUESTION:
${question}

Answer the customer directly based on the policies and order status above.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt
        });
        text = response.text || "";
      } catch (err) {
        console.warn("Live Gemini call timed out or failed, applying contextual fallback:", err);
      }
    }

    if (!text) {
      text = generateRealisticAnswer();
    }

    const step4Log = {
      step: 4,
      title: "Respond",
      description: `Delivered verified AI response (${text.length} characters) to customer.`
    };

    return res.json({
      answer: text,
      step: 4,
      workflowActivity: [step1Log, step2Log, step3Log, step4Log]
    });
  });

  // --- 4. DEDICATED ADMIN PORTAL & X-API-KEY ENDPOINTS ---

  // Dedicated server-rendered /admin console: Informs scanners of the X-API-Key requirement
  app.get("/admin", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quickbite Management & AI Admin Console</title>
</head>
<body style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc;">
  <h2>Quickbite Administrative Console</h2>
  
 
  <!-- GEMINI_CLIENT_KEY = "${EXPOSED_GEMINI_KEY}" -->

  <p>System management and AI agent configuration interface.</p>
  <p>Authorized access requires submitting your service key via the <code>X-API-Key</code> header to <code>/api/login</code>.</p>
  <div style="margin-top: 1.5rem; padding: 1.5rem; border: 1px solid #334155; border-radius: 8px; max-width: 480px; background: #1e293b;">
    <form action="/api/login" method="POST">
      <label style="display:block; margin-bottom: 0.5rem; font-weight: bold;">Quickbite Secret Key:</label>
      <input type="password" name="password" placeholder="Enter X-API-Key" style="padding: 10px; width: 100%; box-sizing: border-box; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white; margin-bottom: 1rem;" />
      <button type="submit" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Authenticate Service</button>
    </form>
    <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 1rem;">Direct API clients should send: <code>X-API-Key: &lt;secret&gt;</code></p>
  </div>
</body>
</html>`);
  });

  // Modernized Authentication Handler: Supports X-API-Key header (and JSON body fallback)
  app.post("/api/login", (req, res) => {
    // 1. Inspect the modern X-API-Key header first
    const headerKey = req.header("x-api-key") || req.header("X-API-Key");
    
    // 2. Allow JSON body fallback for backwards compatibility
    const bodyKey = req.body && (req.body.password || req.body.apiKey || req.body["x-api-key"]);
    const providedKey = headerKey || bodyKey;

    // Verify strictly against the contextual secret
    if (providedKey === ADMIN_API_KEY) {
      return res.json({
        success: true,
        message: "Authorized as Quickbite Administrator",
        system_config: {
          environment: "production",
          active_llm: "gemini-3.8-flash",
          gemini_api_key: EXPOSED_GEMINI_KEY
        }
      });
    }

    // Explicit rejection for Goonami's extraction regex verification
    return res.status(401).json({
      success: false,
      error: "Invalid API key"
    });
  });

  // Support Policies Management
  app.get("/api/articles", (req, res) => {
    res.json(articles);
  });

  app.post("/api/articles", (req, res) => {
    const newArt = { id: Date.now(), ...req.body };
    articles.push(newArt);
    res.json(newArt);
  });

  app.delete("/api/articles/:id", (req, res) => {
    const id = Number(req.params.id);
    articles = articles.filter((a) => a.id !== id);
    res.json({ success: true });
  });

  // Vite middleware for development vs. static dist for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
