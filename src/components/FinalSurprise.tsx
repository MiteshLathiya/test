import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import FloatingHearts from "./FloatingHearts";
import Cake3D from "./Cake3D";
import ScratchCard from "./ScratchCard";
import { useCandleBlow, useUnlockHeart, useButtonClick } from "../hooks/useSounds";

interface FinalSurpriseProps {
  isUnlocked?: boolean;
}

// Emotional message for the finale
const EMOTIONAL_MESSAGE = `You came into my life and changed everything.
Before you, I didn't know love like this existed.
You are not just my girlfriend,
You are my home, my peace, my happiness.

Wish you very very Happy Birthday, My Love. 🤍`;

// Photo of together (placeholder - replace with actual photo)
const TOGETHER_PHOTO = "/assets/images/birthday-memory.JPG";

// Background photo for finale
const FINALE_PHOTO = "/assets/images/TILC5470.JPG";

// Enhanced fireworks system (reduced confetti)
const launchFirework = (x: number, y: number) => {
  const colors = ["#e88ca5", "#b76e79", "#ffd1dc", "#ff69b4", "#ff1493", "#f4c2c2", "#e6a4b4"];
  
  // Main burst (reduced from 80 to 40)
  confetti({
    particleCount: 40,
    spread: 100,
    origin: { x, y },
    colors,
    ticks: 200,
    gravity: 1.2,
    scalar: 1.2,
    shapes: ["circle", "heart"],
  });

  // Secondary burst (reduced from 40 to 20)
  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 80,
      origin: { x: x + (Math.random() - 0.5) * 0.2, y: y + (Math.random() - 0.5) * 0.2 },
      colors: ["#ffd700", "#ff69b4", "#ff1493"],
      angle: Math.random() * 360,
      shapes: ["star"],
    });
  }, 200);
};

// Multi-burst fireworks sequence (reduced)
const launchFireworksSequence = () => {
  // Initial burst
  launchFirework(0.5, 0.3);
  
  // Delayed bursts (reduced from 5 to 2)
  setTimeout(() => launchFirework(0.3, 0.4), 300);
  setTimeout(() => launchFirework(0.7, 0.4), 600);
  
  // Center explosion (reduced from 200 to 80)
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 150,
      origin: { y: 0.4 },
      colors: ["#e88ca5", "#ffd700", "#ff69b4", "#ff1493"],
      ticks: 300,
      gravity: 0.8,
      shapes: ["circle", "heart", "star"],
    });
  }, 1000);
};

