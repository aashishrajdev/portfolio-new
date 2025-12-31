"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = ["Hi There,", "Welcome to my portfolio"];

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });

    // The text animation takes roughly 2.2s.
    // We wait a bit, then trigger onFinish which allows AnimatePresence to unmount us.
    // The exit animation then runs.
    const timer = setTimeout(onFinish, 2300);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const containerVariants: Variants = {
    initial: { opacity: 1 },
    enter: { opacity: 1 },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const columnVariants: Variants = {
    initial: {
      y: 0,
    },
    enter: {
      y: 0,
    },
    // i is passed as custom prop
    exit: (i: number) => ({
      y: i % 2 === 0 ? "-100%" : "100%",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    }),
  };

  const textVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    enter: (i: number) => ({
      opacity: [0, 1, 0.8],
      y: 0,
      transition: {
        delay: i * 0.45,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed inset-0 z-[100] cursor-wait"
    >
      {/* Background Columns */}
      <div className="absolute inset-0 flex h-full w-full pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={columnVariants}
            className="relative h-full flex-1 bg-[#fffaeb]"
          />
        ))}
      </div>

      {/* Centered Text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        variants={{ exit: { opacity: 0, transition: { duration: 0.5 } } }}
      >
        <div className="text-center font-serif text-black tracking-widest text-lg md:text-xl select-none">
          {LINES.map((line, i) => (
            <motion.div
              key={line}
              custom={i}
              variants={textVariants}
              className="mb-2"
            >
              {line}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
