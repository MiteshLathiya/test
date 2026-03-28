import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMemoryReveal, useUnlockHeart } from "../hooks/useSounds";

interface Memory {
  id: number;
  date: string;
  caption: string;
  type: "image" | "video";
  src: string;
  placeholder: string;
}

interface MemoryGalleryProps {
  onReveal: (id: number) => void;
  onAllRevealed: () => void;
  revealedCount: number;
  totalCount: number;
  onComplete: () => void;
}

const memories: Memory[] = [
  {
    id: 1,
    date: "18 April 2023",
    caption: "The first time I told you I love you ❤️",
    type: "image",
    src: "/assets/images/first-love-you.jpeg",
    placeholder: "📸",
  },
  {
    id: 2,
    date: "16 April 2023",
    caption: "Our first hug 🤗",
    type: "image",
    src: "/assets/images/first-hug.jpeg",
    placeholder: "🤗",
  },
  {
    id: 3,
    date: "24 September 2023",
    caption: "Our first kiss 💋",
    type: "image",
    src: "/assets/images/first-kiss.JPG",
    placeholder: "💋",
  },
  {
    id: 4,
    date: "23 March 2024",
    caption: "Birthday Memory",
    type: "image",
    src: "/assets/images/birthday-memory.JPG",
    placeholder: "🎆",
  },
];

const MemoryGallery = ({
  onReveal,
  onAllRevealed,
  revealedCount,
  totalCount,
  onComplete,
}: MemoryGalleryProps) => {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playMemoryReveal = useMemoryReveal();
  const playUnlockHeart = useUnlockHeart();

  const handleReveal = useCallback(
    (memory: Memory) => {
      if (!revealed.has(memory.id)) {
        const newRevealed = new Set(revealed);
        newRevealed.add(memory.id);
        setRevealed(newRevealed);
        
        // Sound #8 - soft emotional piano note/chime
        playMemoryReveal();
        
        onReveal(memory.id);

        if (newRevealed.size === totalCount) {
          // Sound #15 - unlock heart / success sound when all revealed
          playUnlockHeart();
          onAllRevealed();
        }
      }
      setSelectedMemory(memory);
    },
    [revealed, onReveal, onAllRevealed, totalCount, playMemoryReveal, playUnlockHeart]
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const allRevealed = revealed.size === totalCount;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
      <motion.h2
        className="text-3xl md:text-4xl font-display text-gradient-rose mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Our Journey 💕
      </motion.h2>

      <motion.p
        className="text-muted-foreground font-body mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Click on a card to reveal our special memories, Dhingu 💕
      </motion.p>

      {/* Progress indicator */}
      <motion.div
        className="mb-8 px-6 py-3 rounded-full bg-secondary/80 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {Array.from({ length: totalCount }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < revealed.size ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: 1,
                  backgroundColor: i < revealed.size
                    ? "hsl(340 60% 65%)"
                    : "hsl(340 20% 80%)",
                }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
          <span className="font-body text-sm text-muted-foreground">
            {revealedCount} of {totalCount} memories revealed
          </span>
          {allRevealed && (
            <motion.span
              className="ml-2 text-primary font-semibold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              ✨ All unlocked!
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
        {memories.map((memory, index) => (
          <div key={memory.id} className="flex flex-col">
            {/* Card - clickable to reveal */}
            <motion.div
              className={`relative cursor-pointer overflow-hidden rounded-2xl aspect-[4/5] ${
                revealed.has(memory.id)
                  ? "border-2 border-primary/30"
                  : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(255, 182, 193, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleReveal(memory)}
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-soft-pink to-primary/20" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                {!revealed.has(memory.id) ? (
                  <>
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔒
                    </motion.div>
                    <p className="font-body text-muted-foreground">
                      Tap to reveal
                    </p>
                  </>
                ) : (
                  <>
                    {/* Full image when revealed */}
                    <img
                      src={memory.src}
                      alt={memory.caption}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        // Show placeholder when image fails to load
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = "flex";
                        }
                      }}
                    />
                    {/* Fallback placeholder */}
                    <div
                      className="w-full h-full hidden flex-col items-center justify-center bg-gradient-to-br from-soft-pink to-primary/20 p-8 text-center"
                    >
                      <span className="text-6xl mb-4">{memory.placeholder}</span>
                      <p className="font-body text-muted-foreground text-sm">
                        {memory.caption}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Lock overlay */}
              {!revealed.has(memory.id) && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <motion.div
                    className="text-4xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💝
                  </motion.div>
                </div>
              )}

              {/* Glow border when revealed */}
              {revealed.has(memory.id) && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-primary/50"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    boxShadow: [
                      "0 0 10px rgba(255, 182, 193, 0.3)",
                      "0 0 20px rgba(255, 182, 193, 0.5)",
                      "0 0 10px rgba(255, 182, 193, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Content below the card - when revealed */}
            {revealed.has(memory.id) && (
              <div className="mt-3 text-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 rounded-xl border border-rose-200 shadow-sm">
                <p className="font-display text-lg text-rose-700 flex items-center justify-center gap-2">
                  <span className="text-lg">📅</span>
                  {memory.date}
                </p>
                <p className="font-body text-sm text-rose-600 mt-2 flex items-center justify-center gap-2">
                  <span className="text-base">{memory.placeholder}</span>
                  {memory.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <motion.button
        onClick={onComplete}
        disabled={!allRevealed}
        className={`mt-12 px-8 py-4 rounded-full font-body font-bold text-lg transition-all ${
          allRevealed
            ? "bg-primary text-primary-foreground glow-pink cursor-pointer hover:scale-105"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={allRevealed ? { scale: 1.05 } : {}}
        whileTap={allRevealed ? { scale: 0.95 } : {}}
      >
        {allRevealed ? "Continue Our Journey 💕" : "Unlock all memories to continue"}
      </motion.button>
    </div>
  );
};

export default MemoryGallery;
