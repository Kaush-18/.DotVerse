"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, Search, Menu, X, 
  Home, ShoppingBasket, Package, Layers, Info, Mail, CircleUser 
} from "lucide-react";

import Logo from "@/components/ui/Logo";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBasket },
  { label: "Track Order", href: "/track-order", icon: Package },
  { label: "Collections", href: "#", icon: Layers },
  { label: "About", href: "#", icon: Info },
  { label: "Contact", href: "#", icon: Mail },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Scroll locking
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className="
          fixed top-6 left-4 right-4 z-[100] mx-auto max-w-7xl
          flex items-center justify-between
          px-6 py-3
          rounded-full
          bg-[#07040d]/80 backdrop-blur-xl border border-white/10
          shadow-[0_0_20px_rgba(124,58,237,0.15)]
        "
      >
        <Logo />

        <nav className="hidden min-[901px]:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive(item.href) 
                  ? "text-white bg-white/10 shadow-[0_0_10px_rgba(124,58,237,0.3)]" 
                  : "text-white/70 hover:text-white hover:bg-white/5"}
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button aria-label="Search" className="p-2 rounded-full hover:bg-white/10 text-white/70 transition-colors">
            <Search size={20} />
          </button>
          <Link href="/account" aria-label="Account" className="p-2 rounded-full hover:bg-white/10 text-white/70 transition-colors">
            <CircleUser size={20} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative p-2 rounded-full hover:bg-white/10 text-white/70 transition-colors">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMenu}
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="min-[901px]:hidden p-2 rounded-full hover:bg-white/10 text-white/70 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md"
            onClick={closeMenu}
          />
          
          {/* DRAWER */}
          <div
            id="mobile-navigation"
            className="
              fixed inset-y-0 right-0 z-[300]
              h-[100dvh] w-[min(88vw,380px)]
              bg-[#07040d] border-l border-white/10
              shadow-2xl
              transition-transform duration-300
            "
            style={{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="flex items-center justify-between p-6">
              <Logo />
              <button 
                onClick={closeMenu} 
                aria-label="Close navigation" 
                className="p-2 rounded-full hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 p-6">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-lg font-medium transition-colors"
                >
                  <item.icon size={20} className="text-violet-400" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 flex flex-col gap-2">
               <Link href="/account" onClick={closeMenu} className="p-4 rounded-2xl hover:bg-white/5 text-lg font-medium flex items-center gap-4">
                  <CircleUser size={20} /> Account
               </Link>
               <Link href="/cart" onClick={closeMenu} className="p-4 rounded-2xl hover:bg-white/5 text-lg font-medium flex items-center gap-4">
                  <ShoppingBag size={20} /> Cart
               </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

