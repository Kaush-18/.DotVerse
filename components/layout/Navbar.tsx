import Layout from "@/components/layout/Layout";
import Logo from "@/components/ui/Logo";
import { ShoppingBag, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <Layout>
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            <a href="#" className="transition hover:text-primary">Home</a>
            <a href="#" className="transition hover:text-primary">Shop</a>
            <a href="#" className="transition hover:text-primary">Collections</a>
            <a href="#" className="transition hover:text-primary">About</a>
            <a href="#" className="transition hover:text-primary">Contact</a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-5">

            <Search
              size={20}
              className="cursor-pointer transition hover:text-primary"
            />

            <ShoppingBag
              size={20}
              className="cursor-pointer transition hover:text-primary"
            />

            <User
              size={20}
              className="cursor-pointer transition hover:text-primary"
            />

          </div>

        </div>
      </Layout>
    </header>
  );
}