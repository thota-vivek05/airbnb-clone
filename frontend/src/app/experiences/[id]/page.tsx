"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Star, Heart, Share2, Users, Clock, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Navbar, { NavTab } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toggleWishlist, isWishlisted } from "@/lib/store";
import toast from "react-hot-toast";

// Experience data (matches homepage cards)
const EXPERIENCES = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
    title: "Carve marble with a third-generation sculptor",
    location: "Athens, Greece",
    price: 6609,
    currency: "₹",
    rating: 5.0,
    reviewCount: 42,
    duration: "3 hours",
    groupSize: "Up to 6 guests",
    hostName: "Dimitrios",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
    hostSince: "2019",
    badge: "Airbnb Original",
    description: "Join me in my family's marble workshop, where three generations have crafted stunning sculptures. You'll learn the ancient art of marble carving, from selecting the perfect stone to creating your own small masterpiece. We'll explore the history of Greek sculpture while you get hands-on experience with traditional tools.",
    includes: ["All materials and tools", "Light refreshments", "Your finished sculpture to take home"],
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1564839489309-d0b5f1dfc4b2?w=800&auto=format&fit=crop",
    title: "Art Walking Tour in San Miguel de Allende",
    location: "San Miguel, Mexico",
    price: 3744,
    currency: "₹",
    rating: 4.96,
    reviewCount: 67,
    duration: "2.5 hours",
    groupSize: "Up to 10 guests",
    hostName: "Maria",
    hostAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop",
    hostSince: "2020",
    badge: "Airbnb Original",
    description: "Discover the vibrant art scene of San Miguel de Allende on this intimate walking tour. We'll visit hidden galleries, street murals, and local artists' studios. Learn about the town's rich artistic heritage and meet the creatives who make this UNESCO World Heritage city so special.",
    includes: ["Gallery entrance fees", "Local snack tasting", "Map of art spots"],
    images: [
      "https://images.unsplash.com/photo-1564839489309-d0b5f1dfc4b2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    title: "Savor Premium Matcha in a tea ceremony in Shibuya",
    location: "Shibuya, Japan",
    price: 3595,
    currency: "₹",
    rating: 5.0,
    reviewCount: 89,
    duration: "1.5 hours",
    groupSize: "Up to 4 guests",
    hostName: "Yuki",
    hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop",
    hostSince: "2018",
    badge: "Airbnb Original",
    description: "Experience the art of Japanese tea ceremony in my traditional tea room in the heart of Shibuya. Using the finest ceremonial-grade matcha, I'll guide you through the meditative practice of preparing and savoring tea. This is an oasis of calm in Tokyo's busiest district.",
    includes: ["Premium matcha tea", "Japanese sweets (wagashi)", "Tea ceremony guide booklet"],
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop",
    title: "Kayak to Hudson-Athens lighthouse at golden hour",
    location: "Athens, United States",
    price: 8588,
    currency: "₹",
    rating: 5.0,
    reviewCount: 31,
    duration: "2 hours",
    groupSize: "Up to 8 guests",
    hostName: "Jake",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
    hostSince: "2021",
    badge: "Airbnb Original",
    description: "Paddle through the stunning Hudson River as the sun paints the sky in gold. We'll kayak to the iconic Hudson-Athens Lighthouse, one of the last remaining lighthouses on the river. An unforgettable experience combining adventure, history, and natural beauty.",
    includes: ["All kayak equipment", "Safety briefing", "Waterproof phone pouch"],
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1468824297222-8db5b5c38fdb?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=800&auto=format&fit=crop",
    title: "Learn pot painting with natural cochinilla dye",
    location: "Los Angeles, United States",
    price: 4771,
    currency: "₹",
    rating: 4.98,
    reviewCount: 56,
    duration: "2 hours",
    groupSize: "Up to 6 guests",
    hostName: "Elena",
    hostAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop",
    hostSince: "2020",
    badge: "Airbnb Original",
    description: "Discover the ancient art of using cochinilla — a natural dye derived from insects — to create vibrant pigments for pot painting. In my studio, you'll learn to mix colors and paint traditional designs onto ceramic pots, creating a unique piece to take home.",
    includes: ["All art supplies", "Ceramic pot", "Refreshments"],
    images: [
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop",
    title: "Learn mahjong and sip tea in Brooklyn",
    location: "Brooklyn, United States",
    price: 5725,
    currency: "₹",
    rating: 5.0,
    reviewCount: 45,
    duration: "2 hours",
    groupSize: "Up to 4 guests",
    hostName: "Lin",
    hostAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop",
    hostSince: "2019",
    badge: "Airbnb Original",
    description: "Step into my Brooklyn townhouse for an afternoon of mahjong and premium Chinese tea. I'll teach you the rules and strategy of this ancient tile game while we enjoy hand-selected teas from different regions of China. No experience necessary!",
    includes: ["Premium tea selection", "Light snacks", "Mahjong set to borrow"],
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop",
    title: "Discover Melbourne's acclaimed coffee culture",
    location: "Melbourne, Australia",
    price: 5729,
    currency: "₹",
    rating: 5.0,
    reviewCount: 73,
    duration: "3 hours",
    groupSize: "Up to 8 guests",
    hostName: "Sam",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
    hostSince: "2018",
    badge: "Airbnb Original",
    description: "Melbourne is the coffee capital of the world, and I'll show you why. Visit hidden laneways, meet award-winning baristas, and taste some of the world's best espresso. We'll explore the history and science behind Melbourne's obsession with the perfect cup.",
    includes: ["Coffee tastings at 4 cafes", "Pastry pairing", "Coffee guide booklet"],
    images: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop",
    title: "Seine River Cruise at sunset",
    location: "Paris, France",
    price: 3500,
    currency: "₹",
    rating: 4.97,
    reviewCount: 112,
    duration: "1.5 hours",
    groupSize: "Up to 12 guests",
    hostName: "Pierre",
    hostAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop",
    hostSince: "2017",
    badge: "Popular",
    description: "Cruise along the Seine River as the Parisian sun sets behind the Eiffel Tower. Enjoy champagne while passing by iconic landmarks like Notre-Dame, the Louvre, and Musée d'Orsay. A truly magical way to see Paris.",
    includes: ["Glass of champagne", "Blanket for the cruise", "Photo spots guide"],
    images: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    ],
  },
];

