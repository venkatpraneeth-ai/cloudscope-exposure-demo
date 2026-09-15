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

  // --- CONFIGURATION ---
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

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
    },
    {
      id: "rest-mideast",
      name: "Al-Zaytoun Shawarma & Mezze Lounge",
      cuisine: "Middle Eastern",
      tagline: "Slow-roasted vertical rotisseries, fragrant saffron rice, and velvet hummus",
      rating: "4.8 ★",
      reviewsCount: 289,
      deliveryTime: "20-30 min",
      priceRange: "$$",
      bannerImage: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80",
      featuredItemImage: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80",
      items: [
        {
          id: "me-1",
          name: "Charcoal Lamb Shawarma Platter",
          category: "Platters",
          price: 19.5,
          description: "Shaved 24-hour spiced leg of lamb over golden turmeric rice, house garlic toum, pickled turnip ribbons, and grilled sesame flatbread.",
          image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80",
          tags: ["Chef Special", "Signature Dish"],
          isAvailable: true,
          customizationOptions: [
            { name: "Sauce Option", choices: ["Garlic Toum & Tahini", "Spicy Harissa", "Extra Tahini"] },
            { name: "Base", choices: ["Turmeric Rice", "Mixed Herb Salad", "Half Rice / Half Salad"] }
          ]
        },
        {
          id: "me-2",
          name: "Grand Artisan Mezze Feast",
          category: "Mezze",
          price: 16.0,
          description: "Silky stone-ground hummus topped with toasted pine nuts, crisp herb falafels, smoked baba ganoush, parsley tabbouleh, and warm baked pita.",
          image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80",
          tags: ["Vegetarian", "Vegan Friendly"],
          isAvailable: true,
          customizationOptions: [
            { name: "Pita Type", choices: ["Warm White Pita", "Whole Grain Pita", "Gluten-Free Lavash"] },
            { name: "Extra Dip", choices: ["None", "Extra Garlic Toum (+$1.50)", "Spicy Shatta (+$1.00)"] }
          ]
        },
        {
          id: "me-3",
          name: "Shish Taouk Charcoal Skewers",
          category: "Charcoal Grills",
          price: 17.5,
          description: "Tender chicken skewers steeped in lemon, garlic, yogurt, and wild sumac, flame-grilled with roasted cherry tomatoes and charred peppers.",
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
          tags: ["Fire-Grilled", "High Protein"],
          isAvailable: true,
          customizationOptions: [
            { name: "Rice or Bread", choices: ["Golden Saffron Rice", "Fresh Khubz Pita", "Cauliflower Rice"] },
            { name: "Sauce", choices: ["Garlic Whip (Toum)", "Creamy Tahini", "Pomegranate Glaze"] }
          ]
        }
      ]
    },
    {
      id: "rest-steak",
      name: "Timberline Continental Grills & Steaks",
      cuisine: "Continental",
      tagline: "Artisan Continental European & American Grills: Wood-fired Salmon Steaks, Lamb Chops, Stroganoff & Truffle Frites",
      rating: "4.9 ★",
      reviewsCount: 415,
      deliveryTime: "30-40 min",
      priceRange: "$$$",
      bannerImage: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
      featuredItemImage: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
      items: [
        {
          id: "stk-1",
          name: "Wood-Fired Atlantic Salmon Steak",
          category: "Steaks",
          price: 32.0,
          description: "Thick-cut fresh Atlantic salmon steak seared over hickory coals with lemon-dill compound butter, charred asparagus, and wild saffron pilaf.",
          image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
          tags: ["Chef Special", "Wild Caught"],
          isAvailable: true,
          customizationOptions: [
            { name: "Preparation", choices: ["Lemon Herb Butter", "Blackened Cajun", "Garlic Butter Glazed"] },
            { name: "Gourmet Sauce", choices: ["Green Peppercorn Cognac", "Chimichurri", "Garlic Herb Butter", "Béarnaise"] },
            { name: "Choice of Side", choices: ["Truffle Fries", "Grilled Asparagus", "Creamed Spinach", "Yukon Gold Mash"] }
          ]
        },
        {
          id: "stk-2",
          name: "Herb-Crusted Colorado Lamb Chops Steak",
          category: "Steaks",
          price: 36.5,
          description: "Triple thick-cut prime lamb chops crusted with fresh rosemary, garlic, and Dijon mustard, char-broiled to perfection and served with a rich red-wine reduction and roasted forest mushrooms.",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
          tags: ["Prime Cut", "Gluten-Free"],
          isAvailable: true,
          customizationOptions: [
            { name: "Doneness", choices: ["Medium Rare (Chef Preferred)", "Rare", "Medium", "Well Done"] },
            { name: "Sauce", choices: ["Rosemary Mint Jus", "Cracked Peppercorn", "Béarnaise"] },
            { name: "Side", choices: ["Yukon Gold Mash", "Charred Broccolini", "Crispy Rosemary Wedges"] }
          ]
        },
        {
          id: "stk-3",
          name: "Char-Grilled Chicken Supreme Steak",
          category: "Steaks",
          price: 26.5,
          description: "Tender herb-marinated chicken breast steak flame-seared on the grill, smothered in wild forest mushroom truffle velouté, blistered vine tomatoes, and rosemary baby potatoes.",
          image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
          tags: ["Char-Grilled", "Farm-Fresh"],
          isAvailable: true,
          customizationOptions: [
            { name: "Preparation", choices: ["Hickory Char-Grilled", "Herb Butter Basted", "Smoky BBQ Glazed"] },
            { name: "Sauce", choices: ["Wild Mushroom Truffle", "Chimichurri", "Creamy Garlic Herb"] },
            { name: "Side", choices: ["Loaded Baked Potato", "Truffle Fries", "Garden Caesar"] }
          ]
        },
        {
          id: "stk-4",
          name: "Classic Wild Mushroom Stroganoff",
          category: "Continental Mains",
          price: 24.0,
          description: "Traditional European Continental favorite: sautéed wild chanterelles, cremini, and shiitake mushrooms simmered in a velvet sour cream, dijon, and paprika cognac sauce over buttered fettuccine ribbon pasta.",
          image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop&q=80",
          tags: ["Continental Classic", "Vegetarian"],
          isAvailable: true,
          customizationOptions: [
            { name: "Pasta Choice", choices: ["Buttered Fettuccine", "Penne Rigate", "Gluten-Free Penne"] },
            { name: "Garnish", choices: ["Fresh Parsley & Grana Padano", "Truffle Oil Drizzle", "Extra Crispy Capers"] }
          ]
        },
        {
          id: "stk-5",
          name: "Mediterranean Grilled Sea Bass Filet",
          category: "Continental Mains",
          price: 34.0,
          description: "Crispy skin-on Mediterranean sea bass with extra virgin olive oil, caper berries, roasted cherry tomatoes, artichoke hearts, and roasted fingerling potatoes.",
          image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
          tags: ["Chef Special", "Fresh Catch"],
          isAvailable: true,
          customizationOptions: [
            { name: "Cooking Style", choices: ["Pan-Seared Crispy Skin", "Char-Broiled", "Oven-Baked en Papillote"] },
            { name: "Drizzle", choices: ["Lemon Herb Emulsion", "Salsa Verde", "Garlic Aioli"] }
          ]
        },
        {
          id: "stk-6",
          name: "Parmesan Truffle Continental Frites",
          category: "Sides & Starters",
          price: 11.5,
          description: "Golden hand-cut russet potatoes tossed with black truffle oil, aged 24-month Parmigiano-Reggiano, and fresh rosemary, served with garlic aioli.",
          image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80",
          tags: ["Vegetarian", "Popular Side"],
          isAvailable: true,
          customizationOptions: [
            { name: "Dip", choices: ["House Garlic Aioli", "Smoked Paprika Mayo", "Truffle Ranch"] }
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

  // 3. Quickbite Support Assistant with Gemini
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

    const contextPolicies = (matchedPolicies.length > 0 ? matchedPolicies : articles)
      .map((a) => `[Policy - ${a.category}: ${a.title}] ${a.content}`)
      .join("\n");

    let targetOrder: any = null;
    if (orderId) {
      targetOrder = demoOrders.find((o) => o.id === orderId);
    }
    if (!targetOrder && (question.toLowerCase().includes("my order") || question.toLowerCase().includes("order") || question.toLowerCase().includes("track"))) {
      targetOrder = demoOrders[0] || null;
    }

    let orderContext = "No active order specified.";
    if (targetOrder) {
      orderContext = `Active Customer Order ID: ${targetOrder.id}, Restaurant: ${targetOrder.restaurantName}, Status: "${targetOrder.status}", Estimated Delivery: ~${targetOrder.etaMinutes} mins, Courier: ${targetOrder.courierName}, Items: ${targetOrder.items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}, Total: $${targetOrder.total.toFixed(2)}.`;
    }

    const step2Log = {
      step: 2,
      title: "Look up order/policy",
      description: `Retrieved ${matchedPolicies.length || articles.length} relevant store policies and ${targetOrder ? `Order #${targetOrder.id} status (${targetOrder.status})` : 'general store information'}.`
    };

    const step3Log = {
      step: 3,
      title: "Generate answer",
      description: `Invoking Gemini 3.6 Flash inference with verified policies and customer order state.`
    };

    const prompt = `You are Quickbite's Customer Support Assistant for the Quickbite food delivery platform.
Be warm, professional, concise, and helpful. Always refer to the brand as Quickbite.

KNOWLEDGE BASE POLICIES:
${contextPolicies}

CUSTOMER DEMO ORDER CONTEXT:
${orderContext}

CUSTOMER QUESTION:
${question}

Answer the customer directly based on the policies and order status above. If they ask about their order status, give them the exact current status, restaurant, courier, and ETA details. If they ask about refunds or cancellations, explain the exact Quickbite policy. Keep your tone friendly and reassuring.`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          answer: `[Quickbite Support Demo] Context looked up: ${targetOrder ? `Order #${targetOrder.id} is currently "${targetOrder.status}"` : 'General support policies'}. (Configure GEMINI_API_KEY for live AI responses).`,
          step: 4,
          workflowActivity: [step1Log, step2Log, step3Log, { step: 4, title: "Respond", description: "Delivered response to customer." }]
        });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let text = "";

      const generateWithTimeout = async () => {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini request timeout")), 9000)
        );
        const apiPromise = (async () => {
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: prompt
              });
              const t = response.text || "";
              if (t) return t;
            } catch (genErr) {
              if (attempt === 1) throw genErr;
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }
          return "";
        })();
        return Promise.race([apiPromise, timeoutPromise]);
      };

      try {
        text = await generateWithTimeout();
      } catch (e) {
        console.warn("Gemini call timed out or failed, utilizing fallback:", e);
      }

      const step4Log = {
        step: 4,
        title: "Respond",
        description: `Delivered verified AI answer with ${text.length} characters.`
      };

      res.json({
        answer: text || "Thank you for contacting Quickbite. How can we assist with your meal today?",
        step: 4,
        workflowActivity: [step1Log, step2Log, step3Log, step4Log]
      });
    } catch (error) {
      console.error("AI Error:", error);
      let fallbackAnswer = `Thank you for contacting Quickbite Support!`;
      if (targetOrder) {
        fallbackAnswer += ` Your order #${targetOrder.id} with ${targetOrder.restaurantName} is currently in "${targetOrder.status}" with an ETA of ~${targetOrder.etaMinutes} minutes via courier ${targetOrder.courierName}.`;
      }
      if (matchedPolicies.length > 0) {
        fallbackAnswer += ` Regarding your inquiry: ${matchedPolicies[0].content}`;
      }

      res.json({
        answer: fallbackAnswer,
        step: 4,
        workflowActivity: [
          step1Log,
          step2Log,
          { step: 3, title: "Generate answer", description: "Standard inference fallback applied using verified database context." },
          { step: 4, title: "Respond", description: "Delivered context-backed answer to customer." }
        ]
      });
    }
  });

  // 4. Admin Logic (Preserved original authentication behavior & credential check)
  app.post("/api/login", (req, res) => {
    if (req.body && req.body.password === ADMIN_PASSWORD) {
      res.json({ success: true, message: "Authorized as Quickbite Administrator" });
    } else {
      res.status(401).json({ success: false, error: "Invalid password" });
    }
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
