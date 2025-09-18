import { useEffect, useState, useRef } from "react";
import { getGlobalCount, updateGlobalCount } from "./utils/api";

function App() {
  const [globalCount, setGlobalCount] = useState(null);
  const [localCount, setLocalCount] = useState(() => {
    const saved = localStorage.getItem("puthiyamukham_localCount");
    return saved !== null ? Number(saved) : 0;
  });
  const [popups, setPopups] = useState([]);

  const pendingCount = useRef(0);
  const audioRef = useRef(null);
  const popupIdRef = useRef(0);

  // Fetch global counter on mount
  useEffect(() => {
    async function fetchCount() {
      const data = await getGlobalCount();
      setGlobalCount(data.count);
    }
    fetchCount();
  }, []);

  // Save local counter to localStorage
  useEffect(() => {
    localStorage.setItem("puthiyamukham_localCount", localCount);
  }, [localCount]);

  // Sync pending clicks to global counter every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (pendingCount.current > 0) {
        try {
          await updateGlobalCount(pendingCount.current);
          const data = await getGlobalCount();
          setGlobalCount(data.count);
        } catch (err) {
          console.error("Sync failed:", err);
        }
        pendingCount.current = 0;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Remove popups individually after animation
  useEffect(() => {
    if (popups.length > 0) {
      const timer = setTimeout(() => {
        setPopups((prev) => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [popups]);

  const createPopup = () => {
    const popup = {
      id: ++popupIdRef.current,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
    };
    setPopups((prev) => [...prev, popup]);
  };

  const handleClick = () => {
    setLocalCount((prev) => prev + 1);
    pendingCount.current += 1;

    // Play click audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // Create popup animation
    createPopup();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1e1e1e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Audio element */}
      <audio ref={audioRef} preload="auto">
        <source src="click_audio.mp3" type="audio/mpeg" />
        <source src="click_audio.wav" type="audio/wav" />
      </audio>

      {/* Counter displays at top right */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <div
          style={{
            background: "#2c2c2c",
            padding: "8px 15px",
            borderRadius: "20px",
            fontSize: "1rem",
          }}
        >
          My Clicks: {localCount.toLocaleString()}
        </div>
        <div
          style={{
            background: "#2c2c2c",
            padding: "8px 15px",
            borderRadius: "20px",
            fontSize: "1rem",
          }}
        >
          All Clicks:{" "}
          {globalCount !== null ? globalCount.toLocaleString() : "Loading..."}
        </div>
      </div>

      {/* Big circular clicker button */}
      <button
        onClick={handleClick}
        style={{
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          border: "none",
          background: "#2c2c2c",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.6)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: 'url("clicker_img.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "transform 0.1s ease",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* Fallback text if image doesn't load */}
        <span style={{ fontSize: "2rem", color: "#aaa" }}></span>
      </button>

      {/* Popup animations */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          style={{
            position: "absolute",
            left: popup.x,
            top: popup.y,
            width: "80px",
            height: "130px",
            backgroundImage: 'url("pop_up_img.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
            animation: "popupFade 1s ease-out forwards",
            zIndex: 1000,
          }}
        />
      ))}

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          fontSize: "0.9rem",
          color: "#aaa",
          textAlign: "center",
        }}
      >
        <div>
          made by{" "}
          <a
            href="https://github.com/sanjaix21"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4da6ff", textDecoration: "none" }}
          >
            sanjaix21
          </a>
        </div>
        <div style={{ marginTop: "5px", fontSize: "0.8rem" }}>
          inspired from{" "}
          <a
            href="https://lizard.click"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4da6ff", textDecoration: "none" }}
          >
            lizard.click
          </a>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes popupFade {
          0% {
            opacity: 1;
            transform: scale(0.5) translateY(0px);
          }
          50% {
            opacity: 1;
            transform: scale(1) translateY(-20px);
          }
          100% {
            opacity: 0;
            transform: scale(1.2) translateY(-40px);
          }
        }
      `}</style>
    </div>
  );
}

export default App;

