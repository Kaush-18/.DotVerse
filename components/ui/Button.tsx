import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full px-8 py-4 font-semibold transition-all duration-300",
        variant === "primary"
          ? "bg-primary text-white hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.45)]"
          : "border border-white/20 bg-white/5 backdrop-blur hover:border-primary hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
