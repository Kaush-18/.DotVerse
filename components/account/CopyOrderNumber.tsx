"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyOrderNumber({ orderNumber }: { orderNumber: string }) {
  const [copied, setCopied] = useState(false);

  async function copyOrderNumber() {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyOrderNumber}
      className="dot-order-copy"
      aria-label={copied ? "Order number copied" : "Copy order number"}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      <span>{copied ? "Copied" : "Copy order number"}</span>
    </button>
  );
}
