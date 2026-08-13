"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Listing } from "@/lib/data";
import { toggleWishlist, isWishlisted } from "@/lib/store";
import toast from "react-hot-toast";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(listing.id));
  const [hovered, setHovered] = useState(false);

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(listing.id);
    setWishlisted(added);
    toast(added ? "Added to wishlist ❤️" : "Removed from wishlist");
  }

  function prevImg(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(i => (i === 0 ? listing.images.length - 1 : i - 1));
  }

  function nextImg(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(i => (i === listing.images.length - 1 ? 0 : i + 1));
  }

  return (
    <Link
      href={`/listings/${listing.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "20/19", background: "#e0e0e0", marginBottom: "12px" }}>
        <img
          src={listing.images[imgIdx]}
          alt={listing.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.3s ease",
            transform: hovered ? "scale(1.03)" : "scale(1)",
          }}
          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=600&auto=format&fit=crop"; }}
        />

        {/* Guest favourite badge */}
        {listing.isGuestFavorite && (
          <div style={{
            position: "absolute", top: "10px", left: "10px",
            background: "white", borderRadius: "20px", padding: "5px 10px",
            fontSize: "12px", fontWeight: 600, color: "#222", zIndex: 4,
          }}>
            Guest favourite
          </div>
        )}

        {/* Heart */}
        <button className="heart-btn" onClick={handleWishlist}>
          <Heart
            size={24}
            style={{
              fill: wishlisted ? "#FF385C" : "rgba(0,0,0,0.35)",
              stroke: wishlisted ? "#FF385C" : "white",
              strokeWidth: 1.5,
            }}
          />
        </button>

        {/* Prev/next */}
        {listing.images.length > 1 && hovered && (
          <>
            {imgIdx > 0 && (
              <button
                onClick={prevImg}
                style={{
                  position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                  background: "white", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)", cursor: "pointer", zIndex: 10,
                }}
              >
                <ChevronLeft size={14} />
              </button>
            )}
            {imgIdx < listing.images.length - 1 && (
              <button
                onClick={nextImg}
                style={{
                  position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                  background: "white", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)", cursor: "pointer", zIndex: 10,
                }}
              >
                <ChevronRight size={14} />
              </button>
            )}
          </>
        )}

        {/* Dots */}
        {listing.images.length > 1 && (
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "4px" }}>
            {listing.images.slice(0, 5).map((_, i) => (
              <div key={i} style={{
                width: i === imgIdx ? "8px" : "6px",
                height: i === imgIdx ? "8px" : "6px",
                borderRadius: "50%",
                background: i === imgIdx ? "white" : "rgba(255,255,255,0.6)",
                transition: "all 0.2s",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Card info */}
      <div style={{ marginTop: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "#222222", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {listing.location}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, marginLeft: "8px" }}>
            <Star size={14} style={{ fill: "#222", stroke: "#222" }} />
            <span style={{ fontSize: "15px", color: "#222222", fontWeight: 400 }}>{listing.rating}</span>
          </div>
        </div>
        <p style={{ fontSize: "15px", color: "#717171", lineHeight: 1.25, marginTop: "2px" }}>{listing.type}</p>
        <p style={{ fontSize: "15px", color: "#717171", lineHeight: 1.25, marginTop: "2px" }}>{listing.maxGuests} guests · {listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}</p>
        <p style={{ fontSize: "15px", marginTop: "6px" }}>
          <span style={{ fontWeight: 500, color: "#222222" }}>{listing.currency}{listing.price.toLocaleString("en-IN")}</span>
          <span style={{ color: "#222222" }}> night</span>
        </p>
        {listing.isSuperhost && (
          <span style={{
            display: "inline-block", marginTop: "6px", fontSize: "12px", fontWeight: 600,
            background: "#FFF0F2", color: "#FF385C", padding: "2px 8px", borderRadius: "4px",
          }}>⭐ Superhost</span>
        )}
      </div>
    </Link>
  );
}
