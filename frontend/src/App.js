import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  // Multilingual Support
  const [language, setLanguage] = useState("en");
  const translations = {
    en: {
      scanProduct: "Scan Product",
      enterProduct: "Enter product name",
      speakProduct: "Speak product name",
      uploadScan: "Upload/Scan Crop Photo",
      diseasePest: "Disease & Pest Detection",
      healthy: "Healthy",
      diseaseDetected: "Disease Detected",
      pestDetected: "Pest Detected",
      analyzing: "Analyzing image...",
      cropCalendar: "Crop Calendar",
      selectCrop: "Select Crop:",
      keyDates: "Key Dates:",
      weatherPrediction: "Weather Prediction",
      marketPrices: "Market Prices",
      chatbot: "AgriScan Chatbot",
      askAnything: "Ask me anything about farming, weather, or market prices!",
      send: "Send",
      close: "Close",
    },
    hi: {
      scanProduct: "उत्पाद स्कैन करें",
      enterProduct: "उत्पाद का नाम दर्ज करें",
      speakProduct: "बोलें उत्पाद का नाम",
      uploadScan: "फसल फोटो अपलोड/スキャン करें",
      diseasePest: "रोग और कीट पहचान",
      healthy: "स्वस्थ",
      diseaseDetected: "रोग पाया गया",
      pestDetected: "कीट पाया गया",
      analyzing: "छवि का विश्लेषण हो रहा है...",
      cropCalendar: "फसल कैलेंडर",
      selectCrop: "फसल चुनें:",
      keyDates: "मुख्य तिथियाँ:",
      weatherPrediction: "मौसम पूर्वानुमान",
      marketPrices: "बाजार मूल्य",
      chatbot: "एग्रीスキャン चैटबॉट",
      askAnything: "खेती, मौसम या बाजार के बारे में कुछ भी पूछें!",
      send: "भेजें",
      close: "बंद करें",
    },
    ta: {
      scanProduct: "பயிர் ஸ்கேன்",
      enterProduct: "பயிர் பெயரை உள்ளிடவும்",
      speakProduct: "பயிர் பெயரை பேசவும்",
      uploadScan: "பயிர் புகைப்படம் பதிவேற்ற/ஸ்கேன்",
      diseasePest: "நோய் மற்றும் பூச்சி கண்டறிதல்",
      healthy: "ஆரோக்கியம்",
      diseaseDetected: "நோய் கண்டறியப்பட்டது",
      pestDetected: "பூச்சி கண்டறியப்பட்டது",
      analyzing: "படம் பகுப்பாய்வு செய்யப்படுகிறது...",
      cropCalendar: "பயிர் நாட்காட்டி",
      selectCrop: "பயிர் தேர்வு:",
      keyDates: "முக்கிய தேதிகள்:",
      weatherPrediction: "வானிலை முன்னறிவு",
      marketPrices: "சந்தை விலை",
      chatbot: "AgriScan உரையாடல்",
      askAnything: "விவசாயம், வானிலை, சந்தை பற்றி ஏதேனும் கேளுங்கள்!",
      send: "அனுப்பு",
      close: "மூடு",
    },
  };
  
  // New state for QR scanning
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Function to start the camera scanner
  const startCameraScanner = async () => {
    try {
      setShowScanner(true);
      setScannedCode(null);
      
      // Check if browser supports camera access
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not supported in this browser");
        setShowScanner(false);
        return;
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Start scanning for QR codes
      scanForQRCodes();
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
      setShowScanner(false);
    }
  };

  // Function to scan for QR codes
  const scanForQRCodes = async () => {
    if (!videoRef.current || !streamRef.current) return;
    
    // Check if BarcodeDetector API is available
    if (!window.BarcodeDetector) {
      alert("QR scanning not supported in this browser");
      stopCameraScanner();
      return;
    }
    
    try {
      // Get supported formats
      const formats = await window.BarcodeDetector.getSupportedFormats();
      if (!formats.includes('qr_code')) {
        alert("QR code scanning not supported");
        stopCameraScanner();
        return;
      }
      
      // Create detector
      const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      
      // Scan interval
      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState !== 4) return;
        
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const detectedText = barcodes[0].rawValue;
            setScannedCode(detectedText);
            clearInterval(scanIntervalRef.current);
            stopCameraScanner();
            
            // Process the scanned code
            handleScannedCode(detectedText);
          }
        } catch (err) {
          console.error("Error detecting barcode:", err);
        }
      }, 500);
      
    } catch (error) {
      console.error("Error setting up QR scanner:", error);
      stopCameraScanner();
    }
  };

  // Function to stop the camera scanner
  const stopCameraScanner = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowScanner(false);
  };

  // Function to handle the scanned code
  const handleScannedCode = (code) => {
    // Check if it looks like a URL
    const looksLikeURL = (text) => {
      try {
        const url = new URL(text);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch (e) {
        return /^https?:\/\//i.test(text) || /^www\./i.test(text);
      }
    };
    
    if (looksLikeURL(code)) {
      // If it's a URL, navigate to it
      window.open(code, '_blank');
    } else {
      // Otherwise, treat it as product information
      setProduct(code);
    }
  };

  // Disease & Pest Detection State
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);

  // Mock AI detection handler
  const handleDiseaseImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDiseaseLoading(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      // Randomly pick a result
      const results = [
        {
          status: "Healthy",
          color: "#388e3c",
          message: "No disease or pest detected.",
        },
        {
          status: "Disease Detected",
          color: "#d32f2f",
          message:
            "Leaf blight detected. Suggest: Remove affected leaves and use recommended fungicide.",
        },
        {
          status: "Pest Detected",
          color: "#fbc02d",
          message: "Aphid infestation detected. Suggest: Use neem oil spray.",
        },
      ];
      const result = results[Math.floor(Math.random() * results.length)];
      setDiseaseResult(result);
      setDiseaseLoading(false);
    }, 1500);
  };
  
  // Crop Calendar State
  const cropOptions = [
    {
      name: "Wheat",
      calendar: [
        { stage: "Sowing", date: "Nov 10" },
        { stage: "Irrigation", date: "Dec 1" },
        { stage: "Fertilization", date: "Dec 20" },
        { stage: "Harvesting", date: "Mar 25" },
      ],
    },
    {
      name: "Rice",
      calendar: [
        { stage: "Sowing", date: "June 15" },
        { stage: "Irrigation", date: "July 5" },
        { stage: "Fertilization", date: "July 25" },
        { stage: "Harvesting", date: "Oct 10" },
      ],
    },
    {
      name: "Maize",
      calendar: [
        { stage: "Sowing", date: "July 1" },
        { stage: "Irrigation", date: "July 20" },
        { stage: "Fertilization", date: "Aug 10" },
        { stage: "Harvesting", date: "Oct 5" },
      ],
    },
  ];
  const [selectedCrop, setSelectedCrop] = useState(cropOptions[0].name);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Send message to chatbot endpoint
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory((h) => [...h, { from: "user", text: userMsg }]);
    setChatInput("");
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMsg,
      });
      setChatHistory((h) => [...h, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      setChatHistory((h) => [
        ...h,
        { from: "bot", text: "Sorry, I couldn't connect to the chatbot." },
      ]);
    }
  };
  
  // Voice Assistant State
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Voice Assistant Handler
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setProduct(transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
    setListening(true);
    recognitionRef.current.start();
  };
  
  const [scanResult, setScanResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [market, setMarket] = useState([]);
  const [product, setProduct] = useState("");
  const fileInputRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [geoLocation, setGeoLocation] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product", product);
    try {
      const res = await axios.post("http://localhost:5000/api/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setScanResult(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error scanning image:", error);
      alert("Error scanning image. Please try again.");
    }
  };

  const fetchWeather = async () => {
    if (geoLocation && geoLocation.latitude && geoLocation.longitude) {
      // Use Open-Meteo API for real weather data
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${geoLocation.latitude}&longitude=${geoLocation.longitude}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather({
          location: `${geoLocation.city ? geoLocation.city + ", " : ""}${
            geoLocation.region ? geoLocation.region + ", " : ""
          }${geoLocation.country || ""}`.replace(/, $/, ""),
          temperature: data.current_weather
            ? `${data.current_weather.temperature}°C`
            : "N/A",
          condition: data.current_weather
            ? `Windspeed: ${data.current_weather.windspeed} km/h`
            : "N/A",
          prediction: "Live weather from Open-Meteo",
        });
        return;
      } catch (e) {
        // fallback to backend
        console.error("Error fetching weather from Open-Meteo:", e);
      }
    }
    // fallback to backend static data
    try {
      const res = await axios.get("http://192.168.56.1:5000/api/weather");
      setWeather(res.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Error fetching weather data. Please try again.");
    }
  };

  // Get user's geolocation using browser API and a free geolocation service
  const fetchGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Use a free geolocation API to get city/state/country
          try {
            const geoRes = await fetch(
              `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
            );
            const geoData = await geoRes.json();
            setGeoLocation({
              city:
                geoData.address?.city ||
                geoData.address?.town ||
                geoData.address?.village ||
                "",
              region: geoData.address?.state || "",
              country: geoData.address?.country || "",
              latitude,
              longitude,
            });
          } catch (e) {
            setGeoLocation({ latitude, longitude });
          }
        },
        (err) => {
          alert("Location access denied.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchMarket = async () => {
    try {
      const res = await axios.get("http://192.168.56.1:5000/api/market");
      setMarket(res.data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      alert("Error fetching market data. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e0ffe0 0%, #f0f8ff 100%)",
        fontFamily: "Segoe UI, Arial, sans-serif",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Language Selector */}
      <div style={{ position: "absolute", top: 18, right: 24, zIndex: 100 }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #bbb",
            fontSize: 15,
          }}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>
      
      {/* Animated Hero Section */}
      <div style={heroSectionStyle}>
        <div style={heroBgStyle} />
        <div style={heroContentStyle}>
          <h1
            style={{
              fontSize: 40,
              margin: 0,
              color: "#fff",
              fontWeight: 700,
              letterSpacing: 2,
              textShadow: "0 2px 12px #0006",
            }}
          >
            <span style={waveAnimStyle}>🌱</span> AgriScan
          </h1>
          <p
            style={{
              fontSize: 22,
              color: "#e0ffe0",
              margin: "18px 0 0 0",
              fontWeight: 500,
              textShadow: "0 2px 8px #0004",
            }}
          >
            Empowering Farmers with{" "}
            <span style={gradientTextStyle}>Smart Insights</span>
          </p>
        </div>
        {/* Animated floating icons */}
        <div style={floatingIconStyle1}>🌾</div>
        <div style={floatingIconStyle2}>☀️</div>
        <div style={floatingIconStyle3}>💧</div>
      </div>
      
      {/* Chatbot Floating Button */}
      <button
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 2000,
          background: "#388e3c",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          fontSize: 28,
          boxShadow: "0 4px 16px #0002",
          cursor: "pointer",
        }}
        onClick={() => setChatOpen((v) => !v)}
        title="Open Chatbot"
      >
        💬
      </button>

      {/* Chatbot Window */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 28,
            width: 340,
            maxHeight: 420,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px #0003",
            zIndex: 2100,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #e0e0e0",
              background: "#388e3c",
              color: "#fff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <b>AgriScan Chatbot</b>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                float: "right",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 14,
              background: "#f9fbe7",
            }}
          >
            {chatHistory.length === 0 && (
              <div
                style={{ color: "#888", textAlign: "center", marginTop: 30 }}
              >
                Ask me anything about farming, weather, or market prices!
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                style={{
                  margin: "8px 0",
                  textAlign: msg.from === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: msg.from === "user" ? "#c8e6c9" : "#fffde7",
                    color: "#222",
                    borderRadius: 12,
                    padding: "7px 13px",
                    maxWidth: "80%",
                    fontSize: 15,
                    boxShadow:
                      msg.from === "user"
                        ? "0 2px 8px #388e3c22"
                        : "0 2px 8px #fbc02d22",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <form
            onSubmit={sendChatMessage}
            style={{
              display: "flex",
              borderTop: "1px solid #e0e0e0",
              background: "#fff",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your question..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: 12,
                fontSize: 15,
                borderBottomLeftRadius: 16,
              }}
            />
            <button
              type="submit"
              style={{
                background: "#388e3c",
                color: "#fff",
                border: "none",
                borderBottomRightRadius: 16,
                padding: "0 18px",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <main
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 32,
          maxWidth: 1100,
          margin: "0 auto",
          paddingBottom: 40,
        }}
      >
        {/* Disease & Pest Detection Card */}
        <section style={cardStyle}>
          <h2 style={cardTitle}>
            <span style={{ verticalAlign: "middle", marginRight: 8 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" fill="#d32f2f" />
                <path
                  d="M8 12l2 2 4-4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Disease & Pest Detection
          </h2>
          <input
            id="diseaseInput"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={handleDiseaseImageChange}
          />
          <button
            style={{ ...iconButtonStyle, marginBottom: 10 }}
            onClick={() => document.getElementById("diseaseInput").click()}
          >
            <span role="img" aria-label="Camera">
              📷
            </span>{" "}
            Upload/Scan Crop Photo
          </button>
          {diseaseLoading && (
            <div style={{ color: "#388e3c", margin: "10px 0" }}>
              Analyzing image...
            </div>
          )}
          {diseaseResult && (
            <div
              style={{
                marginTop: 10,
                background: "#f1f8e9",
                borderRadius: 8,
                padding: 12,
                textAlign: "left",
              }}
            >
              <b style={{ color: diseaseResult.color }}>
                {diseaseResult.status}
              </b>
              <p style={{ margin: "6px 0 0 0" }}>{diseaseResult.message}</p>
            </div>
          )}
        </section>
        
        {/* Crop Calendar Card */}
        <section style={cardStyle}>
          <h2 style={cardTitle}>
            <span style={{ verticalAlign: "middle", marginRight: 8 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="none"
                viewBox="0 0 24 24"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="4"
                  fill="#ffb300"
                />
                <rect x="7" y="7" width="10" height="2" rx="1" fill="#fffde7" />
                <rect x="7" y="11" width="6" height="2" rx="1" fill="#fffde7" />
                <rect x="7" y="15" width="8" height="2" rx="1" fill="#fffde7" />
              </svg>
            </span>
            Crop Calendar
          </h2>
          <div style={{ margin: "12px 0 18px 0" }}>
            <label
              htmlFor="cropSelect"
              style={{ fontWeight: 500, marginRight: 8 }}
            >
              Select Crop:
            </label>
            <select
              id="cropSelect"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #bbb",
                fontSize: 15,
              }}
            >
              {cropOptions.map((crop) => (
                <option key={crop.name} value={crop.name}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              background: "#fffde7",
              borderRadius: 10,
              padding: 16,
              boxShadow: "0 2px 8px #ffb30022",
            }}
            aria-live="polite"
          >
            <b>Key Dates:</b>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {cropOptions
                .find((c) => c.name === selectedCrop)
                .calendar.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      margin: "10px 0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ width: 110, fontWeight: 500 }}>
                      {item.stage}:
                    </span>
                    <span
                      style={{
                        background: "#ffb300",
                        color: "#fff",
                        borderRadius: 6,
                        padding: "3px 10px",
                        marginLeft: 8,
                        fontWeight: 600,
                      }}
                    >
                      {item.date}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </section>
        
        {/* Scan Product Card */}
        <section style={cardStyle}>
          <h2 style={cardTitle}>Scan Product</h2>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <input
              type="text"
              placeholder="Enter product name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              style={inputStyle}
            />
            <button
              style={{
                ...iconButtonStyle,
                background: listening ? "#ffeb3b" : "#388e3c",
                color: listening ? "#222" : "#fff",
                border: listening ? "2px solid #388e3c" : "none",
              }}
              title="Speak product name"
              onClick={handleVoiceInput}
              aria-label="Speak product name"
            >
              {listening ? (
                <span role="img" aria-label="Listening">
                  🎤...
                </span>
              ) : (
                <span role="img" aria-label="Mic">
                  🎤
                </span>
              )}
            </button>
          </div>
          <label
            htmlFor="cameraInput"
            style={{
              fontSize: 14,
              color: "#388e3c",
              marginBottom: 8,
              display: "block",
              textAlign: "center",
            }}
          >
            (Use your camera to scan a product)
          </label>
          <input
            id="cameraInput"
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <button
            style={{
              ...iconButtonStyle,
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
            title="Scan with Camera"
            onClick={startCameraScanner}
            aria-label="Scan with Camera"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="14" x="2" y="7" rx="3" fill="#388e3c" />
              <circle cx="12" cy="14" r="4" fill="#fff" />
              <circle cx="12" cy="14" r="2" fill="#388e3c" />
              <rect width="6" height="2" x="9" y="4" rx="1" fill="#388e3c" />
            </svg>
          </button>
          
          {/* Modal Popup for Scan Result */}
          {showModal && scanResult && (
            <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
              <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ color: "#388e3c", marginBottom: 10 }}>
                  Scan Result
                </h3>
                <p>
                  <b>Product:</b> {scanResult.product}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span
                    style={{
                      color: scanResult.safeToUse ? "#388e3c" : "#d32f2f",
                      fontWeight: 600,
                    }}
                  >
                    {scanResult.safeToUse ? "Safe" : "Not Safe"}
                  </span>
                </p>
                <p>{scanResult.message}</p>
                {/* Show AI analysis details if present */}
                {scanResult.aiAnalysis && (
                  <div
                    style={{
                      marginTop: 16,
                      background: "#f1f8e9",
                      borderRadius: 8,
                      padding: 12,
                      textAlign: "left",
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0", color: "#388e3c" }}>
                      AI Analysis
                    </h4>
                    <p>
                      <b>Detected Class:</b>{" "}
                      {scanResult.aiAnalysis.detectedClass}
                    </p>
                    <p>
                      <b>Quality:</b> {scanResult.aiAnalysis.quality}
                    </p>
                    <p>
                      <b>Disease:</b> {scanResult.aiAnalysis.disease}
                    </p>
                    <p>
                      <b>Confidence:</b>{" "}
                      {(scanResult.aiAnalysis.confidence * 100).toFixed(1)}%
                    </p>
                    <p>
                      <b>Notes:</b> {scanResult.aiAnalysis.notes}
                    </p>
                  </div>
                )}
                <button
                  style={{
                    ...buttonStyle,
                    background: "#d32f2f",
                    marginTop: 18,
                  }}
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
        
        {/* Weather Card */}
        <section style={cardStyle}>
          <h2 style={cardTitle}>
            {/* Weather SVG icon */}
            <span style={{ verticalAlign: "middle", marginRight: 8 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="6"
                  fill="#ffeb3b"
                  stroke="#fbc02d"
                  strokeWidth="2"
                />
                <g stroke="#fbc02d" strokeWidth="2">
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                  <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" />
                  <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
                  <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" />
                  <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" />
                </g>
              </svg>
            </span>
            Weather Prediction
          </h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button
              style={iconButtonStyle}
              title="Get Weather"
              onClick={fetchWeather}
              aria-label="Get Weather"
            >
              {/* Cloud SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
              >
                <ellipse cx="12" cy="17" rx="7" ry="4" fill="#90caf9" />
                <ellipse cx="16" cy="15" rx="5" ry="3" fill="#64b5f6" />
              </svg>
            </button>
            <button
              style={iconButtonStyle}
              title="Detect Location"
              onClick={fetchGeoLocation}
              aria-label="Detect Location"
            >
              {/* Location SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="10" r="3" fill="#388e3c" />
                <path
                  d="M12 2C7 2 3 6.03 3 11.25c0 4.13 3.4 7.98 8.1 10.6a2 2 0 0 0 1.8 0C17.6 19.23 21 15.38 21 11.25 21 6.03 17 2 12 2Z"
                  stroke="#388e3c"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </button>
          </div>
          {weather && (
            <div style={{ marginTop: 18 }}>
              <p>
                <b>Location:</b> {weather.location}
              </p>
              <p>
                <b>Temperature:</b> {weather.temperature}
              </p>
              <p>
                <b>Condition:</b> {weather.condition}
              </p>
              <p>
                <b>Prediction:</b> {weather.prediction}
              </p>
            </div>
          )}
          {geoLocation && (
            <div style={{ marginTop: 8, fontSize: 13, color: "#388e3c" }}>
              <span>
                Detected: {geoLocation.city || ""}
                {geoLocation.region ? ", " + geoLocation.region : ""}
                {geoLocation.country ? ", " + geoLocation.country : ""}
              </span>
            </div>
          )}
        </section>
        
        {/* Market Prices Card */}
        <section style={cardStyle}>
          <h2 style={cardTitle}>
            {/* Market SVG icon */}
            <span style={{ verticalAlign: "middle", marginRight: 8 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="none"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="10" width="4" height="8" rx="1" fill="#8bc34a" />
                <rect x="9" y="6" width="4" height="12" rx="1" fill="#388e3c" />
                <rect
                  x="15"
                  y="13"
                  width="4"
                  height="5"
                  rx="1"
                  fill="#cddc39"
                />
              </svg>
            </span>
            Market Prices
          </h2>
          <button
            style={iconButtonStyle}
            title="Get Prices"
            onClick={fetchMarket}
            aria-label="Get Prices"
          >
            {/* Rupee SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
            >
              <text
                x="6"
                y="20"
                fontSize="18"
                fill="#388e3c"
                fontFamily="Arial"
              >
                ₹
              </text>
            </svg>
          </button>
          <ul style={{ marginTop: 18, paddingLeft: 18 }}>
            {market.map((item, idx) => (
              <li key={idx} style={{ fontSize: 17, marginBottom: 6 }}>
                <b>{item.product}:</b> {item.price}
              </li>
            ))}
          </ul>
        </section>
      </main>
      
      {/* QR Scanner Modal */}
      {showScanner && (
        <div style={modalOverlayStyle} onClick={stopCameraScanner}>
          <div style={scannerModalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#388e3c", marginBottom: 16 }}>
              Scan QR Code
            </h3>
            
            <video 
              ref={videoRef} 
              style={{ 
                width: "100%", 
                maxHeight: "300px", 
                borderRadius: "8px",
                backgroundColor: "#000"
              }}
              playsInline
            />
            
            <p style={{ margin: "16px 0", color: "#666" }}>
              Point your camera at a QR code
            </p>
            
            {scannedCode && (
              <div style={{ 
                padding: "12px", 
                backgroundColor: "#f1f8e9", 
                borderRadius: "8px",
                marginBottom: "16px"
              }}>
                <p>Scanned: <strong>{scannedCode}</strong></p>
              </div>
            )}
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  ...buttonStyle,
                  background: "#d32f2f",
                  flex: 1
                }}
                onClick={stopCameraScanner}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <footer
        style={{
          textAlign: "center",
          color: "#388e3c",
          marginTop: 40,
          fontSize: 15,
          opacity: 0.7,
        }}
      >
        &copy; {new Date().getFullYear()} AgriScan Prototype
      </footer>
    </div>
  );
}

// --- Simple CSS-in-JS styles ---
const cardStyle = {
  background: "white",
  borderRadius: 16,
  boxShadow: "0 4px 16px #0002",
  padding: "32px 28px",
  minWidth: 300,
  maxWidth: 340,
  flex: "1 1 320px",
  marginBottom: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const cardTitle = {
  marginBottom: 18,
  color: "#388e3c",
  fontSize: 24,
  fontWeight: 600,
  letterSpacing: 1,
};
const buttonStyle = {
  background: "#388e3c",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 22px",
  fontSize: 16,
  fontWeight: 500,
  marginTop: 10,
  cursor: "pointer",
  boxShadow: "0 2px 6px #0001",
  transition: "background 0.2s",
};
const iconButtonStyle = {
  background: "#fff",
  border: "2px solid #388e3c",
  borderRadius: "50%",
  padding: 10,
  cursor: "pointer",
  boxShadow: "0 2px 6px #0001",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s",
};
const inputStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #bdbdbd",
  fontSize: 16,
  marginBottom: 10,
  width: "100%",
  boxSizing: "border-box",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modalStyle = {
  background: "white",
  borderRadius: 12,
  boxShadow: "0 4px 24px #0003",
  padding: "32px 28px",
  minWidth: 280,
  maxWidth: 350,
  textAlign: "center",
};
const scannerModalStyle = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 24px #0003",
  padding: "24px",
  width: "90%",
  maxWidth: "400px",
  textAlign: "center",
};

// --- Animation Styles (place after export default App) ---
const heroSectionStyle = {
  position: "relative",
  width: "100%",
  minHeight: 260,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  marginBottom: 40,
};
const heroBgStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "linear-gradient(120deg, #43e97b 0%, #38f9d7 100%)",
  zIndex: 1,
  animation: "bgMove 8s linear infinite alternate",
};
const heroContentStyle = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  width: "100%",
};
const gradientTextStyle = {
  background: "linear-gradient(90deg, #fff 40%, #e0ffe0 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 700,
};
const waveAnimStyle = {
  display: "inline-block",
  animation: "wave 1.5s infinite",
  transformOrigin: "70% 70%",
};
const floatingIconBase = {
  position: "absolute",
  fontSize: 38,
  opacity: 0.7,
  zIndex: 2,
  pointerEvents: "none",
};
const floatingIconStyle1 = {
  ...floatingIconBase,
  left: 40,
  top: 40,
  animation: "float1 5s ease-in-out infinite",
};
const floatingIconStyle2 = {
  ...floatingIconBase,
  right: 60,
  top: 60,
  animation: "float2 6s ease-in-out infinite",
};
const floatingIconStyle3 = {
  ...floatingIconBase,
  left: "50%",
  bottom: 20,
  animation: "float3 7s ease-in-out infinite",
};

// Add keyframes to the page (only once)
if (typeof window !== "undefined" && !window.__agriscan_hero_anim) {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes wave {
      0% { transform: rotate(0deg); }
      20% { transform: rotate(-15deg); }
      40% { transform: rotate(10deg); }
      60% { transform: rotate(-10deg); }
      80% { transform: rotate(5deg); }
      100% { transform: rotate(0deg); }
    }
    @keywaves float1 {
      0% { transform: translateY(0); }
      50% { transform: translateY(-18px); }
      100% { transform: translateY(0); }
    }
    @keyframes float2 {
      0% { transform: translateY(0); }
      50% { transform: translateY(16px); }
      100% { transform: translateY(0); }
    }
    @keyframes float3 {
      0% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
      100% { transform: translateY(0); }
    }
    @keyframes bgMove {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(30deg); }
    }
  `;
  document.head.appendChild(style);
  window.__agriscan_hero_anim = true;
}

export default App;