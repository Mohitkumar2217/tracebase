import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate-text", async (req, res) => {
  try {
    const userMsg = req.body.prompt;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", content: userMsg }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ reply: "Internal Server Error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
