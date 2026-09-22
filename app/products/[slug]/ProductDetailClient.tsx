"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import { collections } from "@/components/home/collectionData";
import { useWishlist } from "@/context/WishlistContext";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  relatedProductsRelationship: "collection" | "category" | "generic";
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  relatedProductsRelationship,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liked = isWishlisted(product.id);
  const collection = collections.find(
    (item) => item.title.toLowerCase() === product.collection.toLowerCase(),
  );
  const image = product.images[activeImage] ?? product.images[0];
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;
    return product.variants.find(
      (variant) => variant.size === selectedSize && variant.colorName === selectedColor,
    ) ?? null;
  }, [product.variants, selectedColor, selectedSize]);

  const maxQuantity = selectedVariant ? Math.min(selectedVariant.stock, 20) : 1;
  const productIsAvailable = product.stock > 0;
  const isLowStock = productIsAvailable && product.stock <= 5;

  const isSizeAvailable = (size: string) => product.variants.some(
    (variant) => variant.size === size
      && (!selectedColor || variant.colorName === selectedColor)
      && variant.stock > 0,
  );

  const isColorAvailable = (color: string) => product.variants.some(
    (variant) => variant.colorName === color
      && (!selectedSize || variant.size === selectedSize)
      && variant.stock > 0,
  );

  const selectSize = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
    setError(null);
    if (selectedColor && !product.variants.some(
      (variant) => variant.size === size && variant.colorName === selectedColor && variant.stock > 0,
    )) {
      setSelectedColor(null);
    }
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);
    setError(null);
    if (selectedSize && !product.variants.some(
      (variant) => variant.size === selectedSize && variant.colorName === color && variant.stock > 0,
    )) {
      setSelectedSize(null);
    }
  };

  const addSelectedVariant = (destination?: "/checkout") => {
    if (!productIsAvailable) {
      setError("This piece is currently out of stock.");
      return false;
    }
    if (!selectedSize) {
      setError("Select a size to continue.");
      return false;
    }
    if (!selectedColor) {
      setError("Select a color to continue.");
      return false;
    }
    if (!selectedVariant || selectedVariant.stock < 1) {
      setError("That combination is currently unavailable.");
      return false;
    }

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
    }, quantity);

    setError(null);
    setIsAdding(true);
    window.setTimeout(() => setIsAdding(false), 1800);
    if (destination) router.push(destination);
    return true;
  };

  const relationshipTitle = relatedProductsRelationship === "collection" && collection
    ? `More from ${collection.title}`
    : relatedProductsRelationship === "category" && relatedProducts[0]
      ? `More ${relatedProducts[0].category}`
      : "Explore more DotVerse pieces";

  return (
    <main className="dot-product-page">
      <Container>
        <nav aria-label="Breadcrumb" className="dot-product-breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href="/shop">Shop</Link>
          {collection && <><span>/</span><Link href={`/collections/${collection.id}`}>{collection.title}</Link></>}
          <span>/</span><span className="is-current">{product.name}</span>
        </nav>

        <section className="dot-product-shell" aria-labelledby="product-heading">
          <div className="dot-product-gallery">
            <div className="dot-product-gallery-main">
              <Image
                key={image}
                src={image}
                alt={`${product.name} by DotVerse`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
                className="dot-product-main-image"
              />
              <div className="dot-product-image-count">{String(activeImage + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}</div>
            </div>
            {product.images.length > 1 && (
              <div className="dot-product-thumbnails" aria-label="Product images">
                {product.images.map((productImage, index) => (
                  <button
                    key={productImage}
                    type="button"
                    className={activeImage === index ? "is-active" : ""}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={activeImage === index}
                  >
                    <Image src={productImage} alt={`${product.name} view ${index + 1}`} fill sizes="96px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dot-product-info">
            <div className="dot-product-info-topline">
              <span className="premium-eyebrow">{product.badge ?? "The .Dot edit"}</span>
              <span className="dot-product-id">.DOT / {product.id.slice(0, 8)}</span>
            </div>
            <h1 id="product-heading">{product.name}</h1>
            <div className="dot-product-category">
              {collection && <Link href={`/collections/${collection.id}`}>{collection.title}</Link>}
              <span>{product.category}</span>
            </div>
            <p className="dot-product-description">{product.description}</p>

            <div className="dot-product-price-row">
              <span className="dot-product-price">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <><del>₹{product.originalPrice.toLocaleString("en-IN")}</del><span className="dot-product-discount">-{discount}%</span></>
              )}
            </div>

            <div className={`dot-product-stock ${!productIsAvailable ? "is-out" : isLowStock ? "is-low" : ""}`}>
              <span className="dot-product-stock-dot" aria-hidden="true" />
              {!productIsAvailable ? "Currently unavailable" : isLowStock ? "Low stock — move with intention" : "Available to ship"}
            </div>

            <div className="dot-product-options">
              <div className="dot-product-option-header"><span>Color</span><span>{selectedColor ?? "Select a color"}</span></div>
              <div className="dot-product-colors">
                {product.colors.map((color) => {
                  const available = isColorAvailable(color.name);
                  return <button key={color.name} type="button" className={selectedColor === color.name ? "is-selected" : ""} style={{ backgroundColor: color.value }} onClick={() => selectColor(color.name)} disabled={!available} aria-label={`Select ${color.name}`} aria-pressed={selectedColor === color.name} />;
                })}
              </div>
            </div>

            <div className="dot-product-options">
              <div className="dot-product-option-header"><span>Size</span><Link href="/size-guide">Size guide ↗</Link></div>
              <div className="dot-product-sizes">
                {product.sizes.map((size) => {
                  const available = isSizeAvailable(size);
                  return <button key={size} type="button" className={selectedSize === size ? "is-selected" : ""} onClick={() => selectSize(size)} disabled={!available} aria-pressed={selectedSize === size}>{size}</button>;
                })}
              </div>
            </div>

            <div className="dot-product-quantity-row">
              <span>Quantity</span>
              <div className="dot-product-quantity" aria-label="Quantity selector">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Decrease quantity"><Minus size={14} /></button>
                <span aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))} disabled={!selectedVariant || quantity >= maxQuantity} aria-label="Increase quantity"><Plus size={14} /></button>
              </div>
            </div>

            <div className="dot-product-actions">
              <button type="button" className="dot-product-add" onClick={() => addSelectedVariant()} disabled={isAdding || !productIsAvailable}>
                {isAdding ? <><Check size={17} /> Added to cart</> : <><ShoppingBag size={17} /> Add to cart</>}
              </button>
              <button type="button" className="dot-product-buy" onClick={() => addSelectedVariant("/checkout")} disabled={!productIsAvailable}>Buy now <span aria-hidden="true">↗</span></button>
              <button type="button" className={`dot-product-wishlist ${liked ? "is-liked" : ""}`} onClick={() => void toggleWishlist(product.id, product)} aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}><Heart size={18} fill={liked ? "currentColor" : "none"} /><span>{liked ? "Saved" : "Save"}</span></button>
            </div>
            {error && <p className="dot-product-error" role="alert">{error}</p>}

            <div className="dot-product-promises">
              <div><span>01</span><p>Free shipping<br /><small>On every order</small></p></div>
              <div><span>02</span><p>Made to move<br /><small>7-day returns</small></p></div>
            </div>
          </div>
        </section>

        <section className="dot-product-story" aria-labelledby="product-story-heading">
          <div className="dot-product-story-label"><span>01</span><span>The product story</span></div>
           <div><h2 id="product-story-heading">A piece with<br /><em>a point of view.</em></h2><p>{product.description}</p></div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="dot-product-related" aria-labelledby="related-products-heading">
            <div className="dot-product-related-heading"><div><span className="premium-eyebrow">Continue through the universe</span><h2 id="related-products-heading">{relationshipTitle}</h2></div><Link href={collection ? `/collections/${collection.id}` : "/shop"}>View all <span aria-hidden="true">↗</span></Link></div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}

        <section className="dot-product-explore" aria-labelledby="product-explore-heading">
          <span className="premium-eyebrow">The next frequency is yours</span>
          <h2 id="product-explore-heading">Find your<br /><em>point.</em></h2>
          <Link href="/shop" className="premium-button premium-button-outline">Shop all pieces <span aria-hidden="true">↗</span></Link>
        </section>
      </Container>
    </main>
  );
}
