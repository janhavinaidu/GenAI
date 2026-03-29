import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, SkipForward, VolumeX, Volume2, Maximize2, Activity } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function CinemaMode({ data, onClose }) {
  const [loading, setLoading] = useState(true);
  const [wrap, setWrap] = useState(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const utteranceRef = useRef(null);

  useEffect(() => {
    fetchWrap();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [data]);

  const fetchWrap = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/market-wrap`, { data });
      setWrap(res.data);
      setLoading(false);
    } catch (e) {
      console.error("Wrap failed", e);
      setLoading(false);
    }
  };

  // Handle Speech Synthesis
  useEffect(() => {
    if (!loading && wrap && isPlaying && !isMuted) {
      const scene = wrap.scenes[currentScene];
      if (scene && scene.text) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(scene.text);
        
        // Find a good premium-ish English voice if possible
        const voices = window.speechSynthesis.getVoices();
        const premiumVoice = voices.find(v => v.lang.includes("en-GB") || v.name.includes("Google UK English Male") || v.name.includes("Samantha"));
        if (premiumVoice) utterance.voice = premiumVoice;
        
        utterance.rate = 1.0;
        utterance.pitch = 0.95;
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    } else if (!isPlaying || isMuted) {
      window.speechSynthesis.cancel();
    }
  }, [loading, currentScene, isPlaying, isMuted, wrap]);

  useEffect(() => {
    let interval;
    if (!loading && wrap && isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (currentScene < wrap.scenes.length - 1) {
              setCurrentScene(s => s + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return p + (100 / (wrap.config.duration_per_scene * 20)); // ~50ms interval
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [loading, wrap, isPlaying, currentScene]);

  const handleClose = () => {
    window.speechSynthesis.cancel();
    onClose();
  };

  if (loading) return (
    <div className="cinema-overlay">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <div className="spinner" style={{ width: "64px", height: "64px" }} />
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#fff", marginBottom: "8px", fontSize: "1.5rem" }}>Synthesizing V-IQ Reel</h2>
          <p style={{ color: "var(--primary)", fontSize: "0.9rem", letterSpacing: "1px" }}>Compiling Technicals &amp; Corporate Signals...</p>
        </div>
      </div>
    </div>
  );

  const scene = wrap?.scenes[currentScene] || { text: "Market Overview", type: "intro" };
  const accent = wrap?.config?.accent_color || "var(--primary)";

  return (
    <div className="cinema-overlay">
      <button 
        style={{ 
          position: "absolute", top: "2rem", right: "2rem", 
          background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
          width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", cursor: "pointer", backdropFilter: "blur(10px)", zIndex: 10
        }} 
        onClick={handleClose}
      >
        <X size={24} />
      </button>
      
      <div className="cinema-container" style={{
        boxShadow: `0 0 120px ${accent}25`, border: `1px solid ${accent}40`,
      }}>
        
        {/* Cinematic Video Backgrounds */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#020617" }}>
          <div style={{
            position: "absolute", inset: "-50%", backgroundSize: "60px 60px",
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            transform: `perspective(500px) rotateX(60deg) translateY(${progress}%)`, opacity: 0.6
          }} />

          <div style={{ 
            position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${accent}33 0%, transparent 60%)`,
            animation: "pulse-glow 4s ease-in-out infinite alternate"
          }} />

          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            fontSize: "12rem", fontWeight: 900, color: "rgba(255,255,255,0.02)",
            whiteSpace: "nowrap", letterSpacing: "-5px", animation: "fadeIn 2s forwards"
          }}>
            {data?.ticker} {scene.type.toUpperCase()}
          </div>
        </div>

        {/* Top UI Overlay */}
        <div style={{ position: "absolute", top: "2rem", left: "2rem", display: "flex", gap: "1rem" }}>
          <div className="live-badge" style={{ borderColor: accent, color: accent }}>
            <div className="pulse-dot" style={{ background: accent }} />
            V-IQ AI ENGINE ACTIVE
          </div>
          <div style={{ 
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
            padding: "6px 16px", borderRadius: "100px", color: "var(--text-muted)",
            fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "8px"
          }}>
            <Activity size={14} color={isMuted ? "grey" : "white"} /> 
            {isMuted ? "Voice Synthesizer Muted" : "Voice Synthesizer Active"}
          </div>
        </div>

        {/* Scene Text Content */}
        <div className="cinema-scene">
          <div className="cinema-text-wrapper" key={currentScene} style={{ animation: "slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
            <div style={{ 
              color: accent, fontSize: "1rem", fontWeight: 700, 
              letterSpacing: "4px", textTransform: "uppercase", marginBottom: "1rem" 
            }}>
              BROADCAST 0{currentScene + 1} // {scene.type}
            </div>

            <div className="cinema-text" style={{ 
              fontSize: "2.8rem", textShadow: "0 4px 20px rgba(0,0,0,0.8)",
              background: "linear-gradient(to right, #ffffff, #94a3b8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              "{scene.text}"
            </div>
            
          </div>
          
          {/* Custom Video Player Controls */}
          <div style={{ 
            display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "3.5rem", color: "#fff",
            background: "rgba(0,0,0,0.6)", padding: "16px 24px", borderRadius: "16px", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ 
                background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", 
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                width: "40px", height: "40px", borderRadius: "50%"
              }}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: "3px" }} />}
            </button>

            {/* Timestamps */}
            <span style={{ fontSize: "0.85rem", fontVariantNumeric: "tabular-nums" }}>
              00:{String(currentScene * Number(wrap.config.duration_per_scene) + 
                  Math.floor((progress / 100) * Number(wrap.config.duration_per_scene))).padStart(2, '0')}
            </span>

            {/* Smart Progress Bar */}
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
              
              {Array.from({ length: currentScene }).map((_, i) => (
                <div key={i} style={{ 
                  position: "absolute", height: "4px", background: accent, opacity: 0.5,
                  width: `${100 / wrap.scenes.length}%`, left: `${(i / wrap.scenes.length) * 100}%`,
                  borderRadius: "4px"
                }} />
              ))}

              <div style={{ 
                position: "absolute", height: "4px", background: accent, zIndex: 2,
                left: `${(currentScene / wrap.scenes.length) * 100}%`,
                width: `${(progress / 100) * (100 / wrap.scenes.length)}%`,
                borderRadius: "4px", boxShadow: `0 0 10px ${accent}`
              }} />

              {wrap.scenes.map((_, i) => i > 0 && (
                <div key={`d-${i}`} style={{
                  position: "absolute", left: `${(i / wrap.scenes.length) * 100}%`,
                  width: "2px", height: "12px", background: "#000", zIndex: 3
                }} />
              ))}
            </div>

            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
              00:{wrap.scenes.length * Number(wrap.config.duration_per_scene)}
            </span>

            <div style={{ display: "flex", gap: "12px", color: "var(--text-muted)" }}>
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <Maximize2 size={20} />
            </div>
          </div>
        </div>
      </div>
      
      <p style={{ color: "var(--text-muted)", marginTop: "2rem", fontSize: "0.95rem", maxWidth: "600px", textAlign: "center", lineHeight: 1.6 }}>
        <strong style={{ color: "#fff" }}>PatternIQ V-IQ Engine:</strong> Auto-generated cinematic market brief synthesized from live chart data.
      </p>
    </div>
  );
}
