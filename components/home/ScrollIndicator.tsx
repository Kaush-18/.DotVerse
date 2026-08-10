"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4, duration: 0.8 }}
      className="scroll-indicator"
    >
      <div className="scroll-indicator-label">
        <span>SCROLL</span>
        <span className="scroll-indicator-dot" />
      </div>

      <div className="scroll-indicator-line" />
    </motion.div>
  );
}