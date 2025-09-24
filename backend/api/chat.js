// api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { messages } = req.body;
  if (!messages) {
    res.status(400).json({ error: "No messages provided" });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    res.status(200).json({ reply: response.choices[0].message });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Failed to fetch chatbot response" });
  }
}
