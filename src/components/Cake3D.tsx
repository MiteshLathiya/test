import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Cake3DProps {
  onCandleBlown?: () => void;
}

const Cake3D = ({ onCandleBlown }: Cake3DProps) => {
  const [candleLit, setCandleLit] = useState(true);
  const [showSmoke, setShowSmoke] = useState(false);
  const [isBlown, setIsBlown] = useState(false);

  const handleBlow = () => {
    if (!candleLit || isBlown) return;

    setCandleLit(false);
    setIsBlown(true);
    setShowSmoke(true);

    setTimeout(() => {
      setShowSmoke(false);
      onCandleBlown?.();
    }, 2000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Main Cake Container */}
      <div 
        className="relative cursor-pointer"
        onClick={handleBlow}
        title="Click to blow out the candle!"
      >
        {/* SVG Cake */}
        <svg width="400" height="400" viewBox="0 0 280 280" className="drop-shadow-xl">
          {/* Cake Plate */}
          <ellipse cx="140" cy="265" rx="120" ry="15" fill="#d1d5db" />
          <ellipse cx="140" cy="260" rx="110" ry="12" fill="#e5e7eb" />
          
          {/* Cake Bottom Layer */}
          <rect x="50" y="200" width="180" height="55" rx="8" fill="#ec4899" />
          <rect x="50" y="200" width="180" height="50" rx="8" fill="#f472b6" />
          {/* Bottom layer decorations */}
          <circle cx="70" cy="215" r="4" fill="white" opacity="0.6" />
          <circle cx="90" cy="225" r="4" fill="white" opacity="0.6" />
          <circle cx="110" cy="215" r="4" fill="white" opacity="0.6" />
          <circle cx="140" cy="230" r="4" fill="white" opacity="0.6" />
          <circle cx="170" cy="215" r="4" fill="white" opacity="0.6" />
          <circle cx="190" cy="225" r="4" fill="white" opacity="0.6" />
          <circle cx="210" cy="215" r="4" fill="white" opacity="0.6" />
          
          {/* Cake Middle Layer */}
          <rect x="70" y="155" width="140" height="50" rx="6" fill="#f9a8d4" />
          <rect x="70" y="155" width="140" height="45" rx="6" fill="#f472b6" />
          {/* Middle layer decorations */}
          <circle cx="90" cy="170" r="3" fill="white" opacity="0.6" />
          <circle cx="115" cy="180" r="3" fill="white" opacity="0.6" />
          <circle cx="140" cy="170" r="3" fill="white" opacity="0.6" />
          <circle cx="165" cy="180" r="3" fill="white" opacity="0.6" />
          <circle cx="190" cy="170" r="3" fill="white" opacity="0.6" />
          
          {/* Cake Top Layer */}
          <rect x="90" y="115" width="100" height="45" rx="5" fill="#ec4899" />
          <rect x="90" y="115" width="100" height="40" rx="5" fill="#f472b6" />
          {/* Top layer decorations */}
          <circle cx="110" cy="130" r="3" fill="white" opacity="0.6" />
          <circle cx="140" cy="135" r="3" fill="white" opacity="0.6" />
          <circle cx="170" cy="130" r="3" fill="white" opacity="0.6" />
          
          {/* Frosting Drips */}
          <path d="M50 200 Q55 215 60 200" fill="#f472b6" />
          <path d="M100 200 Q105 220 110 200" fill="#f472b6" />
          <path d="M170 200 Q175 220 180 200" fill="#f472b6" />
          <path d="M220 200 Q225 215 230 200" fill="#f472b6" />
          
          {/* Candle */}
          <rect x="135" y="70" width="10" height="50" rx="2" fill="#fbbf24" />
          <rect x="135" y="75" width="10" height="3" fill="#f59e0b" />
          <rect x="135" y="85" width="10" height="3" fill="#f59e0b" />
          <rect x="135" y="95" width="10" height="3" fill="#f59e0b" />
          
          {/* Wick */}
          <line x1="140" y1="70" x2="140" y2="65" stroke="#374151" strokeWidth="2" />
          
          {/* Flame */}
          <AnimatePresence>
            {candleLit && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Outer flame */}
                <ellipse cx="140" cy="55" rx="12" ry="18" fill="#f97316" opacity="0.8">
                  <animate attributeName="ry" values="18;20;18" dur="0.4s" repeatCount="indefinite" />
                </ellipse>
                {/* Middle flame */}
                <ellipse cx="140" cy="55" rx="8" ry="14" fill="#fbbf24">
                  <animate attributeName="ry" values="14;16;14" dur="0.3s" repeatCount="indefinite" />
                </ellipse>
                {/* Inner flame */}
                <ellipse cx="140" cy="55" rx="4" ry="10" fill="#fef3c7">
                  <animate attributeName="ry" values="10;12;10" dur="0.2s" repeatCount="indefinite" />
                </ellipse>
                {/* Glow */}
                <circle cx="140" cy="55" r="25" fill="#fbbf24" opacity="0.2">
                  <animate attributeName="r" values="25;30;25" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.3;0.2" dur="1s" repeatCount="indefinite" />
                </circle>
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Smoke Effect */}
          <AnimatePresence>
            {showSmoke && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={140 + (Math.random() - 0.5) * 30}
                    cy={50}
                    r="5"
                    fill="#9ca3af"
                    opacity="0.5"
                    initial={{ cy: 50, opacity: 0.5 }}
                    animate={{ 
                      cy: 20 - i * 5,
                      cx: 140 + (Math.random() - 0.5) * 60,
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 1.5, 
                      delay: i * 0.15,
                      repeat: Infinity
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </svg>

        {/* Happy Birthday Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 text-white text-sm font-bold tracking-wider whitespace-nowrap z-10" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
          HAPPY BIRTHDAY
        </div>

        {/* Instructions */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-pink-400 whitespace-nowrap font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {candleLit ? "🕯️ Click to blow out the candle!" : "✨ Make a wish! 🎂"}
        </motion.div>
      </div>
    </div>
  );
};

export default Cake3D;
