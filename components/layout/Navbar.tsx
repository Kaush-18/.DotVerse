import Container from "@/components/layout/Container";
import Logo from "@/components/ui/Logo";
import { Search, ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between">

          <Logo />

          <nav className="hidden items-center gap-10 lg:flex">
            <a href="#">Home</a>
            <a href="#">Shop</a>
            <a href="#">Collections</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>

          <div className="flex items-center gap-5">
            <Search size={20} />
            <ShoppingBag size={20} />
            <User size={20} />
          </div>

        </div>
      </Container>
    </header>
  );
}