// fallback for ids not in array
function getExperience(id: string) {
  return EXPERIENCES.find(e => e.id === id) || {
    id,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
    title: `Experience #${id}`,
    location: "Worldwide",
    price: 5000,
    currency: "₹",
    rating: 4.9,
    reviewCount: 20,
    duration: "2 hours",
    groupSize: "Up to 6 guests",
    hostName: "Host",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
    hostSince: "2020",
    badge: "Experience",
    description: "An amazing experience curated just for you. Discover something new, learn from a local expert, and create lasting memories.",
    includes: ["All materials included", "Refreshments"],
    images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop"],
  };
}

export default function ExperienceDetailPage() {
  const params = useParams();
  const exp = getExperience(params.id as string);
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(`exp-${exp.id}`));
  const [activeTab] = useState<NavTab>("experiences");

  function handleWishlist() {
    const added = toggleWishlist(`exp-${exp.id}`);
    setWishlisted(added);
    toast(added ? "Saved to wishlist ❤️" : "Removed from wishlist");
  }

  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <Navbar activeTab={activeTab} onTabChange={() => {}} />

      <main style={{ maxWidth: "1120px", margin: "0 auto", padding: "24px 24px 80px" }}>

        {/* Back link */}
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "14px", color: "#222", textDecoration: "none",
            marginBottom: "16px",
          }}
        >
          <ChevronLeft size={16} />
          Back to experiences
        </Link>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#222", lineHeight: "1.3", flex: 1, paddingRight: "24px" }}>
            {exp.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); toast("Link copied!"); }}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "none", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: 500, textDecoration: "underline",
                color: "#222", padding: "8px", borderRadius: "8px",
              }}
            >
              <Share2 size={16} />
              Share
            </button>
            <button
              onClick={handleWishlist}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "none", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: 500, textDecoration: "underline",
                color: "#222", padding: "8px", borderRadius: "8px",
              }}
            >
              <Heart
                size={16}
                style={{
                  fill: wishlisted ? "#FF385C" : "transparent",
                  stroke: wishlisted ? "#FF385C" : "#222",
                }}
              />
              Save
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "32px", aspectRatio: "16/9", maxHeight: "480px" }}>
          <img
            src={exp.image}
            alt={exp.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Two column layout */}
        <div style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>

          {/* Left column */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Badge + Location */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              {exp.badge && (
                <span style={{
                  background: "#F7F7F7", borderRadius: "20px", padding: "6px 12px",
                  fontSize: "12px", fontWeight: 600, color: "#222",
                }}>
                  {exp.badge}
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#717171" }}>
                <MapPin size={14} />
                <span style={{ fontSize: "14px" }}>{exp.location}</span>
              </div>
            </div>

            {/* Quick info */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", paddingBottom: "24px", borderBottom: "1px solid #EBEBEB" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Star size={14} style={{ fill: "#222", stroke: "#222" }} />
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{exp.rating}</span>
                <span style={{ fontSize: "14px", color: "#717171" }}>({exp.reviewCount} reviews)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#717171" }}>
                <Clock size={14} />
                <span style={{ fontSize: "14px" }}>{exp.duration}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#717171" }}>
                <Users size={14} />
                <span style={{ fontSize: "14px" }}>{exp.groupSize}</span>
              </div>
            </div>

            {/* Host */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "24px 0", borderBottom: "1px solid #EBEBEB" }}>
              <img
                src={exp.hostAvatar}
                alt={exp.hostName}
                style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <p style={{ fontWeight: 600, fontSize: "16px" }}>Hosted by {exp.hostName}</p>
                <p style={{ fontSize: "14px", color: "#717171" }}>Hosting since {exp.hostSince}</p>
              </div>
            </div>

            {/* Description */}
            <div style={{ padding: "24px 0", borderBottom: "1px solid #EBEBEB" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>What you&apos;ll do</h2>
              <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#222" }}>{exp.description}</p>
            </div>

            {/* What's included */}
            <div style={{ padding: "24px 0", borderBottom: "1px solid #EBEBEB" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>What&apos;s included</h2>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {exp.includes.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px" }}>
                    <span style={{ color: "#717171" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* More photos */}
            {exp.images.length > 1 && (
              <div style={{ padding: "24px 0" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>Photos</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {exp.images.slice(1).map((img, i) => (
                    <div key={i} style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "16/10" }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — Booking card */}
          <div style={{
            width: "360px", flexShrink: 0,
            position: "sticky", top: "96px",
          }}>
            <div style={{
              border: "1px solid #DDDDDD", borderRadius: "12px",
              padding: "24px", boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            }}>
              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "22px", fontWeight: 700 }}>
                  {exp.currency}{exp.price.toLocaleString("en-IN")}
                </span>
                <span style={{ fontSize: "16px", color: "#717171" }}> / guest</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "20px" }}>
                <Star size={14} style={{ fill: "#222", stroke: "#222" }} />
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{exp.rating}</span>
                <span style={{ fontSize: "14px", color: "#717171" }}>({exp.reviewCount} reviews)</span>
              </div>

              {/* Date picker placeholder */}
              <div style={{
                border: "1px solid #B0B0B0", borderRadius: "8px",
                padding: "14px 12px", marginBottom: "12px",
                fontSize: "14px", color: "#717171",
              }}>
                Select date
              </div>

              {/* Guests */}
              <div style={{
                border: "1px solid #B0B0B0", borderRadius: "8px",
                padding: "14px 12px", marginBottom: "16px",
                fontSize: "14px",
              }}>
                <span style={{ fontWeight: 500 }}>1 guest</span>
              </div>

              <button
                onClick={() => toast.success("Experience booked! 🎉")}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(to right, #E61E4D, #E31C5F, #D70466)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Reserve
              </button>

              <p style={{ textAlign: "center", fontSize: "13px", color: "#717171", marginTop: "12px" }}>
                You won&apos;t be charged yet
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
