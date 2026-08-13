"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Heart, Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { toggleWishlist, isWishlisted } from "@/lib/store";
import toast from "react-hot-toast";

interface CardData {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  price?: string;
  rating?: number;
  badge?: string;
  href: string;
  type?: "listing" | "experience" | "service";
}

interface HorizontalSectionProps {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  cards: CardData[];
}

function getWishlistId(card: CardData): string {
  if (card.type !== "listing") return card.id;
  const listingMatch = card.href.match(/^\/listings\/(.+)$/);
  return listingMatch?.[1] ?? card.id;
}

function WishlistHeart({ card }: { card: CardData }) {
  const wishlistId = getWishlistId(card);
  const [saved, setSaved] = useState(() => isWishlisted(wishlistId));
  return (
    <button
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleWishlist(wishlistId);
        setSaved(added);
        toast(added ? "Saved to wishlist" : "Removed from wishlist");
      }}
      style={{
        position: "absolute", top: "10px", right: "10px",
        background: "none", border: "none", cursor: "pointer",
        padding: "4px",
        filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.4))",
        transition: "transform 0.15s", zIndex: 5,
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Heart
        size={22}
        style={{
          fill: saved ? "#FF385C" : "rgba(0,0,0,0.3)",
          stroke: saved ? "#FF385C" : "white",
          strokeWidth: 1.5,
        }}
      />
    </button>
  );
}

export default function HorizontalSection({ title, subtitle, seeAllHref, cards }: HorizontalSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(Infinity);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const amount = el.clientWidth * 0.8;
    const newPos = dir === "left"
      ? Math.max(0, el.scrollLeft - amount)
      : el.scrollLeft + amount;
    el.scrollTo({ left: newPos, behavior: "smooth" });
  }

  function handleScroll() {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setScrollPos(el.scrollLeft);
    setMaxScroll(el.scrollWidth - el.clientWidth);
  }

  if (cards.length === 0) return null;

  return (
    <section style={{ marginBottom: "48px" }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: subtitle ? "4px" : "20px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#222222", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {title}
          {seeAllHref && (
            <Link href={seeAllHref} style={{ color: "#222", textDecoration: "none", display: "flex", alignItems: "center" }}>
              <ArrowRight size={22} strokeWidth={2.5} />
            </Link>
          )}
        </h2>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <button
            onClick={() => scroll("left")}
            disabled={scrollPos <= 0}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: "1px solid #DDDDDD", background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: scrollPos <= 0 ? "default" : "pointer",
              opacity: scrollPos <= 0 ? 0.4 : 1,
              transition: "box-shadow 0.15s",
            }}
            onMouseEnter={e => { if (scrollPos > 0) e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <ChevronLeft size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={scrollPos >= maxScroll - 1}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: "1px solid #DDDDDD", background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: scrollPos >= maxScroll - 1 ? "default" : "pointer",
              opacity: scrollPos >= maxScroll - 1 ? 0.4 : 1,
              transition: "box-shadow 0.15s",
            }}
            onMouseEnter={e => { if (scrollPos < maxScroll) e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {subtitle && (
        <p style={{ fontSize: "14px", color: "#717171", marginBottom: "16px" }}>{subtitle}</p>
      )}

      {/* Horizontal scroll row */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: "14px",
          overflowX: "auto",
          paddingBottom: "4px",
          cursor: "default",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            style={{ textDecoration: "none", color: "inherit", flexShrink: 0, width: "180px" }}
          >
            {/* Card image */}
            <div
              style={{
                position: "relative",
                width: "180px",
                aspectRatio: "4/3",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#E0E0E0",
                marginBottom: "8px",
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transition: "transform 0.3s ease, opacity 0.2s",
                }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop"; }}
              />

              {/* Badge */}
              {card.badge && (
                <div style={{
                  position: "absolute", top: "8px", left: "8px",
                  background: "white",
                  borderRadius: "20px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#222",
                  zIndex: 4,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                }}>
                  {card.badge}
                </div>
              )}

              {/* Heart */}
              {card.type === "listing" && <WishlistHeart card={card} />}
            </div>

            {/* Card text */}
            <div>
              <p style={{
                fontSize: "15px", fontWeight: 600, color: "#222222",
                lineHeight: "1.25", marginBottom: "2px",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {card.title}
              </p>
              <p style={{ fontSize: "14px", color: "#717171", lineHeight: "1.25", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {card.price} {card.rating != null ? ` · ★ ${card.rating.toFixed(2)}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
