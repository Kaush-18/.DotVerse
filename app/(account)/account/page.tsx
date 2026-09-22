import Link from "next/link";
import { ArrowRight, Heart, Mail, MapPin, Package, UserRound } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const money = formatPrice;

export default async function AccountDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      status: true,
      total: true,
      items: { select: { quantity: true } },
    },
  });
  const firstName = session.user.name?.split(" ")[0] || "there";
  const latest = orders[0];

  const quickLinks = [
    { href: "/account/orders", label: "Orders", description: "Track every piece on its way.", icon: Package },
    { href: "/account/wishlist", label: "Wishlist", description: "Return to the pieces you saved.", icon: Heart },
    { href: "/account/addresses", label: "Addresses", description: "Keep delivery details ready.", icon: MapPin },
    { href: "/account/profile", label: "Profile", description: "Keep your details current.", icon: UserRound },
  ];

  return (
    <div className="dot-account-dashboard">
      <header className="dot-account-header">
        <div>
          <p className="dot-account-kicker">.DOT / PRIVATE SPACE</p>
          <h1>YOUR<br /><em>POINT.</em></h1>
          <p className="dot-account-intro">Welcome back, <strong>{firstName}</strong>. Your DotVerse essentials, all in one place.</p>
        </div>
        <div className="dot-account-identity">
          <div className="dot-account-avatar" aria-hidden="true">{(session.user.name || session.user.email).slice(0, 1).toUpperCase()}</div>
          <div><span>Signed in as</span><strong>{session.user.name}</strong><p><Mail size={13} />{session.user.email}</p></div>
        </div>
      </header>

      <section className="dot-account-order-feature" aria-labelledby="account-latest-heading">
        <div className="dot-account-section-label"><span>01</span><span>Latest movement</span></div>
        <div className="dot-account-order-content">
          <div><p className="dot-account-eyebrow">Recent order</p><h2 id="account-latest-heading">{latest ? latest.orderNumber : "NO ORDERS YET"}</h2>{latest ? <p>{new Date(latest.createdAt).toLocaleDateString()} · {latest.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</p> : <p>Your next favorite piece is waiting.</p>}</div>
          {latest ? <div className="dot-account-order-side"><strong>{money(latest.total)}</strong><span>{latest.status}</span><Link href={`/account/orders/${latest.orderNumber}`}>View order <ArrowRight size={14} /></Link></div> : <Link href="/shop" className="dot-account-primary">Explore the collection <ArrowRight size={14} /></Link>}
        </div>
      </section>

      <section className="dot-account-paths" aria-labelledby="account-paths-heading">
        <div className="dot-account-section-label"><span>02</span><span id="account-paths-heading">Your space</span></div>
        <div className="dot-account-path-grid">{quickLinks.map(({ href, label, description, icon: Icon }) => <Link href={href} key={href} className="dot-account-path"><Icon size={18} /><span><strong>{label}</strong><small>{description}</small></span><ArrowRight size={16} className="dot-account-path-arrow" /></Link>)}</div>
      </section>
    </div>
  );
}
