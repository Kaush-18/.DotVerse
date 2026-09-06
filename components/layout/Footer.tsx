import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <span className="site-footer-kicker">.DOTVERSE / EST. 2026</span>
            <h3>WEAR YOUR<br />STORY.</h3>
            <p>Premium streetwear for a bolder you.</p>
          </div>

          <div className="site-footer-column">
            <h4>SHOP</h4>
            <Link href="/shop">All Products</Link>
            <Link href="/#collections">Collections</Link>
          </div>

          <div className="site-footer-column">
            <h4>CUSTOMER CARE</h4>
            <Link href="/contact">Contact</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
            <Link href="/return-refund-policy">Return &amp; Refund</Link>
          </div>

          <div className="site-footer-column">
            <h4>LEGAL</h4>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} DOTVERSE CLOTHING BRAND.</span>
          <span>MINIMAL / BOLD / TIMELESS</span>
        </div>
      </Container>
    </footer>
  );
}
