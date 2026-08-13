"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Star, Users, X, Plane, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser, getUserBookings, getAllListings, cancelBooking } from "@/lib/store";
import { Booking, Listing, User } from "@/lib/data";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function TripsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Record<string, Listing>>({});
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/"); return; }
    setUser(u);
    import("@/lib/api").then(api => {
      api.fetchUserBookings(u.id).then(userBookings => {
        setBookings(userBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }).catch(console.error);
      
      api.fetchListings().then(all => {
        const map: Record<string, Listing> = {};
        all.forEach(l => { map[l.id] = l; });
        setListings(map);
      }).catch(console.error);
    });
  }, []);

  function handleCancel(bookingId: string) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    import("@/lib/api").then(api => {
      api.cancelBookingAPI(bookingId).then(() => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" as const } : b));
        toast.success("Booking cancelled");
      }).catch(err => {
        console.error(err);
        toast.error("Failed to cancel booking");
      });
    });
  }

  const upcoming = bookings.filter(b => b.status !== "cancelled" && new Date(b.checkIn) >= new Date());
  const past = bookings.filter(b => b.status !== "cancelled" && new Date(b.checkIn) < new Date());
  const cancelled = bookings.filter(b => b.status === "cancelled");

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", color: "#222222" }}>
      <Navbar />
      
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 80px" }}>
        
        {/* Header */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <h1 style={{ 
            fontSize: "clamp(28px, 4vw, 36px)", 
            fontWeight: 700, 
            color: "#222",
            letterSpacing: "-0.02em"
          }}>
            Trips
          </h1>
          <Link 
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #DDDDDD",
              background: "white",
              fontSize: "14px",
              fontWeight: 600,
              color: "#222",
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.background = "#F7F7F7"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.background = "white"; }}
          >
            Explore more
            <ChevronRight size={16} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "80px 24px",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #DDDDDD"
          }}>
            <div style={{ 
              fontSize: "64px", 
              marginBottom: "16px",
              display: "block"
            }}>
              ✈️
            </div>
            <h2 style={{ 
              fontSize: "24px", 
              fontWeight: 600, 
              color: "#222", 
              marginBottom: "8px" 
            }}>
              No trips yet
            </h2>
            <p style={{ fontSize: "16px", color: "#717171", marginBottom: "24px" }}>
              Time to start planning your next adventure!
            </p>
            <Link 
              href="/" 
              style={{
                display: "inline-block",
                padding: "14px 32px",
                borderRadius: "8px",
                border: "none",
                background: "#FF385C",
                color: "white",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#E31C5F"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#FF385C"; }}
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <>
            {/* Upcoming trips */}
            {upcoming.length > 0 && (
              <section style={{ marginBottom: "40px" }}>
                <h2 style={{ 
                  fontSize: "clamp(20px, 2.5vw, 24px)", 
                  fontWeight: 700, 
                  color: "#222",
                  marginBottom: "20px"
                }}>
                  Upcoming trips
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {upcoming.map(booking => {
                    const listing = listings[booking.listingId];
                    if (!listing) return null;
                    const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000);
                    return (
                      <div 
                        key={booking.id} 
                        style={{
                          background: "white",
                          border: "1px solid #DDDDDD",
                          borderRadius: "12px",
                          padding: "20px",
                          display: "flex",
                          gap: "20px",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <Link 
                          href={`/listings/${listing.id}`} 
                          style={{ flexShrink: 0 }}
                        >
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title} 
                            style={{ 
                              width: "clamp(80px, 12vw, 128px)", 
                              height: "clamp(80px, 12vw, 128px)", 
                              objectFit: "cover", 
                              borderRadius: "8px",
                              border: "1px solid #DDDDDD"
                            }}
                            onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop"; }}
                          />
                        </Link>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "flex-start", 
                            justifyContent: "space-between",
                            gap: "12px",
                            flexWrap: "wrap"
                          }}>
                            <div style={{ flex: 1, minWidth: "120px" }}>
                              <p style={{ fontSize: "14px", color: "#717171", marginBottom: "2px" }}>{listing.type}</p>
                              <Link 
                                href={`/listings/${listing.id}`} 
                                style={{ 
                                  fontSize: "clamp(16px, 1.5vw, 18px)", 
                                  fontWeight: 600, 
                                  color: "#222", 
                                  textDecoration: "none",
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; }}
                                onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}
                              >
                                {listing.title}
                              </Link>
                              <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "4px", 
                                fontSize: "14px", 
                                color: "#717171",
                                marginTop: "4px"
                              }}>
                                <MapPin size={14} />
                                <span>{listing.location}</span>
                              </div>
                            </div>
                            <span style={{ 
                              fontSize: "12px", 
                              fontWeight: 600, 
                              color: "#16A34A", 
                              background: "#DCFCE7", 
                              padding: "4px 12px", 
                              borderRadius: "20px",
                              flexShrink: 0
                            }}>
                              Confirmed
                            </span>
                          </div>
                          
                          <div style={{ 
                            display: "flex", 
                            flexWrap: "wrap", 
                            gap: "16px", 
                            marginTop: "12px",
                            fontSize: "14px",
                            color: "#4B5563"
                          }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <Calendar size={14} />
                              {format(new Date(booking.checkIn), "MMM d")} – {format(new Date(booking.checkOut), "MMM d, yyyy")}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <Users size={14} />
                              {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                            </span>
                            <span>{nights} night{nights > 1 ? "s" : ""}</span>
                            <span style={{ fontWeight: 600, color: "#222" }}>
                              ₹{booking.totalPrice.toLocaleString("en-IN")} total
                            </span>
                          </div>
                          
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "16px", 
                            marginTop: "12px",
                            flexWrap: "wrap"
                          }}>
                            <Link 
                              href={`/listings/${listing.id}`} 
                              style={{ 
                                fontSize: "14px", 
                                fontWeight: 600, 
                                color: "#222",
                                textDecoration: "underline",
                                transition: "color 0.15s"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.color = "#717171"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "#222"; }}
                            >
                              View listing
                            </Link>
                            <button 
                              onClick={() => handleCancel(booking.id)} 
                              style={{ 
                                fontSize: "14px", 
                                fontWeight: 600, 
                                color: "#E11900",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                                padding: 0,
                                transition: "color 0.15s"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.color = "#B91C1C"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "#E11900"; }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Past trips */}
            {past.length > 0 && (
              <section style={{ marginBottom: "40px" }}>
                <h2 style={{ 
                  fontSize: "clamp(20px, 2.5vw, 24px)", 
                  fontWeight: 700, 
                  color: "#222",
                  marginBottom: "20px"
                }}>
                  Past trips
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {past.map(booking => {
                    const listing = listings[booking.listingId];
                    if (!listing) return null;
                    return (
                      <div 
                        key={booking.id} 
                        style={{
                          background: "white",
                          border: "1px solid #DDDDDD",
                          borderRadius: "12px",
                          padding: "16px 20px",
                          display: "flex",
                          gap: "16px",
                          opacity: 0.7,
                          transition: "all 0.15s",
                          flexWrap: "wrap"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title} 
                          style={{ 
                            width: "clamp(60px, 8vw, 96px)", 
                            height: "clamp(60px, 8vw, 96px)", 
                            objectFit: "cover", 
                            borderRadius: "8px",
                            border: "1px solid #DDDDDD",
                            flexShrink: 0
                          }}
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop"; }}
                        />
                        <div style={{ flex: 1, minWidth: "140px" }}>
                          <p style={{ fontWeight: 600, fontSize: "clamp(15px, 1.3vw, 17px)", color: "#222" }}>
                            {listing.title}
                          </p>
                          <p style={{ fontSize: "14px", color: "#717171", marginTop: "2px" }}>
                            {format(new Date(booking.checkIn), "MMM d")} – {format(new Date(booking.checkOut), "MMM d, yyyy")}
                          </p>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "16px", 
                            marginTop: "8px",
                            flexWrap: "wrap"
                          }}>
                            <Link 
                              href={`/listings/${listing.id}`} 
                              style={{ 
                                fontSize: "14px", 
                                fontWeight: 600, 
                                color: "#222",
                                textDecoration: "underline",
                                transition: "color 0.15s"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.color = "#717171"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "#222"; }}
                            >
                              View listing
                            </Link>
                            <button 
                              style={{ 
                                fontSize: "14px", 
                                fontWeight: 600, 
                                color: "#222",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                                padding: 0,
                                transition: "color 0.15s"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.color = "#717171"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "#222"; }}
                            >
                              Leave a review
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Cancelled trips */}
            {cancelled.length > 0 && (
              <section>
                <h2 style={{ 
                  fontSize: "clamp(20px, 2.5vw, 24px)", 
                  fontWeight: 700, 
                  color: "#222",
                  marginBottom: "20px"
                }}>
                  Cancelled trips
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {cancelled.map(booking => {
                    const listing = listings[booking.listingId];
                    if (!listing) return null;
                    return (
                      <div 
                        key={booking.id} 
                        style={{
                          background: "#FAFAFA",
                          border: "1px solid #DDDDDD",
                          borderRadius: "12px",
                          padding: "16px 20px",
                          display: "flex",
                          gap: "16px",
                          opacity: 0.5,
                          flexWrap: "wrap"
                        }}
                      >
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title} 
                          style={{ 
                            width: "clamp(60px, 8vw, 96px)", 
                            height: "clamp(60px, 8vw, 96px)", 
                            objectFit: "cover", 
                            borderRadius: "8px",
                            border: "1px solid #DDDDDD",
                            filter: "grayscale(1)",
                            flexShrink: 0
                          }}
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop"; }}
                        />
                        <div style={{ flex: 1, minWidth: "140px" }}>
                          <span style={{ 
                            fontSize: "12px", 
                            fontWeight: 600, 
                            color: "#991B1B", 
                            background: "#FEE2E2", 
                            padding: "2px 10px", 
                            borderRadius: "20px",
                            display: "inline-block",
                            marginBottom: "4px"
                          }}>
                            Cancelled
                          </span>
                          <p style={{ fontWeight: 600, fontSize: "clamp(15px, 1.3vw, 17px)", color: "#222" }}>
                            {listing.title}
                          </p>
                          <p style={{ fontSize: "14px", color: "#717171", marginTop: "2px" }}>
                            {format(new Date(booking.checkIn), "MMM d")} – {format(new Date(booking.checkOut), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}