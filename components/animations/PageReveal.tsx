"use client";

import { motion } from "framer-motion";

interface PageRevealProps {
  children: React.ReactNode;
}

export default function PageReveal({
  children,
}: PageRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: "blur(20px)",
        scale: 1.02,
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
      }}
      transition={{
        duration: 1.3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}