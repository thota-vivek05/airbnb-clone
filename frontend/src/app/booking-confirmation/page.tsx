"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Star, MapPin, Calendar, Users, ArrowRight, Home, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBookings, getAllListings } from "@/lib/store";
import { Booking, Listing } from "@/lib/data";
import { format } from "date-fns";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    const bookingId = searchParams.get("id");
    const listingId = searchParams.get("listingId");
    if (!bookingId || !listingId) return;

    const bookings = getBookings();
    const found = bookings.find(b => b.id === bookingId);
    if (found) setBooking(found);

    const listings = getAllListings();
    const foundListing = listings.find(l => l.id === listingId);
    if (foundListing) setListing(foundListing);
  }, [searchParams]);

  if (!booking || !listing) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F7" }}>
        <Navbar />
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p style={{ fontSize: "16px", color: "#717171", marginBottom: "20px" }}>Booking not found</p>
          <Link 
            href="/" 
            style={{
              display: "inline-block",
              padding: "12px 28px",
              borderRadius: "8px",
              border: "none",
              background: "#FF385C",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#E31C5F"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#FF385C"; }}
          >
            Go home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", color: "#222222" }}>
      <Navbar />
      
      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 80px" }}>
        
        {/* Success header */}
        <div style={{ 
          background: "white", 
          borderRadius: "12px", 
          border: "1px solid #DDDDDD",
          padding: "40px 32px", 
          marginBottom: "24px", 
          textAlign: "center" 
        }}>
          <div style={{ 
            width: "72px", 
            height: "72px", 
            background: "#DCFCE7", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 16px" 
          }}>
            <CheckCircle size={40} style={{ color: "#16A34A" }} />
          </div>
          <h1 style={{ 
            fontSize: "clamp(24px, 4vw, 28px)", 
            fontWeight: 700, 
            color: "#222", 
            marginBottom: "8px" 
          }}>
            Your trip is confirmed! 🎉
          </h1>
          <p style={{ fontSize: "16px", color: "#717171" }}>
            Your booking has been confirmed. Get ready for an amazing stay!
          </p>
        </div>

        {/* Booking details */}
        <div style={{ 
          background: "white", 
          borderRadius: "12px", 
          border: "1px solid #DDDDDD",
          padding: "24px", 
          marginBottom: "24px" 
        }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: 600, 
            color: "#222", 
            marginBottom: "16px" 
          }}>
            Booking details
          </h2>
          
          <div style={{ 
            display: "flex", 
            gap: "16px", 
            marginBottom: "20px",
            flexWrap: "wrap"
          }}>
            <img
              src={listing.images[0]}
              alt={listing.title}
              style={{ 
                width: "96px", 
                height: "96px", 
                objectFit: "cover", 
                borderRadius: "8px", 
                flexShrink: 0,
                border: "1px solid #DDDDDD"
              }}
              onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop"; }}
            />
            <div style={{ flex: 1, minWidth: "150px" }}>
              <p style={{ fontSize: "14px", color: "#717171", marginBottom: "2px" }}>{listing.type}</p>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#222", marginBottom: "4px" }}>
                {listing.title}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#717171", flexWrap: "wrap" }}>
                <Star size={14} style={{ fill: "#222", stroke: "#222" }} />
                <span>{listing.rating} · {listing.reviewCount} reviews</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#717171", marginTop: "2px" }}>
                <MapPin size={14} />
                <span>{listing.location}</span>
              </div>
            </div>
          </div>

          <div style={{ 
            height: "1px", 
            background: "#DDDDDD", 
            margin: "16px 0" 
          }} />

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
            gap: "16px",
            marginBottom: "16px"
          }}>
            <div>
              <p style={{ 
                fontSize: "13px", 
                fontWeight: 500, 
                color: "#717171", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                marginBottom: "4px"
              }}>
                <Calendar size={16} /> Check-in
              </p>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "#222" }}>
                {format(new Date(booking.checkIn), "EEE, MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: "13px", 
                fontWeight: 500, 
                color: "#717171", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                marginBottom: "4px"
              }}>
                <Calendar size={16} /> Check-out
              </p>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "#222" }}>
                {format(new Date(booking.checkOut), "EEE, MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: "13px", 
                fontWeight: 500, 
                color: "#717171", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                marginBottom: "4px"
              }}>
                <Users size={16} /> Guests
              </p>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "#222" }}>
                {booking.guests} guest{booking.guests > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: "13px", 
                fontWeight: 500, 
                color: "#717171", 
                marginBottom: "4px"
              }}>
                Duration
              </p>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "#222" }}>
                {nights} night{nights > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div style={{ 
            height: "1px", 
            background: "#DDDDDD", 
            margin: "16px 0" 
          }} />

          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px"
          }}>
            <span style={{ fontWeight: 600, fontSize: "16px", color: "#222" }}>Total paid</span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#222" }}>
                ₹{booking.totalPrice.toLocaleString("en-IN")}
              </span>
              <span style={{ 
                fontSize: "12px", 
                fontWeight: 600, 
                color: "#16A34A", 
                background: "#DCFCE7", 
                padding: "4px 12px", 
                borderRadius: "20px" 
              }}>
                ✓ Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Host info */}
        <div style={{ 
          background: "white", 
          borderRadius: "12px", 
          border: "1px solid #DDDDDD",
          padding: "24px", 
          marginBottom: "24px" 
        }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: 600, 
            color: "#222", 
            marginBottom: "16px" 
          }}>
            Your host
          </h2>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <img 
              src={listing.hostAvatar} 
              alt={listing.hostName} 
              style={{ 
                width: "56px", 
                height: "56px", 
                borderRadius: "50%", 
                objectFit: "cover",
                border: "2px solid #DDDDDD",
                flexShrink: 0
              }}
              onError={e => { (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?img=8"; }}
            />
            <div style={{ flex: 1, minWidth: "120px" }}>
              <p style={{ fontWeight: 600, fontSize: "16px", color: "#222" }}>{listing.hostName}</p>
              <p style={{ fontSize: "14px", color: "#717171" }}>Hosting since {listing.hostSince}</p>
              {listing.isSuperhost && (
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#FF385C" }}>⭐ Superhost</p>
              )}
            </div>
            <button 
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid #DDDDDD",
                background: "white",
                fontSize: "14px",
                fontWeight: 600,
                color: "#222",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.background = "#F7F7F7"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.background = "white"; }}
            >
              <MessageCircle size={16} />
              Message
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ 
          display: "flex", 
          gap: "16px",
          flexWrap: "wrap"
        }}>
          <Link 
            href="/trips" 
            style={{
              flex: 1,
              minWidth: "150px",
              padding: "14px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#222222",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#111111"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#222222"; }}
          >
            View my trips <ArrowRight size={18} />
          </Link>
          <Link 
            href="/" 
            style={{
              flex: 1,
              minWidth: "150px",
              padding: "14px 24px",
              borderRadius: "8px",
              border: "1px solid #DDDDDD",
              background: "white",
              color: "#222",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.background = "#F7F7F7"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.background = "white"; }}
          >
            Explore more
          </Link>
        </div>

        {/* Additional info */}
        <div style={{ 
          marginTop: "32px",
          padding: "20px",
          background: "#FAFAFA",
          borderRadius: "12px",
          border: "1px solid #DDDDDD",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "14px", color: "#717171" }}>
            Need help? <Link href="/help" style={{ color: "#222", fontWeight: 600, textDecoration: "underline" }}>Contact support</Link>
          </p>
          <p style={{ fontSize: "12px", color: "#717171", marginTop: "4px" }}>
            Booking reference: <span style={{ fontWeight: 600, color: "#222" }}>#{booking.id.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#F7F7F7"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "3px solid #DDDDDD",
            borderTop: "3px solid #222222",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "#717171", fontSize: "14px" }}>Loading booking...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}