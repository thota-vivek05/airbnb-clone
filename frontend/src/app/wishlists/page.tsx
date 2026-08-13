"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star, MapPin, Trash2, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser, getWishlists, getAllListings, toggleWishlist } from "@/lib/store";
import { Listing, User } from "@/lib/data";
import toast from "react-hot-toast";

export default function WishlistsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [wishlisted, setWishlisted] = useState<Listing[]>([]);
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/"); return; }
    setUser(u);
    import("@/lib/api").then(api => {
      Promise.all([
        api.fetchWishlists(u.id),
        api.fetchListings()
      ]).then(([wishlistIds, allListings]) => {
        setWishlisted(allListings.filter(l => wishlistIds.includes(l.id)));
      }).catch(console.error);
    });
  }, []);

  function handleRemove(id: string) {
    if (user) {
      import("@/lib/api").then(api => {
        api.toggleWishlistAPI(user.id, id).then(() => {
          setWishlisted(prev => prev.filter(l => l.id !== id));
          toast("Removed from wishlist");
        }).catch(console.error);
      });
    }
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", color: "#222222" }}>
      <Navbar />
      
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 80px" }}>
        
        {/* Header */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginBottom: "8px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "clamp(28px, 4vw, 36px)", 
              fontWeight: 700, 
              color: "#222",
              letterSpacing: "-0.02em"
            }}>
              Wishlists
            </h1>
            <p style={{ fontSize: "16px", color: "#717171", marginTop: "4px" }}>
              Save properties you love to your wishlist
            </p>
          </div>
          {wishlisted.length > 0 && (
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
          )}
        </div>

        {wishlisted.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "80px 24px",
            marginTop: "40px",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #DDDDDD"
          }}>
            <div style={{ 
              fontSize: "64px", 
              marginBottom: "16px",
              display: "block"
            }}>
              ❤️
            </div>
            <h2 style={{ 
              fontSize: "24px", 
              fontWeight: 600, 
              color: "#222", 
              marginBottom: "8px" 
            }}>
              Create your first wishlist
            </h2>
            <p style={{ 
              fontSize: "16px", 
              color: "#717171", 
              marginBottom: "24px",
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto"
            }}>
              As you search, click the ❤️ icon to save your favourite places and experiences to a wishlist.
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
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
            gap: "24px",
            marginTop: "32px"
          }}>
            {wishlisted.map(listing => (
              <div 
                key={listing.id} 
                style={{
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #DDDDDD",
                  overflow: "hidden",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)"; 
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.boxShadow = "none"; 
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Link href={`/listings/${listing.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        transition: "transform 0.3s"
                      }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.05)"; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                      onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop"; }}
                    />
                    <button
                      onClick={e => { e.preventDefault(); handleRemove(listing.id); }}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "white",
                        borderRadius: "50%",
                        padding: "8px",
                        border: "1px solid #DDDDDD",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={e => { 
                        e.currentTarget.style.borderColor = "#E11900"; 
                        e.currentTarget.style.background = "#FEE2E2";
                      }}
                      onMouseLeave={e => { 
                        e.currentTarget.style.borderColor = "#DDDDDD"; 
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <Trash2 size={16} style={{ color: "#E11900" }} />
                    </button>
                  </div>
                  
                  <div style={{ padding: "16px" }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "flex-start",
                      gap: "8px"
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "4px", 
                          fontSize: "14px", 
                          color: "#717171",
                          marginBottom: "4px"
                        }}>
                          <MapPin size={14} style={{ flexShrink: 0 }} />
                          <span style={{ 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            whiteSpace: "nowrap" 
                          }}>
                            {listing.location}
                          </span>
                        </div>
                        <h3 style={{ 
                          fontSize: "clamp(15px, 1.2vw, 16px)", 
                          fontWeight: 600, 
                          color: "#222",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {listing.title}
                        </h3>
                        <p style={{ fontSize: "14px", color: "#717171", marginTop: "2px" }}>
                          {listing.type}
                        </p>
                        <p style={{ marginTop: "8px", fontSize: "15px" }}>
                          <span style={{ fontWeight: 700, color: "#222" }}>
                            ₹{listing.price.toLocaleString("en-IN")}
                          </span>
                          <span style={{ color: "#717171" }}> night</span>
                        </p>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px", 
                        flexShrink: 0,
                        marginTop: "4px"
                      }}>
                        <Star size={14} style={{ fill: "#222", stroke: "#222" }} />
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#222" }}>
                          {listing.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}