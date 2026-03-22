import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
  voiceMessageSrc?: string; // Path to voice message audio file
}

// Particle interface for canvas
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  blur: number;
}

const LoadingScreen = ({ onComplete, voiceMessageSrc }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceEnded, setVoiceEnded] = useState(false);
  const [hasStartedVoice, setHasStartedVoice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const voiceAudioRef = useRef<HTMLAudioElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Initialize particles
  const initParticles = useCallback(() => {
    const particles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: 8 + Math.random() * 20,
      speedY: 0.3 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0.2 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      blur: Math.random() * 2,
    }));
    particlesRef.current = particles;
  }, [dimensions.width, dimensions.height]);

  // Draw heart shape
  const drawHeart = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      blur: number,
      rotation: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      if (blur > 0) {
        ctx.filter = `blur(${blur}px)`;
      }

      // Create gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(0.4, `rgba(255, 200, 210, ${opacity * 0.7})`);
      gradient.addColorStop(0.7, `rgba(255, 150, 180, ${opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(255, 120, 160, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();

      const scale = size / 20;
      ctx.moveTo(0, -8 * scale);
      ctx.bezierCurveTo(0, -15 * scale, -15 * scale, -15 * scale, -15 * scale, -5 * scale);
      ctx.bezierCurveTo(-15 * scale, 5 * scale, 0, 15 * scale, 0, 25 * scale);
      ctx.bezierCurveTo(0, 15 * scale, 15 * scale, 5 * scale, 15 * scale, -5 * scale);
      ctx.bezierCurveTo(15 * scale, -15 * scale, 0, -15 * scale, 0, -8 * scale);

      ctx.fill();

      // Outer glow
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.shadowBlur = 15;
      ctx.globalAlpha = opacity * 0.4;
      ctx.fill();

      ctx.restore();
    },
    []
  );

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    particlesRef.current.forEach((particle) => {
      particle.y -= particle.speedY;
      particle.x += particle.speedX;
      particle.rotation += particle.rotationSpeed;

      // Wrap around
      if (particle.y < -particle.size) {
        particle.y = dimensions.height + particle.size;
        particle.x = Math.random() * dimensions.width;
      }
      if (particle.x < -particle.size) particle.x = dimensions.width + particle.size;
      if (particle.x > dimensions.width + particle.size) particle.x = -particle.size;

      drawHeart(
        ctx,
        particle.x,
        particle.y,
        particle.size,
        particle.opacity,
        particle.blur,
        particle.rotation
      );
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, drawHeart]);

  // Start animation
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    initParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, initParticles, animate]);

  // Voice message playback - plays only once
  const handlePlayVoice = useCallback(() => {
    if (voiceAudioRef.current && !hasStartedVoice) {
      voiceAudioRef.current.play()
        .then(() => {
          setIsVoicePlaying(true);
          console.log("Voice message playing!");
        })
        .catch((err) => {
          console.log("Could not play voice:", err.message);
        });
    }
  }, [hasStartedVoice]);

  useEffect(() => {
    if (!voiceMessageSrc) return;
    
    // Try to autoplay when audio is loaded
    if (voiceAudioRef.current && voiceAudioRef.current.readyState >= 2 && !hasStartedVoice) {
      handlePlayVoice();
    }
  }, [voiceMessageSrc, handlePlayVoice, hasStartedVoice]);

  // Update voice progress
  const handleVoiceTimeUpdate = useCallback(() => {
    if (voiceAudioRef.current && voiceAudioRef.current.duration) {
      console.log("Voice playing:", voiceAudioRef.current.currentTime, "/", voiceAudioRef.current.duration);
    }
  }, []);

  const handleVoiceEnded = useCallback(() => {
    // Explicitly pause and reset the audio
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    setIsVoicePlaying(false);
    setVoiceEnded(true);
    // Complete immediately when voice ends - go to next page fast
    setIsComplete(true);
  }, []);

  const handleVoiceCanPlay = useCallback(() => {
    console.log("Voice message loaded, attempting to play...");
    // Try to play when loaded
    if (voiceAudioRef.current && !hasStartedVoice) {
      voiceAudioRef.current.play()
        .then(() => {
          setIsVoicePlaying(true);
          setHasStartedVoice(true);
          console.log("Voice message started playing!");
        })
        .catch((err) => {
          console.log("Could not auto-play voice:", err.message);
        });
    }
  }, [hasStartedVoice]);

  // Progress animation - slow fill over ~8 seconds (or waits for voice to end)
  useEffect(() => {
    const totalDuration = 8000; // 8 seconds for dramatic effect
    const intervalTime = 50;
    const increment = (100 / totalDuration) * intervalTime;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          // If there's a voice message, wait for it to end before completing
          if (voiceMessageSrc && !voiceEnded) {
            // Just keep at 100% until voice ends
            return 100;
          }
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [voiceMessageSrc, voiceEnded]);

  // When voice ends and complete flag is set, move to next page immediately
  useEffect(() => {
    if (isComplete && voiceEnded) {
      onComplete();
    }
  }, [isComplete, voiceEnded, onComplete]);

  // Cleanup: stop audio when component unmounts (when transitioning to welcome)
  useEffect(() => {
    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Also complete after 8 seconds even without voice message
  useEffect(() => {
    if (!voiceMessageSrc && progress >= 100 && !isComplete) {
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => onComplete(), 1500);
      }, 500);
    }
  }, [progress, isComplete, onComplete, voiceMessageSrc]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isComplete ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(135deg, #1a0a1a 0%, #2d1f3d 25%, #1f1528 50%, #2a1829 75%, #1a0a1a 100%)",
          }}
        >
          {/* Voice Message Audio Element - plays once, no loop */}
          {voiceMessageSrc && (
            <audio
              key="voice-audio-element"
              ref={voiceAudioRef}
              src={voiceMessageSrc}
              preload="auto"
              loop={false}
              onCanPlay={handleVoiceCanPlay}
              onTimeUpdate={handleVoiceTimeUpdate}
              onEnded={handleVoiceEnded}
              onError={(e) => console.log("Voice message error:", e)}
            />
          )}

          {/* Canvas for particles */}
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.8 }}
          />

          {/* Ambient light orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255, 182, 193, 0.15) 0%, transparent 70%)",
                top: "10%",
                left: "20%",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-80 h-80 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255, 200, 220, 0.12) 0%, transparent 70%)",
                bottom: "15%",
                right: "15%",
              }}
              animate={{
                scale: [1.3, 1, 1.3],
                opacity: [0.6, 0.4, 0.6],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-6 max-w-2xl">
            {/* Heart icon */}
            <motion.div
              className="text-7xl mb-8"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              💕
            </motion.div>

            {/* Main text */}
            <motion.p
              className="text-2xl md:text-3xl font-display text-white/90 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                textShadow: "0 0 30px rgba(255, 182, 193, 0.5)",
              }}
            >
              Put on your headphones.
              <br />
              <span className="text-primary/90">I made this for you.</span>
            </motion.p>

            {/* Voice Message Prompt - shown below the main text */}
            {voiceMessageSrc && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {!voiceEnded ? (
                  <button
                    onClick={handlePlayVoice}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {isVoicePlaying ? (
                      <>
                        <motion.div
                          className="flex gap-1 items-end h-5"
                          animate={{ gap: ["2px", "4px", "2px"] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-primary rounded-full"
                              animate={{
                                height: [8, 16, 10, 20, 8],
                              }}
                              transition={{
                                duration: 0.4,
                                repeat: Infinity,
                                delay: i * 0.08,
                              }}
                            />
                          ))}
                        </motion.div>
                        <span className="text-white/80 font-body text-sm">
                          Playing your message...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🎤</span>
                        <span className="text-white/80 font-body text-lg">
                          Tap to hear my voice 💕
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <motion.p
                    className="text-white/60 font-body text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Thank you for listening ❤️
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Progress bar container */}
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Progress track */}
              <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                {/* Progress fill */}
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #ffb6c1 0%, #ff69b4 50%, #ffb6c1 100%)",
                    boxShadow: "0 0 20px rgba(255, 182, 193, 0.8), 0 0 40px rgba(255, 105, 180, 0.4)",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                      "linear-gradient(90deg, transparent 100%, rgba(255,255,255,0.3) 50%, transparent 0%)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>

              {/* Loading text */}
              <motion.p
                className="mt-4 text-white/50 text-sm font-body"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progress < 30
                  ? "Loading memories..."
                  : progress < 60
                  ? "Preparing surprises..."
                  : progress < 90
                  ? "Almost ready..."
                  : "Get ready! 💕"}
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom fade overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(26, 10, 26, 0.8) 0%, transparent 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
