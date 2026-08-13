"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, Edit3, Trash2, Star, Eye, Calendar, Users, BarChart3,
  Home, TrendingUp, Clock, DollarSign, MapPin, CheckCircle2,
  BedDouble, Bath, ArrowUpRight, Loader2, MessageCircle, Award,
  TrendingDown, Activity, Zap, Bell, AlertCircle, Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/store";
import { fetchHostListings, fetchHostBookings, deleteListingAPI } from "@/lib/api";
import { Listing, Booking, User } from "@/lib/data";
import toast from "react-hot-toast";

export default function HostDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "messages" | "performance">("overview");
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || !u.isHost) { router.push("/"); return; }
    setUser(u);
    loadData(u.id);
  }, [router]);

  async function loadData(hostId: string) {
    setLoading(true);
    try {
      const [hostListings, hostBookings] = await Promise.all([
        fetchHostListings(hostId),
        fetchHostBookings(hostId),
      ]);
      setListings(hostListings);
      setBookings(hostBookings);
    } catch {
      setListings([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(listingId: string) {
    if (!confirm("Delete this listing? This action cannot be undone.")) return;
    setDeletingId(listingId);
    try {
      await deleteListingAPI(listingId);
      setListings(prev => prev.filter(l => l.id !== listingId));
      setBookings(prev => prev.filter(b => b.listingId !== listingId));
      toast.success("Listing deleted successfully");
    } catch {
      toast.error("Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  }

  // Calculate advanced metrics
  const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + b.totalPrice, 0);
  const activeBookings = bookings.filter(b => b.status === "confirmed");
  const avgRating = listings.length > 0 ? (listings.reduce((s, l) => s + l.rating, 0) / listings.length).toFixed(2) : "—";
  const pendingBookings = bookings.filter(b => b.status === "pending");
  const totalReviews = listings.reduce((s, l) => s + l.reviewCount, 0);
  const isSuperhost = listings.some(l => l.isSuperhost);
  const occupancyRate = listings.length > 0 ? Math.round((activeBookings.length / listings.length) * 100) : 0;
  const responseTime = "< 2 hours";
  const upcomingCheckIns = activeBookings.filter(b => new Date(b.checkIn) < new Date(Date.now() + 7 * 24 * 60 * 60)).length;
  const monthlyRevenue = bookings.filter(b => b.status !== "cancelled" && new Date(b.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60)).reduce((sum, b) => sum + b.totalPrice, 0);

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7" }}>
      <Navbar />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ width: "64px", height: "64px", overflow: "hidden", borderRadius: "50%", border: "2px solid #DDDDDD", flexShrink: 0 }}>
                <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#717171" }}>Host dashboard</p>
                <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em", color: "#222222" }}>Welcome back, {user.name.split(" ")[0]}</h1>
              </div>
            </div>
            <Link
              href="/host/create"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                background: "#222222",
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
                textDecoration: "none",
                transition: "all 0.15s",
                width: "fit-content",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#111111"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#222222"; }}
            >
              <Plus size={18} />
              List new property
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "32px", padding: "4px", borderRadius: "10px", border: "1px solid #DDDDDD", background: "white" }}>
          {[
            { id: "overview" as const, label: "Overview", icon: BarChart3 },
            { id: "bookings" as const, label: "Bookings", icon: Calendar },
            { id: "messages" as const, label: "Messages", icon: MessageCircle },
            { id: "performance" as const, label: "Performance", icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: isActive ? "#222222" : "transparent",
                  color: isActive ? "white" : "#717171",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F7F7F7"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
              {[
                { icon: Home, label: "Total listings", value: listings.length, sub: "+2 this month" },
                { icon: DollarSign, label: "Monthly revenue", value: `₹${monthlyRevenue.toLocaleString("en-IN")}`, sub: "Last 30 days" },
                { icon: Star, label: "Average rating", value: avgRating, sub: `${totalReviews} reviews` },
                { icon: Activity, label: "Occupancy", value: `${occupancyRate}%`, sub: "This period" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div style={{ display: "flex", width: "44px", height: "44px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "#F7F7F7" }}>
                        <Icon size={20} style={{ color: "#222222" }} />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#717171" }}>{stat.sub}</span>
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em", color: "#222222" }}>{stat.value}</div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#717171", marginTop: "4px" }}>{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
              <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", width: "44px", height: "44px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "#F7F7F7" }}>
                    <Clock size={20} style={{ color: "#222222" }} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#222222" }}>Response time</h3>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#222222" }}>{responseTime}</div>
                <p style={{ fontSize: "14px", color: "#717171", marginTop: "4px" }}>Excellent guest communication.</p>
              </div>

              <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", width: "44px", height: "44px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "#F7F7F7" }}>
                    <Calendar size={20} style={{ color: "#222222" }} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#222222" }}>Upcoming check-ins</h3>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#222222" }}>{upcomingCheckIns}</div>
                <p style={{ fontSize: "14px", color: "#717171", marginTop: "4px" }}>Booked in the next 7 days.</p>
              </div>

              <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", width: "44px", height: "44px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "#F7F7F7" }}>
                    <Bell size={20} style={{ color: "#222222" }} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#222222" }}>Pending approvals</h3>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#222222" }}>{pendingBookings.length}</div>
                <p style={{ fontSize: "14px", color: "#717171", marginTop: "4px" }}>Guest requests need attention.</p>
              </div>
            </div>

            {/* Listings */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222" }}>Your listings</h2>
                  <p style={{ fontSize: "14px", color: "#717171" }}>{listings.length} active properties</p>
                </div>
              </div>

              {listings.length === 0 ? (
                <div style={{ borderRadius: "12px", border: "2px dashed #DDDDDD", background: "white", padding: "60px", textAlign: "center" }}>
                  <div style={{ display: "flex", width: "72px", height: "72px", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#F7F7F7", margin: "0 auto 16px" }}>
                    <Home size={32} style={{ color: "#717171" }} />
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 600, color: "#222222" }}>No listings yet</h3>
                  <p style={{ color: "#717171", marginTop: "4px" }}>Start hosting and publish your first property.</p>
                  <Link 
                    href="/host/create" 
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "20px",
                      padding: "12px 28px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#FF385C",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "white",
                      textDecoration: "none",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#E31C5F"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#FF385C"; }}
                  >
                    <Plus size={18} />
                    Create listing
                  </Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                  {listings.map(listing => {
                    const listingBookings = bookings.filter(b => b.listingId === listing.id && b.status !== "cancelled");
                    const revenue = listingBookings.reduce((s, b) => s + b.totalPrice, 0);
                    const isDeleting = deletingId === listing.id;

                    return (
                      <div key={listing.id} style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", overflow: "hidden", transition: "all 0.15s", opacity: isDeleting ? 0.6 : 1 }}>
                        <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                          <img src={listing.images[0]} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />

                          <div style={{ position: "absolute", left: "12px", top: "12px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "20px", background: "white", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#222222", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }} />
                            Active
                          </div>

                          <div style={{ position: "absolute", right: "12px", top: "12px", display: "flex", gap: "8px" }}>
                            <Link href={`/listings/${listing.id}`} style={{ display: "flex", width: "40px", height: "40px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "none", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#F7F7F7"; }} onMouseLeave={e => { e.currentTarget.style.background = "white"; }}>
                              <Eye size={18} style={{ color: "#222222" }} />
                            </Link>
                            <Link href={`/host/edit/${listing.id}`} style={{ display: "flex", width: "40px", height: "40px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "none", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#F7F7F7"; }} onMouseLeave={e => { e.currentTarget.style.background = "white"; }}>
                              <Edit3 size={18} style={{ color: "#222222" }} />
                            </Link>
                            <button onClick={() => handleDelete(listing.id)} style={{ display: "flex", width: "40px", height: "40px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "none", cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; }} onMouseLeave={e => { e.currentTarget.style.background = "white"; }}>
                              {isDeleting ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={18} style={{ color: "#E11900" }} />}
                            </button>
                          </div>

                          <div style={{ position: "absolute", inset: "auto 0 0", padding: "20px", color: "white" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>
                              <MapPin size={14} />
                              {listing.location}
                            </div>
                            <h3 style={{ fontSize: "18px", fontWeight: 600, marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{listing.title}</h3>
                          </div>
                        </div>

                        <div style={{ padding: "20px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} style={{ fill: i < Math.round(listing.rating) ? "#FBBF24" : "#E5E7EB", stroke: i < Math.round(listing.rating) ? "#FBBF24" : "#E5E7EB" }} />
                              ))}
                              <span style={{ marginLeft: "6px", fontSize: "14px", fontWeight: 600, color: "#222222" }}>{listing.rating}</span>
                              <span style={{ color: "#CBD5E1", margin: "0 4px" }}>•</span>
                              <span style={{ fontSize: "12px", color: "#717171" }}>{listing.reviewCount} reviews</span>
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 700, color: "#222222" }}>₹{listing.price.toLocaleString("en-IN")}<span style={{ fontSize: "12px", fontWeight: 500, color: "#717171" }}>/night</span></div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 12px", borderRadius: "20px", background: "#F7F7F7", fontSize: "12px", fontWeight: 600, color: "#717171" }}><BedDouble size={14} /> {listing.bedrooms}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 12px", borderRadius: "20px", background: "#F7F7F7", fontSize: "12px", fontWeight: 600, color: "#717171" }}><Bath size={14} /> {listing.bathrooms}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 12px", borderRadius: "20px", background: "#F7F7F7", fontSize: "12px", fontWeight: 600, color: "#717171" }}><Users size={14} /> {listing.maxGuests}</span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 500, color: "#717171" }}><Calendar size={14} style={{ color: "#2563EB" }} /> {listingBookings.length} bookings</span>
                            <span style={{ fontWeight: 700, color: "#16A34A" }}>₹{revenue.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "bookings" && (
          <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginBottom: "20px" }}>Recent bookings</h2>

            {bookings.length === 0 ? (
              <div style={{ borderRadius: "12px", border: "2px dashed #DDDDDD", background: "#FAFAFA", padding: "60px", textAlign: "center" }}>
                <Calendar size={48} style={{ color: "#CBD5E1", margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222" }}>No bookings yet</h3>
                <p style={{ color: "#717171", marginTop: "4px" }}>Your guest reservations will appear here.</p>
              </div>
            ) : (
              <div style={{ borderRadius: "8px", border: "1px solid #DDDDDD", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "4fr 2fr 2fr 2fr 2fr", gap: "16px", background: "#F7F7F7", padding: "14px 20px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#717171" }}>
                  <div>Property</div>
                  <div>Guest</div>
                  <div>Dates</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>

                {bookings.slice(0, 10).map(booking => {
                  const listing = listings.find(l => l.id === booking.listingId);
                  const checkIn = new Date(booking.checkIn);
                  const checkOut = new Date(booking.checkOut);
                  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div key={booking.id} style={{ display: "grid", gridTemplateColumns: "4fr 2fr 2fr 2fr 2fr", gap: "16px", padding: "14px 20px", borderTop: "1px solid #DDDDDD", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {listing && <img src={listing.images[0]} alt={listing.title} style={{ width: "56px", height: "56px", borderRadius: "8px", objectFit: "cover" }} />}
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "#222222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{listing?.title}</p>
                          <p style={{ fontSize: "12px", color: "#717171" }}>{listing?.location}</p>
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#4B5563" }}>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</div>
                      <div style={{ fontSize: "12px", color: "#4B5563" }}>
                        <div style={{ fontWeight: 700, color: "#222222" }}>{checkIn.toLocaleDateString("en-IN")}</div>
                        <div>{nights} night{nights > 1 ? "s" : ""}</div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#222222" }}>₹{booking.totalPrice.toLocaleString("en-IN")}</div>
                      <div>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 14px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background: booking.status === "confirmed" ? "#DCFCE7" : booking.status === "cancelled" ? "#FEE2E2" : "#FEF3C7",
                          color: booking.status === "confirmed" ? "#166534" : booking.status === "cancelled" ? "#991B1B" : "#92400E",
                        }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: booking.status === "confirmed" ? "#22C55E" : booking.status === "cancelled" ? "#EF4444" : "#F59E0B" }} />
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "60px", textAlign: "center" }}>
            <div style={{ display: "flex", width: "72px", height: "72px", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#F7F7F7", margin: "0 auto 16px" }}>
              <MessageCircle size={32} style={{ color: "#94A3B8" }} />
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: 600, color: "#222222" }}>Guest messages</h3>
            <p style={{ maxWidth: "400px", margin: "8px auto 0", color: "#717171" }}>Keep the conversation warm and timely to improve trust and conversions.</p>
            <button style={{
              marginTop: "20px",
              padding: "12px 28px",
              borderRadius: "8px",
              border: "none",
              background: "#222222",
              fontSize: "14px",
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#111111"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#222222"; }}
            >
              View all messages
            </button>
          </div>
        )}

        {activeTab === "performance" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "32px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "20px" }}>Host performance</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { label: "Overall rating", value: avgRating, max: 5 },
                  { label: "Response rate", value: 98, max: 100 },
                  { label: "Accuracy score", value: 4.9, max: 5 },
                ].map(item => {
                  const percent = (Number(item.value) / item.max) * 100;
                  return (
                    <div key={item.label}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", color: "#4B5563", marginBottom: "6px" }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: 700, color: "#222222" }}>{typeof item.value === "number" && item.value % 1 !== 0 ? item.value.toFixed(1) : item.value}{item.max === 100 ? "%" : "/5"}</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", borderRadius: "999px", background: "#E5E7EB" }}>
                        <div style={{ width: `${percent}%`, height: "100%", borderRadius: "999px", background: "#222222" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "32px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "20px" }}>Revenue analytics</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Monthly revenue", value: `₹${monthlyRevenue.toLocaleString("en-IN")}` },
                  { label: "Average booking", value: bookings.length > 0 ? `₹${Math.round(totalRevenue / bookings.length).toLocaleString("en-IN")}` : "—" },
                  { label: "Total earnings", value: `₹${totalRevenue.toLocaleString("en-IN")}` },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderRadius: "8px", background: "#F7F7F7" }}>
                    <span style={{ fontSize: "14px", color: "#717171" }}>{item.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#222222" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .listings-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .listings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}