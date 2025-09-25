import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config(); 
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // optionally, if using Vertex AI, you might add vertexai, project, location options
  // vertexai: true,
  // project: process.env.GOOGLE_CLOUD_PROJECT,
  // location: process.env.GOOGLE_CLOUD_LOCATION,
});

app.post("/generate-text", async (req, res) => {
  try {
    const userMsg = req.body.prompt;
    if (!userMsg) {
      return res.status(400).json({ reply: "Prompt is required" });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",  // or another model name supported
      contents: [
        {
          parts: [
            { text: userMsg }
          ]
        }
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      }
    });

    const replyText = result.text;  // the SDK returns `.text` property
    return res.json({ reply: replyText });
  } catch (err) {
    console.error("GenAI Error:", err);
    // handle specific error cases, e.g. invalid arguments
    if (err.status === 400) {
      return res.status(400).json({ reply: "Bad request to Gemini API" });
    }
    res.status(500).json({ reply: "Internal Server Error" });
  }
});

// Weather API route
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city || "Delhi"; // default city
    const apiKey = process.env.API_KEY;

    // OpenWeatherMap API call
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = response.data;

    // Send simplified response
    res.json({
      city: data.name,
      temp: `${data.main.temp}°C`,
      condition: data.weather[0].description,
    });
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
