import React, { useState } from 'react';
import axios from 'axios';

// --- Green-White Color Palette ---
const COLORS = {
  background: '#f6fff8', // very light greenish white
  card: '#ffffff', // pure white
  cardShadow: '0 4px 16px #b7e4c7', // soft green shadow
  primary: '#43a047', // lively green
  primaryDark: '#2e7d32', // deeper green
  accent: '#b7e4c7', // mint green accent
  border: '#a5d6a7', // light green border
  text: '#1b5e20', // dark green text
  buttonText: '#fff', // white for buttons
  buttonHover: '#388e3c', // slightly darker green
  inputBg: '#f1f8e9', // pale green for inputs
  inputBorder: '#a5d6a7',
};

function App() {
  // Notification state
  const [notification, setNotification] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  // Show notification (now only on bell click)
  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setNotifOpen(true);
  };
  // Fruit animation state
  const [fruits, setFruits] = useState([]);
  // Fruit SVGs
  const fruitSvgs = [
    '<svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="#ffb300" stroke="#e65100" stroke-width="2"/><ellipse cx="14" cy="10" rx="4" ry="6" fill="#fffde7" opacity=".3"/></svg>', // Mango
    '<svg width="28" height="28" viewBox="0 0 28 28"><ellipse cx="14" cy="16" rx="8" ry="6" fill="#e53935"/><ellipse cx="14" cy="12" rx="4" ry="2" fill="#fff" opacity=".2"/></svg>', // Apple
    '<svg width="28" height="28" viewBox="0 0 28 28"><ellipse cx="14" cy="16" rx="7" ry="5" fill="#43a047"/><ellipse cx="14" cy="12" rx="3" ry="1.5" fill="#fff" opacity=".2"/></svg>', // Watermelon
    '<svg width="28" height="28" viewBox="0 0 28 28"><ellipse cx="14" cy="16" rx="6" ry="5" fill="#fbc02d"/><ellipse cx="14" cy="12" rx="2.5" ry="1.2" fill="#fff" opacity=".2"/></svg>', // Lemon
    '<svg width="28" height="28" viewBox="0 0 28 28"><ellipse cx="14" cy="16" rx="7" ry="6" fill="#8bc34a"/><ellipse cx="14" cy="12" rx="3" ry="1.5" fill="#fff" opacity=".2"/></svg>', // Guava
  ];
  // Fruit drop handler
  const dropFruits = (btnRect) => {
    const newFruits = Array.from({length: 5}, (_, i) => ({
      id: Date.now() + i + Math.random(),
      left: btnRect.left + btnRect.width/2 + (Math.random()-0.5)*40,
      top: btnRect.top + btnRect.height/2,
      svg: fruitSvgs[Math.floor(Math.random()*fruitSvgs.length)],
      delay: Math.random()*0.2
    }));
    setFruits(f => [...f, ...newFruits]);
    setTimeout(() => {
      setFruits(f => f.slice(newFruits.length));
    }, 1200);
  };
  // Multilingual Support
  const [language, setLanguage] = useState('en');
  const translations = {
    en: {
      scanProduct: 'Scan Product',
      enterProduct: 'Enter product name',
      speakProduct: 'Speak product name',
      uploadScan: 'Upload/Scan Crop Photo',
      diseasePest: 'Disease & Pest Detection',
      healthy: 'Healthy',
      diseaseDetected: 'Disease Detected',
      pestDetected: 'Pest Detected',
      analyzing: 'Analyzing image...',
      cropCalendar: 'Crop Calendar',
      selectCrop: 'Select Crop:',
      keyDates: 'Key Dates:',
      weatherPrediction: 'Weather Prediction',
      marketPrices: 'Market Prices',
      chatbot: 'AgriScan Chatbot',
      askAnything: 'Ask me anything about farming, weather, or market prices!',
      send: 'Send',
      close: 'Close',
    },
    hi: {
      scanProduct: 'उत्पाद स्कैन करें',
      enterProduct: 'उत्पाद का नाम दर्ज करें',
      speakProduct: 'बोलें उत्पाद का नाम',
      uploadScan: 'फसल फोटो अपलोड/स्कैन करें',
      diseasePest: 'रोग और कीट पहचान',
      healthy: 'स्वस्थ',
      diseaseDetected: 'रोग पाया गया',
      pestDetected: 'कीट पाया गया',
      analyzing: 'छवि का विश्लेषण हो रहा है...',
      cropCalendar: 'फसल कैलेंडर',
      selectCrop: 'फसल चुनें:',
      keyDates: 'मुख्य तिथियाँ:',
      weatherPrediction: 'मौसम पूर्वानुमान',
      marketPrices: 'बाजार मूल्य',
      chatbot: 'एग्रीस्कैन चैटबॉट',
      askAnything: 'खेती, मौसम या बाजार के बारे में कुछ भी पूछें!',
      send: 'भेजें',
      close: 'बंद करें',
    },
    ta: {
      scanProduct: 'பயிர் ஸ்கேன்',
      enterProduct: 'பயிர் பெயரை உள்ளிடவும்',
      speakProduct: 'பயிர் பெயரை பேசவும்',
      uploadScan: 'பயிர் புகைப்படம் பதிவேற்ற/ஸ்கேன்',
      diseasePest: 'நோய் மற்றும் பூச்சி கண்டறிதல்',
      healthy: 'ஆரோக்கியம்',
      diseaseDetected: 'நோய் கண்டறியப்பட்டது',
      pestDetected: 'பூச்சி கண்டறியப்பட்டது',
      analyzing: 'படம் பகுப்பாய்வு செய்யப்படுகிறது...',
      cropCalendar: 'பயிர் நாட்காட்டி',
      selectCrop: 'பயிர் தேர்வு:',
      keyDates: 'முக்கிய தேதிகள்:',
      weatherPrediction: 'வானிலை முன்னறிவு',
      marketPrices: 'சந்தை விலை',
      chatbot: 'AgriScan உரையாடல்',
      askAnything: 'விவசாயம், வானிலை, சந்தை பற்றி ஏதேனும் கேளுங்கள்!',
      send: 'அனுப்பு',
      close: 'மூடு',
    },
  };
  const t = translations[language];
  // Disease & Pest Detection State
  const [diseaseImage, setDiseaseImage] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);

  // Mock AI detection handler
  const handleDiseaseImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDiseaseImage(file);
    setDiseaseLoading(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      // Randomly pick a result
      const results = [
        { status: 'Healthy', color: '#388e3c', message: 'No disease or pest detected.' },
        { status: 'Disease Detected', color: '#d32f2f', message: 'Leaf blight detected. Suggest: Remove affected leaves and use recommended fungicide.' },
        { status: 'Pest Detected', color: '#fbc02d', message: 'Aphid infestation detected. Suggest: Use neem oil spray.' },
      ];
      const result = results[Math.floor(Math.random() * results.length)];
      setDiseaseResult(result);
      setDiseaseLoading(false);
    }, 1500);
  };
  // Crop Calendar State
  const cropOptions = [
    { name: 'Wheat', calendar: [
      { stage: 'Sowing', date: 'Nov 10' },
      { stage: 'Irrigation', date: 'Dec 1' },
      { stage: 'Fertilization', date: 'Dec 20' },
      { stage: 'Harvesting', date: 'Mar 25' },
    ]},
    { name: 'Rice', calendar: [
      { stage: 'Sowing', date: 'June 15' },
      { stage: 'Irrigation', date: 'July 5' },
      { stage: 'Fertilization', date: 'July 25' },
      { stage: 'Harvesting', date: 'Oct 10' },
    ]},
    { name: 'Maize', calendar: [
      { stage: 'Sowing', date: 'July 1' },
      { stage: 'Irrigation', date: 'July 20' },
      { stage: 'Fertilization', date: 'Aug 10' },
      { stage: 'Harvesting', date: 'Oct 5' },
    ]},
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
      const res = await axios.post("http://localhost:5000/api/chat", { message: userMsg });
      setChatHistory((h) => [...h, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      setChatHistory((h) => [...h, { from: "bot", text: "Sorry, I couldn't connect to the chatbot." }]);
    }
  };
  // Voice Assistant State
  const [listening, setListening] = useState(false);
  const recognitionRef = React.useRef(null);

  // Voice Assistant Handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
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
  const [product, setProduct] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = React.useRef();
  const [showModal, setShowModal] = useState(false);
  const [geoLocation, setGeoLocation] = useState(null);

  const handleScan = () => {
    // Open camera/file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    // Immediately scan after image is selected
    const formData = new FormData();
    formData.append('image', file);
    formData.append('product', product);
    const res = await axios.post('http://localhost:5000/api/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setScanResult(res.data);
    setShowModal(true);
  };

  const fetchWeather = async () => {
    if (geoLocation && geoLocation.latitude && geoLocation.longitude) {
      // Use Open-Meteo API for real weather data
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${geoLocation.latitude}&longitude=${geoLocation.longitude}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather({
          location: `${geoLocation.city ? geoLocation.city + ', ' : ''}${geoLocation.region ? geoLocation.region + ', ' : ''}${geoLocation.country || ''}`.replace(/, $/, ''),
          temperature: data.current_weather ? `${data.current_weather.temperature}°C` : 'N/A',
          condition: data.current_weather ? `Windspeed: ${data.current_weather.windspeed} km/h` : 'N/A',
          prediction: 'Live weather from Open-Meteo'
        });
        return;
      } catch (e) {
        // fallback to backend
      }
    }
    // fallback to backend static data
    const res = await axios.get('http://192.168.56.1:5000/api/weather');
    setWeather(res.data);
  };

  // Get user's geolocation using browser API and a free geolocation service
  const fetchGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Use a free geolocation API to get city/state/country
        try {
          const geoRes = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          setGeoLocation({
            city: geoData.address?.city || geoData.address?.town || geoData.address?.village || '',
            region: geoData.address?.state || '',
            country: geoData.address?.country || '',
            latitude,
            longitude
          });
        } catch (e) {
          setGeoLocation({ latitude, longitude });
        }
      }, (err) => {
        alert('Location access denied.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const fetchMarket = async () => {
    const res = await axios.get('http://192.168.56.1:5000/api/market');
    setMarket(res.data);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.background,
      fontFamily: 'Segoe UI, Arial, sans-serif',
      padding: 0,
      margin: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Navbar */}
      <nav style={{
        width: '100%',
        height: 56,
        background: COLORS.primary,
        color: COLORS.buttonText,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        boxShadow: COLORS.cardShadow,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: 1.5,
        zIndex: 100,
        position: 'relative',
      }}>
        <span style={{fontWeight: 800, fontSize: 24, letterSpacing: 2}}>🌱 AgriNext</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Bell Icon for Notification */}
          <button
            onClick={() => {
              if (!notification) showNotification('No new notifications', 'info');
              else setNotifOpen((v) => !v);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 28,
              color: notifOpen ? COLORS.primary : COLORS.buttonText,
              outline: 'none',
              position: 'relative',
              marginRight: 8,
            }}
            title="Show notifications"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {notifOpen && notification && (
              <span style={{position:'absolute',top:-8,right:-8,background:'#d32f2f',color:'#fff',borderRadius:'50%',width:16,height:16,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>!</span>
            )}
          </button>
          {/* Language Selector */}
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`, fontSize: 15, background: COLORS.card, color: COLORS.text, fontWeight: 600 }}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
          </select>
          {/* Vendor Verse Button */}
          <button
            style={{
              marginLeft: 10,
              background: COLORS.primary,
              color: COLORS.buttonText,
              border: 'none',
              borderRadius: 8,
              padding: '7px 18px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: COLORS.cardShadow,
              transition: 'background 0.2s',
            }}
            onClick={() => window.open('http://localhost:5000/vendorverse', '_blank')}
          >
            Go to Vendor Verse
          </button>
        </div>
      </nav>
    {/* Notification Alert */}
    {notifOpen && notification && (
      <div style={{
        position: 'fixed',
        top: 60,
        right: 40,
        background: notification.type === 'success' ? 'linear-gradient(90deg,#43e97b,#38f9d7)' : notification.type === 'error' ? '#d32f2f' : '#388e3c',
        color: '#fff',
        padding: '16px 36px',
        borderRadius: 16,
        boxShadow: '0 4px 24px #0003',
        fontSize: 18,
        fontWeight: 600,
        zIndex: 4000,
        animation: 'notifSlide 0.5s cubic-bezier(.5,1.5,.5,1)',
        letterSpacing: 0.5,
        minWidth: 220,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <span style={{flex:1}}>{notification.msg}</span>
        <button onClick={()=>setNotifOpen(false)} style={{background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer',fontWeight:700,lineHeight:1}}>×</button>
      </div>
    )}
    {/* Fruit falling animation layer */}
    <div style={{position:'fixed',pointerEvents:'none',zIndex:3000,top:0,left:0,width:'100vw',height:'100vh'}}>
      {fruits.map(fruit => (
        <span key={fruit.id} style={{
          position:'absolute',
          left: fruit.left,
          top: fruit.top,
          animation: `fruitDrop 1.1s cubic-bezier(.5,1.5,.5,1) ${fruit.delay}s forwards`,
          zIndex: 3001,
          pointerEvents:'none',
        }} dangerouslySetInnerHTML={{__html: fruit.svg}} />
      ))}
    </div>
      {/* Language Selector */}
  
      {/* Dashboard Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: COLORS.accent,
        borderRadius: 24,
        boxShadow: COLORS.cardShadow,
        padding: '32px 16px',
        maxWidth: 900,
        margin: '40px auto 0 auto',
        minHeight: 400,
      }}>
        {/* Autoplay Video Banner */}
        <video
          src="https://www.w3schools.com/html/mov_bbb.mp4" // Replace with your farming/nature video URL
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: 260,
            height: 120,
            objectFit: 'cover',
            borderRadius: 16,
            boxShadow: COLORS.cardShadow,
            marginBottom: 18,
            background: COLORS.card
          }}
        />
        {/* Dashboard cards */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 20,
          background: COLORS.accent,
          borderRadius: 24,
          boxShadow: COLORS.cardShadow,
          padding: '32px 16px',
          maxWidth: 900,
          margin: '0 auto',
          minHeight: 400,
        }}>
          {/* Disease & Pest Detection Card */}
          <section style={{
            background: COLORS.card,
            borderRadius: 12,
            boxShadow: COLORS.cardShadow,
            padding: '18px 14px',
            minWidth: 220,
            maxWidth: 250,
            flex: '1 1 220px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h2 style={cardTitle}>
              <span style={{ verticalAlign: 'middle', marginRight: 8 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#d32f2f"/>
                  <path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {t.diseasePest}
            </h2>
            <input
              id="diseaseInput"
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleDiseaseImageChange}
            />
            <button
              style={{ ...buttonStyle, marginBottom: 10, width: '100%' }}
              onClick={e => {
                document.getElementById('diseaseInput').click();
                const rect = e.target.getBoundingClientRect();
                dropFruits(rect);
                // showNotification('Disease/Pest scan started!', 'info');
              }}
            >
              Upload/Scan Crop Photo
            </button>
            {diseaseLoading && <div style={{ color: '#388e3c', margin: '10px 0' }}>Analyzing image...</div>}
            {diseaseResult && (
              <div style={{ marginTop: 10, background: '#f1f8e9', borderRadius: 8, padding: 12, textAlign: 'left' }}>
                <b style={{ color: diseaseResult.color }}>{diseaseResult.status}</b>
                <p style={{ margin: '6px 0 0 0' }}>{diseaseResult.message}</p>
              </div>
            )}
          </section>
          {/* Crop Calendar Card */}
          <section style={{
            background: COLORS.card,
            borderRadius: 12,
            boxShadow: COLORS.cardShadow,
            padding: '18px 14px',
            minWidth: 220,
            maxWidth: 250,
            flex: '1 1 220px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h2 style={cardTitle}>
              <span style={{ verticalAlign: 'middle', marginRight: 8 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="4" fill="#ffb300"/>
                  <rect x="7" y="7" width="10" height="2" rx="1" fill="#fffde7"/>
                  <rect x="7" y="11" width="6" height="2" rx="1" fill="#fffde7"/>
                  <rect x="7" y="15" width="8" height="2" rx="1" fill="#fffde7"/>
                </svg>
              </span>
              {t.cropCalendar}
            </h2>
            <div style={{ margin: '12px 0 18px 0' }}>
              <label htmlFor="cropSelect" style={{ fontWeight: 500, marginRight: 8 }}>Select Crop:</label>
              <select
                id="cropSelect"
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #bbb', fontSize: 15 }}
              >
                {cropOptions.map(crop => (
                  <option key={crop.name} value={crop.name}>{crop.name}</option>
                ))}
              </select>
            </div>
            <div style={{ background: '#fffde7', borderRadius: 10, padding: 16, boxShadow: '0 2px 8px #ffb30022' }}>
              <b>Key Dates:</b>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {cropOptions.find(c => c.name === selectedCrop).calendar.map((item, idx) => (
                  <li key={idx} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 110, fontWeight: 500 }}>{item.stage}:</span>
                    <span style={{ background: '#ffb300', color: '#fff', borderRadius: 6, padding: '3px 10px', marginLeft: 8, fontWeight: 600 }}>{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {/* Scan Product Card */}
          <section style={{
            background: COLORS.card,
            borderRadius: 12,
            boxShadow: COLORS.cardShadow,
            padding: '18px 14px',
            minWidth: 220,
            maxWidth: 250,
            flex: '1 1 220px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h2 style={cardTitle}>{t.uploadScan}</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Enter product name"
                value={product}
                onChange={e => setProduct(e.target.value)}
                style={inputStyle}
              />
              <button
                style={{ ...iconButtonStyle, background: listening ? '#ffeb3b' : COLORS.card, color: listening ? '#222' : COLORS.primary, border: listening ? `2px solid ${COLORS.primary}` : `2px solid ${COLORS.primary}` }}
                title="Speak product name"
                onClick={handleVoiceInput}
              >
                {listening ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><line x1="12" y1="22" x2="12" y2="18"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><line x1="12" y1="22" x2="12" y2="18"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
                )}
              </button>
            </div>
            <label htmlFor="cameraInput" style={{ fontSize: 14, color: '#388e3c', marginBottom: 8, display: 'block', textAlign: 'center' }}>
              {t.UseYourCameraToScanAProduct}
            </label>
            <input
              id="cameraInput"
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <button
              style={{
                ...iconButtonStyle,
                marginTop: 10,
                position: 'relative',
                overflow: 'visible'
              }}
              title="Scan with Camera"
              onClick={e => {
                e.preventDefault();
                if (fileInputRef.current) fileInputRef.current.click();
                const rect = e.target.getBoundingClientRect();
                dropFruits(rect);
              }}
              onMouseDown={e => {
                const rect = e.target.getBoundingClientRect();
                dropFruits(rect);
              }}
            >
              {/* Camera SVG icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
                <rect width="20" height="14" x="2" y="7" rx="3" fill="#388e3c"/>
                <circle cx="12" cy="14" r="4" fill="#fff"/>
                <circle cx="12" cy="14" r="2" fill="#388e3c"/>
                <rect width="6" height="2" x="9" y="4" rx="1" fill="#388e3c"/>
              </svg>
            </button>
            {/* Modal Popup for Scan Result */}
            {showModal && scanResult && (
              <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
                <div style={modalStyle} onClick={e => e.stopPropagation()}>
                  <h3 style={{ color: '#388e3c', marginBottom: 10 }}>Scan Result</h3>
                  <p><b>Product:</b> {scanResult.product}</p>
                  <p><b>Status:</b> <span style={{ color: scanResult.safeToUse ? '#388e3c' : '#d32f2f', fontWeight: 600 }}>{scanResult.safeToUse ? "Safe" : "Not Safe"}</span></p>
                  <p>{scanResult.message}</p>
                  {/* Show AI analysis details if present */}
                  {scanResult.aiAnalysis && (
                    <div style={{ marginTop: 16, background: '#f1f8e9', borderRadius: 8, padding: 12, textAlign: 'left' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#388e3c' }}>AI Analysis</h4>
                      <p><b>Detected Class:</b> {scanResult.aiAnalysis.detectedClass}</p>
                      <p><b>Quality:</b> {scanResult.aiAnalysis.quality}</p>
                      <p><b>Disease:</b> {scanResult.aiAnalysis.disease}</p>
                      <p><b>Confidence:</b> {(scanResult.aiAnalysis.confidence * 100).toFixed(1)}%</p>
                      <p><b>Notes:</b> {scanResult.aiAnalysis.notes}</p>
                    </div>
                  )}
                  <button style={{ ...buttonStyle, background: '#d32f2f', marginTop: 18 }} onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            )}
          </section>
          {/* Weather Card */}
          <section style={{
            background: COLORS.card,
            borderRadius: 12,
            boxShadow: COLORS.cardShadow,
            padding: '18px 14px',
            minWidth: 220,
            maxWidth: 250,
            flex: '1 1 220px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h2 style={cardTitle}>
              {/* Weather SVG icon */}
              <span style={{ verticalAlign: 'middle', marginRight: 8 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="6" fill="#ffeb3b" stroke="#fbc02d" strokeWidth="2"/>
                  <g stroke="#fbc02d" strokeWidth="2">
                    <line x1="12" y1="2" x2="12" y2="5"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                    <line x1="2" y1="12" x2="5" y2="12"/>
                    <line x1="19" y1="12" x2="22" y2="12"/>
                    <line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/>
                    <line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/>
                    <line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/>
                    <line x1="17.7" y1="6.3" x2="19.8" y2="4.2"/>
                  </g>
                </svg>
              </span>
              {t.weatherPrediction}
            </h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <button style={iconButtonStyle} title="Get Weather" onClick={fetchWeather}>
                {/* Cloud SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="17" rx="7" ry="4" fill="#90caf9"/>
                  <ellipse cx="16" cy="15" rx="5" ry="3" fill="#64b5f6"/>
                </svg>
              </button>
              <button style={iconButtonStyle} title="Detect Location" onClick={fetchGeoLocation}>
                {/* Location SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="10" r="3" fill="#388e3c"/>
                  <path d="M12 2C7 2 3 6.03 3 11.25c0 4.13 3.4 7.98 8.1 10.6a2 2 0 0 0 1.8 0C17.6 19.23 21 15.38 21 11.25 21 6.03 17 2 12 2Z" stroke="#388e3c" strokeWidth="2" fill="none"/>
                </svg>
              </button>
            </div>
            {weather && (
              <div style={{ marginTop: 18 }}>
                <p><b>Location:</b> {weather.location}</p>
                <p><b>Temperature:</b> {weather.temperature}</p>
                <p><b>Condition:</b> {weather.condition}</p>
                <p><b>Prediction:</b> {weather.prediction}</p>
              </div>
            )}
            {geoLocation && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#388e3c' }}>
                <span>Detected: {geoLocation.city || ''}{geoLocation.region ? ', ' + geoLocation.region : ''}{geoLocation.country ? ', ' + geoLocation.country : ''}</span>
              </div>
            )}
          </section>
          {/* Market Prices Card */}
          <section style={{
            background: COLORS.card,
            borderRadius: 12,
            boxShadow: COLORS.cardShadow,
            padding: '18px 14px',
            minWidth: 220,
            maxWidth: 250,
            flex: '1 1 220px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h2 style={cardTitle}>
              {/* Market SVG icon */}
              <span style={{ verticalAlign: 'middle', marginRight: 8 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="10" width="4" height="8" rx="1" fill="#8bc34a"/>
                  <rect x="9" y="6" width="4" height="12" rx="1" fill="#388e3c"/>
                  <rect x="15" y="13" width="4" height="5" rx="1" fill="#cddc39"/>
                </svg>
              </span>
              {t.marketPrices}
            </h2>
            <button style={iconButtonStyle} title="Get Prices" onClick={fetchMarket}>
              {/* Rupee SVG icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                <text x="6" y="20" fontSize="18" fill="#388e3c" fontFamily="Arial">₹</text>
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
        </div>
      </div>
      {/* Footer */}
      <footer style={{
        width: '100%',
        background: COLORS.primary,
        color: COLORS.buttonText,
        textAlign: 'center',
        padding: '12px 0',
        fontSize: 15,
        opacity: 0.9,
        marginTop: 40,
        letterSpacing: 1
      }}>
        &copy; {new Date().getFullYear()} AgriNext
      </footer>
    </div>
  );
}


// --- Simple CSS-in-JS styles ---
const cardStyle = {
  background: COLORS.card,
  borderRadius: 12,
  boxShadow: COLORS.cardShadow,
  padding: '16px 10px', // reduced padding
  minWidth: 180, // reduced min width
  maxWidth: 210, // reduced max width
  flex: '1 1 180px',
  marginBottom: 14,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
const cardTitle = {
  marginBottom: 18,
  color: '#388e3c',
  fontSize: 24,
  fontWeight: 600,
  letterSpacing: 1
};
const buttonStyle = {
  background: COLORS.primary,
  color: COLORS.buttonText,
  border: 'none',
  borderRadius: 8,
  padding: '7px 18px',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: COLORS.cardShadow,
  transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
  outline: 'none',
  margin: '6px 0',
  letterSpacing: 0.5,
};
const iconButtonStyle = {
  background: COLORS.card,
  border: `2px solid ${COLORS.primary}`,
  borderRadius: '50%',
  padding: 8,
  cursor: 'pointer',
  boxShadow: COLORS.cardShadow,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s, border 0.2s, transform 0.1s',
  color: COLORS.primary,
  fontSize: 20,
  outline: 'none',
  margin: '4px',
};
const inputStyle = {
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #bdbdbd',
  fontSize: 16,
  marginBottom: 10,
  width: '100%',
  boxSizing: 'border-box',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};
const modalStyle = {
  background: 'white',
  borderRadius: 12,
  boxShadow: '0 4px 24px #0003',
  padding: '32px 28px',
  minWidth: 280,
  maxWidth: 350,
  textAlign: 'center',
};





// --- Animation Styles (place after export default App) ---
const heroSectionStyle = {
  position: 'relative',
  width: '100%',
  minHeight: 260,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  marginBottom: 40,
};
const heroBgStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(120deg, #43e97b 0%, #38f9d7 100%)',
  zIndex: 1,
  animation: 'bgMove 8s linear infinite alternate',
};
const heroContentStyle = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  width: '100%',
};
const gradientTextStyle = {
  background: 'linear-gradient(90deg, #fff 40%, #e0ffe0 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
};
const waveAnimStyle = {
  display: 'inline-block',
  animation: 'wave 1.5s infinite',
  transformOrigin: '70% 70%',
};
const floatingIconBase = {
  position: 'absolute',
  fontSize: 38,
  opacity: 0.7,
  zIndex: 2,
  pointerEvents: 'none',
};
const floatingIconStyle1 = {
  ...floatingIconBase,
  left: 40,
  top: 40,
  animation: 'float1 5s ease-in-out infinite',
};
const floatingIconStyle2 = {
  ...floatingIconBase,
  right: 60,
  top: 60,
  animation: 'float2 6s ease-in-out infinite',
};
const floatingIconStyle3 = {
  ...floatingIconBase,
  left: '50%',
  bottom: 20,
  animation: 'float3 7s ease-in-out infinite',
};

// Add keyframes to the page (only once)
if (typeof window !== 'undefined' && !window.__agriscan_hero_anim) {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes wave {
      0% { transform: rotate(0deg); }
      20% { transform: rotate(-15deg); }
      40% { transform: rotate(10deg); }
      60% { transform: rotate(-10deg); }
      80% { transform: rotate(5deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes float1 {
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
    @keyframes fruitDrop {
      0% { opacity:1; transform: translateY(0) scale(1) rotate(0deg); }
      80% { opacity:1; }
      100% { opacity:0; transform: translateY(120px) scale(1.2) rotate(30deg); }
    }
    @keyframes notifSlide {
      0% { opacity:0; transform:translateY(-40px) scale(0.95); }
      60% { opacity:1; transform:translateY(0) scale(1.03); }
      100% { opacity:1; transform:translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);
  window.__agriscan_hero_anim = true;
}

export default App;