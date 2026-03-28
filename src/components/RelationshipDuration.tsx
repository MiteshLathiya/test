import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RelationshipDurationProps {
  // Start date of the relationship (default to a placeholder date)
  startDate?: Date;
  className?: string;
  onComplete?: () => void;
  autoAdvanceDelay?: number; // milliseconds before auto-advancing
}

// Relationship start date - you can modify this
const RELATIONSHIP_START_DATE = new Date("2023-04-18T00:54:00");

const RelationshipDuration = ({ 
  startDate = RELATIONSHIP_START_DATE,
  className = "",
  onComplete,
  autoAdvanceDelay = 8000
}: RelationshipDurationProps) => {
  const [duration, setDuration] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [prevDuration, setPrevDuration] = useState(duration);

  useEffect(() => {
    const calculateDuration = () => {
      const now = new Date();
      const start = startDate instanceof Date ? startDate : new Date(startDate);
      const diff = now.getTime() - start.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setPrevDuration(duration);
    setDuration(calculateDuration());

    // Update every second
    const interval = setInterval(() => {
      setPrevDuration(duration);
      setDuration(calculateDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  // Auto-advance after delay
  useEffect(() => {
    if (onComplete && autoAdvanceDelay > 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [onComplete, autoAdvanceDelay]);

  // Animated number component
  const AnimatedNumber = ({ value, prevValue, label }: { 
    value: number; 
    prevValue: number;
    label: string;
  }) => {
    const hasChanged = value !== prevValue;

    return (
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={value}
              initial={hasChanged ? { y: 20, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-4xl md:text-5xl font-display font-bold text-gradient-rose">
                {String(value).padStart(2, "0")}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="text-xs md:text-sm text-pink-400 font-body mt-2 uppercase tracking-wider">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-center ${className}`}>
      {/* Title */}
      <motion.h2
        className="text-2xl md:text-3xl font-display font-bold text-gradient-rose mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Time I have loved you
      </motion.h2>

      {/* Duration Display */}
      <div className="flex items-center justify-center gap-4 md:gap-8">
        <AnimatedNumber 
          value={duration.days} 
          prevValue={prevDuration.days}
          label="Days" 
        />
        
        <span className="text-3xl text-pink-300 font-light mt-[-20px]">:</span>
        
        <AnimatedNumber 
          value={duration.hours} 
          prevValue={prevDuration.hours}
          label="Hours" 
        />
        
        <span className="text-3xl text-pink-300 font-light mt-[-20px]">:</span>
        
        <AnimatedNumber 
          value={duration.minutes} 
          prevValue={prevDuration.minutes}
          label="Minutes" 
        />
      </div>

      {/* Subtitle with heart */}
      <motion.p
        className="text-sm md:text-base text-muted-foreground font-body mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        And counting... 💕
      </motion.p>

      {/* Continue Button */}
      {onComplete && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.button
            onClick={onComplete}
            className="px-6 py-3 rounded-full bg-primary/20 text-primary font-body font-semibold text-sm border border-primary/30 hover:bg-primary/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue 💫
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default RelationshipDuration;
