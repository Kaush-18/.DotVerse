import Container from "./Container";
import Logo from "@/components/ui/Logo";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navLinks = [
  "Home",
  "Shop",
  "Collections",
  "About",
  "Contact",
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <Container className="relative">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-16">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="
                  relative
                  text-sm
                  font-medium
                  tracking-wide
                  text-white/75
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:text-violet-400
                  after:absolute
                  after:left-0
                  after:-bottom-2
                  after:h-[2px]
                  after:w-0
                  after:bg-violet-500
                  after:transition-all
                  after:duration-300
                  hover:after:w-full
                "
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">

            <button
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                text-white/70
                transition-all
                duration-300
                hover:bg-white/5
                hover:text-violet-400
                hover:scale-110
              "
            >
              <Search size={19} />
            </button>

            <button
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                text-white/70
                transition-all
                duration-300
                hover:bg-white/5
                hover:text-violet-400
                hover:scale-110
              "
            >
              <ShoppingBag size={19} />
            </button>

            <button
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                text-white/70
                transition-all
                duration-300
                hover:bg-white/5
                hover:text-violet-400
                hover:scale-110
              "
            >
              <User size={19} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all duration-300 hover:bg-white/5 hover:text-violet-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden overflow-hidden transition-all duration-300"
        >
          <nav className="py-6 flex flex-col gap-4">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="
                  text-lg
                  font-medium
                  text-white/80
                  transition-all
                  duration-300
                  hover:text-violet-400
                  px-2
                "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        </motion.div>

      </Container>
    </header>
  );
}