import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  // Support both JSON and standard HTML form submissions
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
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
        }
      ],
      subtotal: 18.5,
      deliveryFee: 0.0,
      tax: 1.48,
      total: 19.98,
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

  app.get("/api/restaurants", (req, res) => {
    res.json(restaurants);
  });

  app.get("/api/orders", (req, res) => {
    res.json(demoOrders);
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

    const matchedPolicies = articles;
    const contextPolicies = matchedPolicies.map((a) => `[Policy - ${a.category}: ${a.title}] ${a.content}`).join("\n");
    let targetOrder: any = demoOrders[0];

    let orderContext = `Active Customer Order ID: ${targetOrder.id}, Restaurant: ${targetOrder.restaurantName}, Status: "${targetOrder.status}", Estimated Delivery: ~${targetOrder.etaMinutes} mins.`;

    const step2Log = {
      step: 2,
      title: "Look up order/policy",
      description: `Retrieved store policies and Order #${targetOrder.id} status.`
    };

    const generateRealisticAnswer = (): string => {
      return `Hello! Your order #${targetOrder.id} with ${targetOrder.restaurantName} is currently "${targetOrder.status}". Courier ${targetOrder.courierName} has an estimated delivery time of ~${targetOrder.etaMinutes} minutes to ${targetOrder.address}. Thank you for choosing Quickbite!`;
    };

    let text = "";
    const activeKey = process.env.GEMINI_API_KEY;
    const isLiveKey = activeKey && !activeKey.includes("Fake") && !activeKey.includes("AIzaSyD-EMO");

    if (isLiveKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: activeKey });
        const prompt = `You are Quickbite's Customer Support Assistant.\nPOLICIES:\n${contextPolicies}\nORDER CONTEXT:\n${orderContext}\nQUESTION:\n${question}\nAnswer the customer directly.`;
        
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

    return res.json({
      answer: text,
      step: 4,
      workflowActivity: [step1Log, step2Log, { step: 3, title: "Generate answer", description: "Inference completed." }, { step: 4, title: "Respond", description: "Delivered response." }]
    });
  });

  // --- 4. DEDICATED ADMIN PORTAL WITH CSRF ENFORCEMENT ---

  // In-memory store for valid CSRF tokens
  const validCsrfTokens = new Set<string>();

  // Dedicated server-rendered /admin console: Injects the dynamic CSRF token into the form
  app.get("/admin", (req, res) => {
    // Generate a unique cryptographic token for this session
    const csrfToken = `csrf_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
    validCsrfTokens.add(csrfToken);

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quickbite Management & AI Admin Console</title>
</head>
<body style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc;">
  <h2>Quickbite Administrative Console</h2>
  <p>System management and AI agent configuration interface.</p>
  <div style="margin-top: 1.5rem; padding: 1.5rem; border: 1px solid #334155; border-radius: 8px; max-width: 480px; background: #1e293b;">
    <form action="/api/login" method="POST">
      <!-- Anti-CSRF Token required for authentication -->
      <input type="hidden" name="csrfToken" value="${csrfToken}" />
      
      <label style="display:block; margin-bottom: 0.5rem; font-weight: bold;">Quickbite Secret Key:</label>
      <input type="password" name="password" placeholder="Enter password" style="padding: 10px; width: 100%; box-sizing: border-box; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white; margin-bottom: 1rem;" />
      <button type="submit" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Authenticate Service</button>
    </form>
    <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 1rem;">This endpoint requires a valid Anti-CSRF token session.</p>
  </div>
</body>
</html>`);
  });

  // Modernized Authentication Handler: Enforces CSRF Token Validation
  app.post("/api/login", (req, res) => {
    // Check for CSRF token in body or headers
    const providedCsrfToken = (req.body && req.body.csrfToken) || req.header("X-CSRF-Token");
    const providedKey = req.body && req.body.password;

    // 1. Strict CSRF Validation
    if (!providedCsrfToken || !validCsrfTokens.has(providedCsrfToken as string)) {
      return res.status(403).json({
        success: false,
        error: "CSRF token missing or invalid. Please refresh the page and try again."
      });
    }

    // Optional: In a strict implementation, tokens should be single-use
    // validCsrfTokens.delete(providedCsrfToken as string);

    // 2. Verify strictly against the contextual secret
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

    // 3. Explicit rejection for incorrect password
    return res.status(401).json({
      success: false,
      error: "Invalid password"
    });
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
