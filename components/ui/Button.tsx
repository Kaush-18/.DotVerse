"use client";

import Link from "next/link";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ButtonStyleProps = {
  variant?: "primary" | "secondary";
  className?: string;
  children?: ReactNode;
};

type ButtonProps = ButtonStyleProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

type LinkButtonProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

function getButtonClassName(
  variant: ButtonStyleProps["variant"],
  className?: string,
) {
  return cn(
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
    variant === "secondary"
      ? `
          border
          border-white/15
          bg-white/5
          text-white
          backdrop-blur-xl
          hover:bg-white/10
          hover:border-white/40
          hover:scale-105
        `
      : `
          bg-white
          text-black
          shadow-[0_10px_35px_rgba(0,0,0,.25)]
          hover:scale-105
          hover:bg-white/90
          hover:shadow-[0_15px_55px_rgba(0,0,0,.4)]
        `,
    className,
  );
}

function ButtonContent({ children }: { children?: ReactNode }) {
  return (
    <>
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
          bg-white/15
        "
      />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName(variant, className)}
      {...props}
    >
      <ButtonContent>{children}</ButtonContent>
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={getButtonClassName(variant, className)}
      {...props}
    >
      <ButtonContent>{children}</ButtonContent>
    </Link>
  );
}
