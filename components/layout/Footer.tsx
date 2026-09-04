import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#07070b] text-white/70 py-12 mt-12 border-t border-white/[0.1]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-white mb-4">DotVerse</h3>
            <p className="text-sm">Dotverse Clothing Brand</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-refund-policy" className="hover:text-white transition-colors">Return & Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.1] text-center text-xs text-white/50">
          &copy; {new Date().getFullYear()} Dotverse Clothing Brand. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
