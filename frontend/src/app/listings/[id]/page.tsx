"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star, Heart, Share2, ChevronLeft, ChevronRight, X,
  Wifi, Car, Utensils, Waves, Tv, Wind, ShowerHead, Flame,
  Users, BedDouble, Bath, Home, Award, Grid3x3,
  MapPin, MessageCircle, Clock, DoorOpen, Droplets, AlertCircle,
  Shield, Check, Trash2, Lightbulb
} from "lucide-react";
import Navbar, { NavTab } from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCard from "@/components/BookingCard";
import { Listing } from "@/lib/data";
import { toggleWishlist, isWishlisted } from "@/lib/store";
import toast from "react-hot-toast";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi": <Wifi size={20} />,
  "Free parking": <Car size={20} />,
  "Kitchen": <Utensils size={20} />,
  "Pool": <Waves size={20} />,
  "TV": <Tv size={20} />,
  "Air conditioning": <Wind size={20} />,
  "Outdoor shower": <ShowerHead size={20} />,
  "BBQ grill": <Flame size={20} />,
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const [activeTab] = useState<NavTab>("homes");

  useEffect(() => {
    if (!listingId) return;
    import("@/lib/api").then(api => {
      api.fetchListing(listingId).then(data => {
        setListing(data);
        setWishlisted(isWishlisted(data.id));
      }).catch(err => {
        console.error(err);
        setListing(null);
      });
      api.fetchReviews(listingId).then(setReviews).catch(console.error);
    });
  }, [listingId]);

  if (!listing) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F7" }}>
        <Navbar activeTab={activeTab} onTabChange={() => {}} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏠</div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#717171" }}>Listing not found</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Wait, I already added reviews state.

  function handleWishlist() {
    const added = toggleWishlist(listing!.id);
    setWishlisted(added);
    toast(added ? "Saved to wishlist ❤️" : "Removed from wishlist");
  }

  const amenitiesToShow = showAllAmenities ? listing.amenities : listing.amenities.slice(0, 8);

  const images = listing.images.length >= 5
    ? listing.images.slice(0, 5)
    : [...listing.images, ...Array(5 - listing.images.length).fill(listing.images[0])];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", color: "#222222" }}>
      <Navbar activeTab={activeTab} onTabChange={() => {}} />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 24px 80px" }}>

        {/* Title row */}
        <div style={{ 
          display: "flex", 
          alignItems: "flex-start", 
          justifyContent: "space-between", 
          marginBottom: "24px", 
          gap: "16px", 
          flexWrap: "wrap" 
        }}>
          <h1 style={{ 
            fontSize: "clamp(22px, 4vw, 32px)", 
            fontWeight: 700, 
            color: "#222", 
            lineHeight: "1.2", 
            flex: 1,
            minWidth: "180px"
          }}>
            {listing.title}
          </h1>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            flexShrink: 0,
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); toast("Link copied!"); }}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "white", border: "1px solid #DDDDDD", cursor: "pointer",
                fontSize: "14px", fontWeight: 600,
                color: "#222", padding: "10px 16px", borderRadius: "8px",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.background = "#F7F7F7"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.background = "white"; }}
            >
              <Share2 size={16} />
              <span className="share-text" style={{ display: "inline" }}>Share</span>
            </button>
            <button
              onClick={handleWishlist}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: wishlisted ? "#222222" : "white",
                border: wishlisted ? "none" : "1px solid #DDDDDD",
                cursor: "pointer",
                fontSize: "14px", fontWeight: 600,
                color: wishlisted ? "white" : "#222",
                padding: "10px 16px", borderRadius: "8px",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                if (!wishlisted) {
                  e.currentTarget.style.borderColor = "#222222";
                  e.currentTarget.style.background = "#F7F7F7";
                }
              }}
              onMouseLeave={e => {
                if (!wishlisted) {
                  e.currentTarget.style.borderColor = "#DDDDDD";
                  e.currentTarget.style.background = "white";
                }
              }}
            >
              <Heart
                size={16}
                style={{
                  fill: wishlisted ? "white" : "transparent",
                  stroke: wishlisted ? "white" : "#222",
                }}
              />
              <span className="save-text" style={{ display: "inline" }}>{wishlisted ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Guest favourite badge */}
        {listing.isGuestFavorite && (
          <div style={{
            display: "flex", 
            alignItems: "center", 
            gap: "16px",
            border: "1px solid #DDDDDD", 
            borderRadius: "12px",
            padding: "16px 20px", 
            marginBottom: "28px",
            background: "white",
            flexWrap: "wrap"
          }}>
            <div style={{ fontSize: "clamp(28px, 4vw, 36px)", flexShrink: 0 }}>🏆</div>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <p style={{ fontWeight: 700, fontSize: "clamp(14px, 1.5vw, 16px)", color: "#222", marginBottom: "2px" }}>Guest favourite</p>
              <p style={{ fontSize: "clamp(12px, 1.2vw, 14px)", color: "#717171" }}>One of the most loved homes on Airbnb</p>
            </div>
            <div style={{ 
              textAlign: "center", 
              paddingLeft: "16px", 
              borderLeft: "1px solid #DDDDDD", 
              flexShrink: 0 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center", marginBottom: "2px" }}>
                <Star size={16} style={{ fill: "#222", stroke: "#222" }} />
                <span style={{ fontWeight: 700, fontSize: "clamp(16px, 1.8vw, 18px)" }}>{listing.rating}</span>
              </div>
              <p style={{ fontSize: "clamp(11px, 1vw, 12px)", color: "#717171" }}>{listing.reviewCount} reviews</p>
            </div>
          </div>
        )}

        {/* Image Grid - Responsive */}
        <div
          className="image-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gridTemplateRows: "240px 240px",
            gap: "8px",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "32px",
            border: "1px solid #DDDDDD",
            position: "relative",
          }}
        >
          {/* Main large image */}
          <div
            style={{ gridRow: "1 / 3", overflow: "hidden", cursor: "pointer", position: "relative" }}
            onClick={() => { setCurrentPhoto(0); setShowAllPhotos(true); }}
          >
            <img
              src={images[0]}
              alt={listing.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.15s" }}
              onMouseEnter={e => { (e.target as HTMLImageElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { (e.target as HTMLImageElement).style.opacity = "1"; }}
              onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop"; }}
            />
          </div>

          {/* Right 4 images */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "8px" }}>
            {images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                style={{ overflow: "hidden", cursor: "pointer", position: "relative" }}
                onClick={() => { setCurrentPhoto(i + 1); setShowAllPhotos(true); }}
              >
                <img
                  src={img}
                  alt={`${listing.title} ${i + 2}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.15s" }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.opacity = "0.9"; }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.opacity = "1"; }}
                  onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop"; }}
                />
              </div>
            ))}
          </div>

          {/* Show all photos button */}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="show-all-photos-btn"
            style={{
              position: "absolute", 
              bottom: "16px", 
              right: "16px",
              background: "white", 
              border: "1px solid #222222",
              borderRadius: "8px", 
              padding: "8px 14px",
              fontSize: "clamp(12px, 1.2vw, 13px)", 
              fontWeight: 600, 
              cursor: "pointer",
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              transition: "all 0.15s",
              zIndex: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F7F7F7"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
          >
            <Grid3x3 size={14} />
            <span className="show-photos-text">Show all photos</span>
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="detail-layout" style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>

          {/* Left Column */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Type + host */}
            <div style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              justifyContent: "space-between", 
              paddingBottom: "28px", 
              borderBottom: "1px solid #DDDDDD", 
              gap: "24px",
              flexWrap: "wrap"
            }}>
              <div style={{ flex: 1, minWidth: "160px" }}>
                <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 600, color: "#222", marginBottom: "8px" }}>
                  {listing.type} in {listing.city}, {listing.country}
                </h2>
                <p style={{ fontSize: "clamp(14px, 1.2vw, 16px)", color: "#717171", marginBottom: "4px" }}>
                  {listing.maxGuests} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""} · {listing.beds} bed{listing.beds !== 1 ? "s" : ""} · {listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}
                </p>
                
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Star size={16} style={{ fill: "#222", stroke: "#222" }} />
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#222" }}>{listing.rating}</span>
                    <span style={{ fontSize: "14px", color: "#717171" }}>({listing.reviewCount} reviews)</span>
                  </div>
                  {listing.isGuestFavorite && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#FF385C" }}>
                      🏆 Guest favourite
                    </span>
                  )}
                  {listing.isSuperhost && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#FF385C" }}>
                      ⭐ Superhost
                    </span>
                  )}
                </div>
              </div>
              
              <div style={{ flexShrink: 0 }}>
                <img
                  src={listing.hostAvatar}
                  alt={listing.hostName}
                  style={{ width: "clamp(48px, 5vw, 64px)", height: "clamp(48px, 5vw, 64px)", borderRadius: "50%", objectFit: "cover", border: "2px solid #DDDDDD" }}
                  onError={e => { (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?img=8"; }}
                />
              </div>
            </div>

            {/* Highlights */}
            <div style={{ padding: "28px 0", borderBottom: "1px solid #DDDDDD" }}>
              <h2 style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, marginBottom: "24px", color: "#222" }}>Why guests love this place</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
                {[
                  listing.isSuperhost && {
                    icon: <Award size={24} color="#FF385C" />,
                    title: `${listing.hostName} is a Superhost`,
                    desc: "Experienced, highly rated hosts.",
                  },
                  {
                    icon: <Home size={24} color="#222" />,
                    title: "Entire home",
                    desc: `You'll have the ${listing.type.toLowerCase()} to yourself.`,
                  },
                  {
                    icon: <span style={{ fontSize: "24px" }}>🧹</span>,
                    title: "Enhanced Clean",
                    desc: "Committed to enhanced cleaning protocol.",
                  },
                  {
                    icon: <span style={{ fontSize: "24px" }}>📅</span>,
                    title: "Flexible Cancellation",
                    desc: "Cancel before check-in for a full refund.",
                  },
                ].filter(Boolean).map((item: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <div style={{ flexShrink: 0, marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", background: "#F7F7F7", borderRadius: "8px" }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "clamp(14px, 1.2vw, 15px)", marginBottom: "2px", color: "#222" }}>{item.title}</p>
                      <p style={{ fontSize: "clamp(13px, 1vw, 14px)", color: "#717171", lineHeight: "1.5" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ padding: "32px 0", borderBottom: "1px solid #DDDDDD" }}>
              <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, marginBottom: "16px", color: "#222" }}>About this place</h2>
              <p style={{ fontSize: "clamp(15px, 1.2vw, 16px)", lineHeight: "1.8", color: "#222", marginBottom: "20px" }}>{listing.description}</p>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
                {["Prime Location", "Self Check-in", "Pet Friendly"].map(tag => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-block",
                      padding: "8px 16px",
                      background: "#F7F7F7",
                      border: "1px solid #DDDDDD",
                      borderRadius: "20px",
                      fontSize: "clamp(12px, 1vw, 13px)",
                      color: "#222",
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div style={{ padding: "32px 0", borderBottom: "1px solid #DDDDDD" }}>
              <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, marginBottom: "24px", color: "#222" }}>What this place offers</h2>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
                gap: "12px", 
                marginBottom: "20px" 
              }}>
                {amenitiesToShow.map((amenity) => (
                  <div key={amenity} style={{ 
                    display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
                    background: "white",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                  }}>
                    <span style={{ color: "#222", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}>
                      {AMENITY_ICONS[amenity] || <Check size={18} />}
                    </span>
                    <span style={{ fontSize: "clamp(13px, 1vw, 14px)", color: "#222", fontWeight: 500 }}>{amenity}</span>
                  </div>
                ))}
              </div>
              {listing.amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                    background: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#222",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.background = "#F7F7F7"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.background = "white"; }}
                >
                  {showAllAmenities ? "Show less" : `Show all ${listing.amenities.length} amenities`}
                </button>
              )}
            </div>

            {/* House Rules */}
            <div style={{ padding: "32px 0", borderBottom: "1px solid #DDDDDD" }}>
              <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, marginBottom: "24px", color: "#222" }}>House rules</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
                {[
                  { icon: "🚫", title: "No smoking", desc: "Not allowed inside" },
                  { icon: "🎉", title: "No parties", desc: "Cannot host gatherings" },
                  { icon: "🐕", title: "No pets", desc: "Pets are not allowed" },
                  { icon: "🔕", title: "Quiet hours", desc: "22:00 - 08:00" },
                ].map((rule, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", padding: "16px", background: "#FAFAFA", borderRadius: "8px", border: "1px solid #DDDDDD" }}>
                    <span style={{ fontSize: "clamp(24px, 2.5vw, 28px)", flexShrink: 0 }}>{rule.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "clamp(14px, 1.2vw, 15px)", marginBottom: "2px", color: "#222" }}>{rule.title}</p>
                      <p style={{ fontSize: "clamp(13px, 1vw, 14px)", color: "#717171" }}>{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in/Checkout */}
            <div style={{ padding: "32px 0", borderBottom: "1px solid #DDDDDD" }}>
              <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, marginBottom: "24px", color: "#222" }}>Check-in and checkout</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
                <div style={{ padding: "24px", background: "#FAFAFA", borderRadius: "12px", border: "1px solid #DDDDDD" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "clamp(24px, 2.5vw, 28px)" }}>🔓</span>
                    <p style={{ fontWeight: 700, fontSize: "clamp(16px, 1.5vw, 18px)", color: "#222" }}>Check-in</p>
                  </div>
                  <p style={{ fontSize: "clamp(14px, 1.1vw, 15px)", color: "#717171", lineHeight: "1.6" }}>
                    Check-in time: <strong>3:00 PM</strong><br />
                    Keyless entry with digital code
                  </p>
                </div>
                <div style={{ padding: "24px", background: "#FAFAFA", borderRadius: "12px", border: "1px solid #DDDDDD" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "clamp(24px, 2.5vw, 28px)" }}>🔒</span>
                    <p style={{ fontWeight: 700, fontSize: "clamp(16px, 1.5vw, 18px)", color: "#222" }}>Check-out</p>
                  </div>
                  <p style={{ fontSize: "clamp(14px, 1.1vw, 15px)", color: "#717171", lineHeight: "1.6" }}>
                    Check-out time: <strong>11:00 AM</strong><br />
                    Please leave the place clean
                  </p>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div style={{ padding: "32px 0", borderBottom: "1px solid #DDDDDD" }}>
              <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, marginBottom: "24px", color: "#222" }}>Cancellation policy</h2>
              <div style={{ background: "#FAFAFA", border: "1px solid #DDDDDD", borderRadius: "12px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ width: "48px", height: "48px", background: "#FEE2E2", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AlertCircle size={24} style={{ color: "#DC2626" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: "130px" }}>
                    <h3 style={{ fontSize: "clamp(16px, 1.5vw, 18px)", fontWeight: 700, color: "#222", marginBottom: "8px" }}>Moderate Cancellation</h3>
                    <ul style={{ fontSize: "clamp(13px, 1vw, 14px)", color: "#717171", lineHeight: "1.8", listStyle: "none", paddingLeft: 0 }}>
                      <li>✓ Free cancellation up to 7 days before check-in</li>
                      <li>✓ 50% refund if cancelled 3-7 days before</li>
                      <li>✗ No refund within 3 days of check-in</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Features */}
            <div style={{ padding: "32px 0", borderBottom: "1px solid #DDDDDD" }}>
              <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, marginBottom: "24px", color: "#222" }}>Safety & property</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
                {[
                  { icon: "🔐", title: "Self check-in", desc: "Keyless entry" },
                  { icon: "💡", title: "Good lighting", desc: "Well-lit entryways" },
                  { icon: "📡", title: "High-speed WiFi", desc: "Fast internet" },
                  { icon: "🚑", title: "First aid kit", desc: "Medical supplies" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", padding: "16px", background: "#FAFAFA", borderRadius: "8px", border: "1px solid #DDDDDD" }}>
                    <span style={{ fontSize: "clamp(24px, 2.5vw, 28px)", flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "clamp(14px, 1.2vw, 15px)", color: "#222", marginBottom: "2px" }}>{item.title}</p>
                      <p style={{ fontSize: "clamp(13px, 1vw, 14px)", color: "#717171" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{ padding: "32px 0", borderBottom: "1px solid #DDDDDD" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} style={{ fill: "#FFB800", stroke: "#FFB800" }} />
                  ))}
                </div>
                <span style={{ fontSize: "clamp(20px, 2vw, 24px)", fontWeight: 700, color: "#222" }}>{listing.rating}</span>
                <span style={{ fontSize: "14px", color: "#717171" }}>·</span>
                <span style={{ fontSize: "clamp(13px, 1.2vw, 14px)", fontWeight: 600, color: "#717171" }}>{listing.reviewCount} reviews</span>
              </div>

              {reviews.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                  {reviews.slice(0, 6).map(review => (
                    <div
                      key={review.id}
                      style={{
                        padding: "20px",
                        background: "white",
                        borderRadius: "12px",
                        border: "1px solid #DDDDDD",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1px solid #DDDDDD" }}
                          onError={e => { (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?img=5"; }}
                        />
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "14px", color: "#222" }}>{review.userName}</p>
                          <p style={{ fontSize: "12px", color: "#717171" }}>Verified guest</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "8px" }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            style={{
                              fill: i < Math.round(review.rating || 5) ? "#FFB800" : "#DDDDDD",
                              stroke: i < Math.round(review.rating || 5) ? "#FFB800" : "#DDDDDD",
                            }}
                          />
                        ))}
                      </div>

                      <p style={{ fontSize: "clamp(13px, 1vw, 14px)", color: "#222", lineHeight: "1.6" }}>{review.comment}</p>
                      <p style={{ fontSize: "12px", color: "#717171", marginTop: "8px" }}>{review.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "14px", color: "#717171" }}>No reviews yet. Be the first to review!</p>
              )}
            </div>

            {/* Map / Location */}
            <div style={{ padding: "32px 0", borderBottom: "1px solid #DDDDDD" }}>
              <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, marginBottom: "16px", color: "#222" }}>Where you'll be</h2>
              <p style={{ fontSize: "clamp(15px, 1.2vw, 16px)", color: "#222", marginBottom: "4px", fontWeight: 600 }}>{listing.location}</p>
              <p style={{ fontSize: "clamp(13px, 1vw, 14px)", color: "#717171", marginBottom: "20px" }}>{listing.city}, {listing.country}</p>
              
              <div style={{
                width: "100%", 
                height: "clamp(200px, 30vw, 280px)", 
                borderRadius: "12px", 
                overflow: "hidden",
                background: "#E5E7EB",
                backgroundImage: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
                  ? `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${listing.coordinates.lng},${listing.coordinates.lat},12,0/800x280?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}')`
                  : `linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)`,
                backgroundSize: "cover", 
                backgroundPosition: "center",
                border: "1px solid #DDDDDD",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: "clamp(36px, 5vw, 48px)" }}>📍</span>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <h3 style={{ fontSize: "clamp(16px, 1.5vw, 18px)", fontWeight: 700, marginBottom: "16px", color: "#222" }}>Nearby attractions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px" }}>
                  {[
                    { icon: "🏖️", name: "Beach", distance: "500m" },
                    { icon: "🍽️", name: "Restaurants", distance: "200m" },
                    { icon: "🚇", name: "Public Transport", distance: "300m" },
                    { icon: "🛍️", name: "Shopping Center", distance: "1km" },
                  ].map((attraction, i) => (
                    <div key={i} style={{ padding: "clamp(10px, 1vw, 14px)", background: "#FAFAFA", borderRadius: "8px", border: "1px solid #DDDDDD", display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "clamp(20px, 2vw, 24px)", flexShrink: 0 }}>{attraction.icon}</span>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "clamp(13px, 1.1vw, 14px)", color: "#222" }}>{attraction.name}</p>
                        <p style={{ fontSize: "clamp(11px, 0.9vw, 12px)", color: "#717171" }}>{attraction.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Host section */}
            <div style={{ padding: "32px 0" }}>
              <div style={{ background: "#FAFAFA", borderRadius: "12px", border: "1px solid #DDDDDD", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <img
                    src={listing.hostAvatar}
                    alt={listing.hostName}
                    style={{ width: "clamp(56px, 6vw, 72px)", height: "clamp(56px, 6vw, 72px)", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #DDDDDD" }}
                    onError={e => { (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?img=8"; }}
                  />
                  <div style={{ flex: 1, minWidth: "130px" }}>
                    <h2 style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, color: "#222" }}>Hosted by {listing.hostName}</h2>
                    <p style={{ fontSize: "clamp(13px, 1vw, 14px)", color: "#717171", marginTop: "2px" }}>Hosting since {listing.hostSince}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
                      <span style={{ fontSize: "clamp(13px, 1vw, 14px)" }}>
                        <span style={{ fontWeight: 700, color: "#222" }}>⭐ {listing.rating}</span>
                        <span style={{ color: "#717171" }}> rating</span>
                      </span>
                      <span style={{ fontSize: "clamp(13px, 1vw, 14px)" }}>
                        <span style={{ fontWeight: 700, color: "#222" }}>📝 {listing.reviewCount}</span>
                        <span style={{ color: "#717171" }}> reviews</span>
                      </span>
                      {listing.isSuperhost && (
                        <span style={{ fontSize: "clamp(13px, 1vw, 14px)", fontWeight: 700, color: "#FF385C" }}>🏆 Superhost</span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "clamp(14px, 1.1vw, 15px)", color: "#222", lineHeight: "1.7", marginBottom: "20px" }}>
                  {listing.hostName} is a highly experienced host. Guests consistently rate them highly for cleanliness, communication, and accuracy.
                </p>

                <button
                  style={{
                    width: "100%",
                    padding: "clamp(12px, 1.2vw, 14px)",
                    borderRadius: "8px",
                    border: "none",
                    background: "#222222",
                    color: "white",
                    fontSize: "clamp(15px, 1.2vw, 16px)",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#111111"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#222222"; }}
                >
                  <MessageCircle size={18} />
                  Contact Host
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Booking card */}
          <div className="booking-column" style={{ 
            width: "clamp(300px, 30vw, 360px)", 
            flexShrink: 0, 
            position: "sticky", 
            top: "100px",
          }}>
            <div style={{ 
              background: "white", 
              borderRadius: "12px", 
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              border: "1px solid #DDDDDD",
              padding: "24px",
            }}>
              <BookingCard listing={listing} />
            </div>
          </div>
        </div>

        {/* Mobile reserve bar */}
        <div className="mobile-reserve-bar" style={{
          position: "fixed", 
          bottom: 0, 
          left: 0, 
          right: 0,
          background: "white", 
          borderTop: "1px solid #DDDDDD",
          padding: "16px 24px", 
          display: "none",
          alignItems: "center",
          justifyContent: "space-between", 
          zIndex: 50,
        }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: "18px" }}>₹{listing.price.toLocaleString("en-IN")}</span>
            <span style={{ color: "#717171", fontSize: "14px" }}> / night</span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
              <Star size={12} style={{ fill: "#222", stroke: "#222" }} />
              <span style={{ fontSize: "12px", color: "#717171" }}>{listing.rating} · {listing.reviewCount} reviews</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowMobileBooking(true)}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#FF385C",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#E31C5F"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#FF385C"; }}
          >
            Reserve
          </button>
        </div>

        {showMobileBooking && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 120,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setShowMobileBooking(false)}
          >
            <div
              style={{
                width: "min(560px, 100%)",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "white",
                borderRadius: "16px 16px 0 0",
                padding: "16px",
                boxShadow: "0 -8px 24px rgba(0,0,0,0.18)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Complete your reservation</h3>
                <button
                  type="button"
                  aria-label="Close booking panel"
                  onClick={() => setShowMobileBooking(false)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1px solid #DDDDDD",
                    background: "white",
                    cursor: "pointer",
                    fontSize: "20px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
              <BookingCard listing={listing} />
            </div>
          </div>
        )}
      </main>

      {/* Photo viewer modal */}
      {showAllPhotos && (
        <div style={{
          position: "fixed", inset: 0, background: "black",
          zIndex: 300, display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
            <button
              onClick={() => setShowAllPhotos(false)}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <X size={20} color="white" />
            </button>
            <span style={{ color: "white", fontSize: "14px" }}>{currentPhoto + 1} / {listing.images.length}</span>
            <div style={{ width: "40px" }} />
          </div>

          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
            <img
              src={listing.images[currentPhoto]}
              alt=""
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px" }}
            />
            {currentPhoto > 0 && (
              <button
                onClick={() => setCurrentPhoto(p => p - 1)}
                style={{ position: "absolute", left: "12px", background: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {currentPhoto < listing.images.length - 1 && (
              <button
                onClick={() => setCurrentPhoto(p => p + 1)}
                style={{ position: "absolute", right: "12px", background: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", padding: "16px 24px", overflowX: "auto" }}>
            {listing.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setCurrentPhoto(i)}
                style={{
                  width: "64px", height: "64px", objectFit: "cover", borderRadius: "6px",
                  cursor: "pointer", flexShrink: 0,
                  opacity: i === currentPhoto ? 1 : 0.5,
                  border: i === currentPhoto ? "2px solid white" : "2px solid transparent",
                  transition: "opacity 0.15s",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        /* Mobile responsive styles */
        @media (max-width: 1024px) {
          .mobile-reserve-bar {
            display: flex !important;
          }
          .booking-column {
            display: none !important;
          }
          .detail-layout {
            flex-direction: column !important;
            gap: 32px !important;
          }
          .detail-layout > div:first-child {
            width: 100% !important;
          }
        }

        @media (min-width: 1025px) {
          .mobile-reserve-bar {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .image-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: 280px 90px 90px !important;
            border-radius: 8px !important;
            height: auto !important;
          }
          .image-grid > div:first-child {
            grid-row: auto !important;
            height: 280px !important;
          }
          .image-grid > div:not(:first-child) {
            height: 90px !important;
          }
          .image-grid > div:not(:first-child) img {
            object-fit: cover !important;
          }
          .share-text, .save-text {
            display: none !important;
          }
          .show-photos-text {
            display: none !important;
          }
          .show-all-photos-btn {
            padding: 6px 12px !important;
            bottom: 12px !important;
            right: 12px !important;
          }
          .detail-layout {
            gap: 24px !important;
          }
          .detail-layout > div:first-child > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          main {
            padding: 16px 16px 80px !important;
          }
        }

        @media (max-width: 480px) {
          .image-grid {
            grid-template-rows: 220px 70px 70px !important;
          }
          .image-grid > div:first-child {
            height: 220px !important;
          }
          .image-grid > div:not(:first-child) {
            height: 70px !important;
          }
          .mobile-reserve-bar {
            padding: 12px 16px !important;
          }
          .mobile-reserve-bar button {
            padding: 10px 18px !important;
            font-size: 13px !important;
          }
          .mobile-reserve-bar div span:first-child {
            font-size: 16px !important;
          }
        }

        @media (max-width: 380px) {
          .image-grid {
            grid-template-rows: 180px 60px 60px !important;
          }
          .image-grid > div:first-child {
            height: 180px !important;
          }
          .image-grid > div:not(:first-child) {
            height: 60px !important;
          }
          main {
            padding: 12px 12px 70px !important;
          }
        }
      `}</style>
      <Footer />
    </div>
  );
}