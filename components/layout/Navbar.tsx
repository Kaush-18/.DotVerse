"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/layout/Container";
import Logo from "@/components/ui/Logo";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Track Order", href: "/track-order" },
  { label: "Collections", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent background scroll when menu is open without layout shift
  useEffect(() => {
    if (isMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className="
        sticky
        top-0
        z-[1000]
        w-full
        h-[var(--navbar-height)]
        bg-[#05020c]/82
        backdrop-blur-[18px]
        border-b
        border-white/[0.08]
      "
    >
      <Container className="relative z-10">
        <div
          className="
            flex
            h-[var(--navbar-height)]
            min-h-[var(--navbar-height)]
            items-center
            justify-between
          "
        >
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0"
          >
            <Logo />
          </motion.div>

          {/* DESKTOP NAVIGATION */}
          <nav
            className="
              hidden
              items-center
              gap-8
              min-[901px]:flex
              lg:gap-10
            "
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative whitespace-nowrap py-2 text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white lg:text-[15px]"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 rounded-full bg-violet-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* ACTIONS & HAMBURGER */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button type="button" aria-label="Search" className="group rounded-full p-2.5 text-white/65 transition-all duration-300 hover:bg-white/[0.07] hover:text-white">
              <Search size={20} strokeWidth={1.7} />
            </button>

            <Link href="/cart" className="group relative rounded-full p-2.5 text-white/65 transition-all duration-300 hover:bg-white/[0.07] hover:text-white" aria-label="Shopping bag">
              <ShoppingBag size={20} strokeWidth={1.7} />
              {totalItems > 0 && <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">{totalItems}</span>}
            </Link>

            <button type="button" aria-label="Account" className="group hidden rounded-full p-2.5 text-white/65 transition-all duration-300 hover:bg-white/[0.07] hover:text-white sm:block">
              <User size={20} strokeWidth={1.7} />
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="min-[901px]:hidden rounded-full p-2.5 text-white/65 hover:text-white"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </Container>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[var(--navbar-height)] z-[999] bg-[#07040d]/98 backdrop-blur-xl border-t border-white/10 min-[901px]:hidden"
            style={{ minHeight: "calc(100dvh - var(--navbar-height))" }}
          >
            <nav className="flex flex-col p-8 gap-8">
              {navLinks.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="text-3xl font-medium text-white hover:text-violet-400 block"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
