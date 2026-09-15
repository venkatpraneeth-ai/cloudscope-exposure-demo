const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURATION ---
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Fictional Database
let articles = [
  { id: 1, category: "Shipping", title: "Shipping Times", content: "Standard: 3-5 days. Express: 1-2 days." },
  { id: 2, category: "Returns", title: "30-Day Policy", content: "Items must be unused and in original packaging." }
];

// --- ROUTES ---

// 1. Ask Question (The AI Logic)
app.post('/api/chat', async (req, res) => {
  const { question } = req.body;
  
  // Step 2: Search local articles for context
  const context = articles
    .filter(a => question.toLowerCase().includes(a.category.toLowerCase()))
    .map(a => a.content).join(" ");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are Cloudscope Support. Use this context: ${context}. Answer: ${question}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ answer: response.text(), step: 4 });
  } catch (error) {
    res.status(500).json({ answer: "AI Error: Check API Key.", step: 0 });
  }
});

// 2. Admin Logic
app.post('/api/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) res.json({ success: true });
  else res.status(401).json({ success: false });
});

app.get('/api/articles', (req, res) => res.json(articles));
app.post('/api/articles', (req, res) => {
  const newArt = { id: Date.now(), ...req.body };
  articles.push(newArt);
  res.json(newArt);
});

// Serve static React files in production
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build/index.html')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));