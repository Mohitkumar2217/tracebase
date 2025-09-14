
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Redirect route to VendorVerse
app.get('/vendorverse', (req, res) => {
  // Replace the URL below with your actual VendorVerse deployment URL
  res.redirect('https://your-vendor-verse-url.com');
});

// Simple Chatbot Endpoint (mocked, ready for AI integration)
app.post('/api/chat', express.json(), (req, res) => {
  const userMessage = req.body.message || '';
  // Simulate a smart reply (replace with real AI call when ready)
  let reply = "Sorry, I didn't understand that.";
  if (/weather|rain|temperature/i.test(userMessage)) {
    reply = "Today's weather is sunny with a high of 28°C.";
  } else if (/price|market/i.test(userMessage)) {
    reply = "Wheat: ₹2000/quintal, Rice: ₹2500/quintal, Maize: ₹1800/quintal.";
  } else if (/hello|hi|namaste/i.test(userMessage)) {
    reply = "Hello! How can I help you with your farming needs today?";
  } else if (/disease|pest/i.test(userMessage)) {
    reply = "If you suspect a disease, try scanning a photo of your crop for analysis.";
  }
  res.json({ reply });
});


// AI-Powered Product Analysis (Mocked, ready for real API integration)
app.post('/api/scan', upload.single('image'), async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
  const product = req.body.product || 'Unknown';

  // --- AI API Integration Placeholder ---
  // To use a real AI API (OpenAI Vision, Google Vision, etc):
  // 1. Get your API key and install the required SDK (e.g., openai, @google-cloud/vision)
  // 2. Replace the mockResult below with a real API call
  // 3. Pass req.file.buffer as the image data
  // Example (OpenAI):
  // const openai = require('openai');
  // const result = await openai.createImageAnalysis({ image: req.file.buffer, ... });
  // return res.json(result.data);

  // Mock AI analysis result
  const mockResult = {
    product,
    aiAnalysis: {
      detectedClass: 'Wheat',
      quality: 'A',
      disease: 'None',
      confidence: 0.98,
      notes: 'Healthy wheat, no visible disease or pest.'
    },
    safeToUse: true,
    message: `AI analysis: This product (${product}) is healthy and safe to use.`
  };
  res.json(mockResult);
});

// Simulate weather data
app.get('/api/weather', (req, res) => {
  res.json({
    location: "Your Farm",
    temperature: "28°C",
    condition: "Partly Cloudy",
    prediction: "No rain expected today."
  });
});

// Simulate market price data
app.get('/api/market', (req, res) => {
  res.json([
    { product: "Wheat", price: "₹2000/quintal" },
    { product: "Rice", price: "₹2500/quintal" },
    { product: "Maize", price: "₹1800/quintal" }
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});