import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant for farmers." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await resp.json();
      setMessages([...newMessages, data.reply]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">🌾 Kissan Chatbot</h3>
      <div className="h-64 overflow-y-auto border p-2 mb-2 rounded">
        {messages.filter(m => m.role !== "system").map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
            <p className={m.role === "user" ? "bg-green-100 inline-block p-1 m-1 rounded" : "bg-gray-100 inline-block p-1 m-1 rounded"}>
              <strong>{m.role === "user" ? "You" : "Bot"}:</strong> {m.content}
            </p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Ask about crops..."
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-2 bg-green-600 text-white px-3 py-1 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