const FinalSurprise = ({ isUnlocked = true }: FinalSurpriseProps) => {
  // Sound hooks
  const playCandleBlow = useCandleBlow();
  const playUnlockHeart = useUnlockHeart();
  const playClick = useButtonClick();

  // Simplified states - no key/lock needed
  const [showCake, setShowCake] = useState(true);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const confettiIntervalRef = useRef<number | null>(null);

  // Fireworks on reveal (reduced frequency)
  const startFireworks = useCallback(() => {
    // Initial burst
    launchFireworksSequence();
    
    // Continuous fireworks (reduced from 800ms to 2000ms)
    confettiIntervalRef.current = window.setInterval(() => {
      const x = Math.random() * 0.6 + 0.2;
      const y = Math.random() * 0.3 + 0.2;
      launchFirework(x, y);
    }, 2000);
  }, []);

  // Stop fireworks
  const stopFireworks = useCallback(() => {
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopFireworks();
  }, [stopFireworks]);

  // Handle candle blown - show scratch card first
  const handleCandleBlown = useCallback(() => {
    setCandleBlown(true);
    // Sound #12 - blowing candle + magical sparkle
    playCandleBlow();
    // Show scratch card after a short delay
    setTimeout(() => setShowScratchCard(true), 1000);
    startFireworks();
  }, [startFireworks, playCandleBlow]);

  // Handle scratch card reveal - show final message
  const handleScratchReveal = useCallback(() => {
    setShowScratchCard(false);
    // Sound #15 - unlock heart / success
    playUnlockHeart();
    // Show full message after a short delay
    setTimeout(() => setShowFullMessage(true), 500);
    startFireworks();
  }, [startFireworks, playUnlockHeart]);

  // Show lock screen if not unlocked through the journey
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
        <FloatingHearts count={30} sparkles={true} />
        
        <motion.div
          className="z-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔒
          </motion.div>
          <h2 className="text-3xl font-display text-gradient-rose mb-4">
            Complete the Journey First 💝
          </h2>
          <p className="text-muted-foreground font-body">
            Unlock all memories to reveal your surprise!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 px-4 relative overflow-hidden">
      {/* Background image with low opacity and blur - only show after scratch */}
      {showFullMessage && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 blur-sm"
          style={{
            backgroundImage: `url(${FINALE_PHOTO})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* More hearts and sparkles for finale */}
      <FloatingHearts count={25} sparkles={true} />

      <AnimatePresence mode="wait">
        {/* Cake Phase - Show directly without key/lock */}
        {!candleBlown && showCake && (
          <motion.div
            key="cake-reveal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ transform: 'none' }}
          >
            <Cake3D onCandleBlown={handleCandleBlown} />
          </motion.div>
        )}

        {/* Scratch Card Phase */}
        {candleBlown && showScratchCard && (
          <motion.div
            key="scratch-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="z-10"
          >
            <ScratchCard onReveal={handleScratchReveal} />
          </motion.div>
        )}

        {/* Final Message - Emotional Peak */}
        {candleBlown && showFullMessage && (
          <motion.div
            key="content"
            className="z-10 text-center max-w-4xl w-full px-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {/* Animated decorations */}
            <motion.div
              className="flex justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {["🎉", "🎊", "🎂", "🎈", "💕", "🎈", "🎊"].map((emoji, i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>

            {/* Big Photo Together */}
            <motion.div
              className="relative mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.3, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            >
              <div className="relative inline-block">
                {/* Photo frame with glow */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                  <img
                    src={TOGETHER_PHOTO}
                    alt="Us together"
                    className="w-64 h-64 md:w-80 md:h-80 object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  {/* Fallback emoji when image fails */}
                  <div
                    className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-soft-pink to-primary/30 flex items-center justify-center hidden"
                  >
                    <span className="text-8xl">💕</span>
                  </div>
                </div>
                {/* Floating hearts around photo */}
                <motion.span
                  className="absolute -top-4 -left-4 text-4xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💖
                </motion.span>
                <motion.span
                  className="absolute -bottom-2 -right-4 text-3xl"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                >
                  💝
                </motion.span>
              </div>
            </motion.div>

            {/* Main Birthday Message - More visible */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-rose-700 mb-8 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 20px rgba(219, 39, 119, 0.5)",
                    "0 0 40px rgba(219, 39, 119, 0.8)",
                    "0 0 60px rgba(219, 39, 119, 1)",
                    "0 0 40px rgba(219, 39, 119, 0.8)",
                    "0 0 20px rgba(219, 39, 119, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Happy Birthday Dhingu ❤️
              </motion.span>
            </motion.h1>

            {/* Long Emotional Message - Dark background for visibility */}
            <motion.div
              className="bg-gradient-to-br from-rose-900/80 to-pink-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-8 border border-pink-400/30 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.p
                className="text-lg md:text-xl lg:text-2xl font-display leading-relaxed text-pink-100 whitespace-pre-line"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                {EMOTIONAL_MESSAGE}
              </motion.p>
            </motion.div>

            {/* Final signature with extra love */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: "spring" }}
            >
              <motion.p
                className="text-3xl md:text-4xl font-display italic text-white-700"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Forever yours — Mitss 🤍
              </motion.p>
            </motion.div>

            {/* Floating hearts row */}
            <motion.div
              className="mt-10 flex justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              {[...Array(9)].map((_, i) => (
                <motion.span
                  key={i}
                  className="text-primary"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  style={{ fontSize: 16 + i * 2 }}
                >
                  ♥
                </motion.span>
              ))}
            </motion.div>

            {/* Additional romantic elements */}
            <motion.div
              className="mt-8 flex justify-center items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <span className="text-2xl">💗</span>
              <span className="text-rose-700 font-display text-lg">You are my everything</span>
              <span className="text-2xl">💗</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalSurprise;
