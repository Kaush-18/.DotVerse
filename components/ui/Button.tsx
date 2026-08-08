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
        `
        group
        relative
        overflow-hidden
        rounded-full
        px-8
        py-4
        text-sm
        font-semibold
        tracking-wide
        transition-all
        duration-500
        ease-out
        active:scale-95
        `,
        variant === "primary"
          ? `
            bg-gradient-to-r
            from-violet-700
            via-violet-600
            to-indigo-600
            text-white
            shadow-[0_10px_35px_rgba(124,58,237,.35)]
            hover:scale-105
            hover:shadow-[0_15px_55px_rgba(124,58,237,.55)]
          `
          : `
            border
            border-white/15
            bg-white/5
            text-white
            backdrop-blur-xl
            hover:bg-white/10
            hover:border-violet-500/50
            hover:scale-105
          `,
        className
      )}
      {...props}
    >
      {/* Shine Animation */}
      <span
        className="
          absolute
          inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          transition-transform
          duration-1000
          group-hover:translate-x-full
        "
      />

      {/* Glow */}
      <span
        className="
          absolute
          inset-0
          rounded-full
          opacity-0
          blur-xl
          transition-opacity
          duration-500
          group-hover:opacity-100
          bg-violet-500/20
        "
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}