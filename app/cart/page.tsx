"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import Container from "@/components/layout/Container";
import PageReveal from "@/components/animations/PageReveal";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  return (
    <PageReveal>
      <main className="dot-cart-page">
        <Container>
          {items.length === 0 ? (
            <section className="dot-cart-empty" aria-labelledby="cart-empty-heading">
              <p className="dot-cart-kicker">.DOT / SHOPPING BAG</p>
              <h1 id="cart-empty-heading">YOUR BAG<br /><em>IS EMPTY.</em></h1>
              <p>Nothing is waiting here yet. Find the piece that feels like yours.</p>
              <Link href="/shop" className="dot-cart-primary-link">Explore the collection <span aria-hidden="true">↗</span></Link>
              <span className="dot-cart-empty-mark" aria-hidden="true">.</span>
            </section>
          ) : (
            <>
              <header className="dot-cart-header">
                <div>
                  <p className="dot-cart-kicker">.DOT / SHOPPING BAG</p>
                  <h1>YOUR BAG</h1>
                </div>
                <p className="dot-cart-count">{String(totalItems).padStart(2, "0")} {totalItems === 1 ? "PIECE" : "PIECES"}</p>
              </header>

              <div className="dot-cart-layout">
                <section className="dot-cart-items" aria-labelledby="cart-items-heading">
                  <div className="dot-cart-section-heading">
                    <h2 id="cart-items-heading">Selected pieces</h2>
                    <span>01 / EDIT</span>
                  </div>
                  <div className="dot-cart-item-list">
                    {items.map((item, index) => (
                      <article key={`${item.id}-${item.size}-${item.color}`} className="dot-cart-item" style={{ "--cart-item-delay": `${index * 70}ms` } as React.CSSProperties}>
                        <Link href={`/products/${item.slug}`} className="dot-cart-item-image" aria-label={`View ${item.name}`}>
                          <Image src={item.image} alt={`${item.name} by DotVerse`} fill sizes="(max-width: 700px) 34vw, 180px" />
                        </Link>
                        <div className="dot-cart-item-details">
                          <div className="dot-cart-item-heading">
                            <div>
                              <p className="dot-cart-item-label">{item.color} / {item.size}</p>
                              <h3><Link href={`/products/${item.slug}`}>{item.name}</Link></h3>
                            </div>
                            <p className="dot-cart-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                          </div>
                          <div className="dot-cart-item-footer">
                            <div className="dot-cart-quantity" aria-label={`Quantity for ${item.name}`}>
                              <button type="button" onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`}><Minus size={13} /></button>
                              <span aria-live="polite">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} aria-label={`Increase quantity of ${item.name}`}><Plus size={13} /></button>
                            </div>
                            <span className="dot-cart-unit-price">₹{item.price.toLocaleString("en-IN")} each</span>
                            <button type="button" className="dot-cart-remove" onClick={() => removeFromCart(item.id, item.size, item.color)} aria-label={`Remove ${item.name} from your bag`}><Trash2 size={14} /><span>Remove</span></button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <Link href="/shop" className="dot-cart-continue">← Continue shopping</Link>
                </section>

                <aside className="dot-cart-summary" aria-labelledby="cart-summary-heading">
                  <p className="dot-cart-kicker">02 / CHECKOUT</p>
                  <h2 id="cart-summary-heading">ORDER SUMMARY</h2>
                  <div className="dot-cart-summary-lines">
                    <div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
                    <div><span>Shipping</span><strong>Free</strong></div>
                  </div>
                  <div className="dot-cart-total"><span>Total</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
                  <Link href="/checkout" className="dot-cart-checkout">Proceed to checkout <span aria-hidden="true">→</span></Link>
                  <p className="dot-cart-summary-note">Shipping is calculated as free for this order.</p>
                </aside>
              </div>
            </>
          )}
        </Container>
      </main>
    </PageReveal>
  );
}
