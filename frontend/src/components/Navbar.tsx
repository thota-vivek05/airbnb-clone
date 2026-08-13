"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Menu, User, X, Search } from "lucide-react";
import { getCurrentUser, setCurrentUser, loginUser } from "@/lib/store";
import { User as UserType } from "@/lib/data";
import toast from "react-hot-toast";

export type NavTab = "all" | "homes" | "experiences" | "services";

interface NavbarProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/e2e1c806-2c65-4f0f-a85a-a7ae9a20d2e6.png?im_w=120" }, 
  { id: "homes", label: "Homes", icon: "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/3afe83ba-9aab-403b-a6f6-e4f557d74fc7.png?im_w=120" },
  { id: "experiences", label: "Experiences", icon: "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/20e459e2-008c-42a1-a674-8b00fd841c2f.png?im_w=120" },
  { id: "services", label: "Services", icon:"https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/e048a726-9fe8-4d55-812f-173427f08588.png?im_w=120"  },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const loggedIn = loginUser(email, password);
    if (loggedIn) {
      setUser(loggedIn);
      setShowAuthModal(false);
      toast.success(`Welcome back, ${loggedIn.name.split(" ")[0]}! 👋`);
    } else {
      toast.error("Invalid email or password. Try: alex@example.com / password123");
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setUser(null);
    setShowUserMenu(false);
    toast.success("Logged out successfully");
    router.push("/");
  }

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "white",
          borderBottom: "1px solid #EBEBEB",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: "32px", height: "32px", fill: "#FF385C" }}>
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.44-6.414 3.6l-.28.019-.267.006C5.377 31 2.5 28.584 2.5 24.522l.005-.469c.026-.928.23-1.768.83-3.244l.216-.524c.966-2.298 6.083-12.989 7.16-15.015l.205-.404.535-1.028C11.538 1.963 12.992 1 15 1h1zm0 2h-1c-1.32 0-2.27.618-3.27 2.388l-.532 1.024C10.338 8.41 5.22 19.105 4.26 21.401l-.215.524c-.492 1.21-.672 1.94-.693 2.686L3.35 24.522c0 3.076 2.016 4.478 4.15 4.478 1.806 0 3.8-1.153 5.653-3.082l.232-.246.295-.313.362-.404.335.396.268.303c1.977 2.145 4.1 3.346 5.955 3.346 2.134 0 4.15-1.402 4.15-4.478l-.005-.386c-.031-.775-.246-1.565-.8-2.904l-.226-.548c-.922-2.194-6.007-12.89-7.125-15.022l-.531-1.025C18.271 3.618 17.32 3 16 3zm0 7.5c1.381 0 2.5 1.119 2.5 2.5S17.381 15.5 16 15.5 13.5 14.381 13.5 13s1.119-2.5 2.5-2.5z" />
            </svg>
            <span style={{ color: "#FF385C", fontWeight: 700, fontSize: "20px", letterSpacing: "-0.5px" }}>airbnb</span>
          </Link>

          {/* Center: Tabs or Compact Search Bar */}
          {scrolled ? (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                display: "flex", alignItems: "center", gap: "0",
                border: "1px solid #DDDDDD", borderRadius: "40px",
                background: "white", cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
                padding: "0", overflow: "hidden",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)")}
            >
              <span style={{ padding: "10px 16px", fontSize: "14px", fontWeight: 600, color: "#222", whiteSpace: "nowrap" }}>Anywhere</span>
              <span style={{ width: "1px", height: "24px", background: "#DDDDDD" }} />
              <span style={{ padding: "10px 16px", fontSize: "14px", fontWeight: 600, color: "#222", whiteSpace: "nowrap" }}>Anytime</span>
              <span style={{ width: "1px", height: "24px", background: "#DDDDDD" }} />
              <span style={{ padding: "10px 16px", fontSize: "14px", fontWeight: 400, color: "#717171", whiteSpace: "nowrap" }}>Add guests</span>
              <span style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "#FF385C", display: "flex", alignItems: "center",
                justifyContent: "center", marginRight: "8px", flexShrink: 0,
              }}>
                <Search size={14} color="white" strokeWidth={3} />
              </span>
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    padding: "8px 20px",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab.id ? "2px solid #222222" : "2px solid transparent",
                    cursor: "pointer",
                    color: activeTab === tab.id ? "#222222" : "#717171",
                    fontSize: "14px",
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  <img src={tab.icon} alt={tab.label} style={{ width: "24px", height: "24px", opacity: activeTab === tab.id ? 1 : 0.65 }} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={() => user?.isHost ? router.push("/host/dashboard") : setShowAuthModal(true)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: 600, color: "#222222",
                padding: "8px 12px", borderRadius: "20px",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              {user?.isHost ? "Host Dashboard" : "Become a host"}
            </button>

            <button
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px", borderRadius: "50%", transition: "background 0.15s",
                display: "flex", alignItems: "center",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <Globe size={20} color="#222222" />
            </button>

            {/* User menu button */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  border: "1px solid #DDDDDD", borderRadius: "24px",
                  padding: "6px 10px", background: "white", cursor: "pointer",
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.18)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <Menu size={18} color="#222222" />
                {user ? (
                  <img src={user.avatar} alt={user.name} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#717171", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={16} color="white" />
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div style={{
                  position: "absolute", right: 0, top: "52px",
                  background: "white", border: "1px solid #DDDDDD",
                  borderRadius: "12px", boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
                  width: "240px", zIndex: 200, overflow: "hidden",
                }}>
                  {user ? (
                    <>
                      <div style={{ padding: "16px", borderBottom: "1px solid #EBEBEB" }}>
                        <p style={{ fontWeight: 600, fontSize: "14px" }}>{user.name}</p>
                        <p style={{ fontSize: "12px", color: "#717171", marginTop: "2px" }}>{user.email}</p>
                      </div>
                      {[
                        { href: "/trips", label: "My trips" },
                        { href: "/wishlists", label: "Wishlists" },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setShowUserMenu(false)}
                          style={{ display: "block", padding: "12px 16px", fontSize: "14px", color: "#222", textDecoration: "none", transition: "background 0.1s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
                          onMouseLeave={e => (e.currentTarget.style.background = "none")}
                        >{item.label}</Link>
                      ))}
                      {user.isHost && (
                        <>
                          <div style={{ height: "1px", background: "#EBEBEB", margin: "4px 0" }} />
                          <Link href="/host/dashboard" onClick={() => setShowUserMenu(false)}
                            style={{ display: "block", padding: "12px 16px", fontSize: "14px", color: "#222", textDecoration: "none" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >Host dashboard</Link>
                          <Link href="/host/create" onClick={() => setShowUserMenu(false)}
                            style={{ display: "block", padding: "12px 16px", fontSize: "14px", color: "#222", textDecoration: "none" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >Create listing</Link>
                        </>
                      )}
                      <div style={{ height: "1px", background: "#EBEBEB", margin: "4px 0" }} />
                      <button onClick={handleLogout}
                        style={{ width: "100%", textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#FF385C", background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >Log out</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setShowUserMenu(false); setAuthMode("login"); setShowAuthModal(true); }}
                        style={{ width: "100%", textAlign: "left", padding: "14px 16px", fontSize: "14px", fontWeight: 600, color: "#222", background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >Log in</button>
                      <button onClick={() => { setShowUserMenu(false); setAuthMode("signup"); setShowAuthModal(true); }}
                        style={{ width: "100%", textAlign: "left", padding: "14px 16px", fontSize: "14px", color: "#222", background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >Sign up</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{ background: "white", borderRadius: "12px", padding: "32px", maxWidth: "480px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <button onClick={() => setShowAuthModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "50%" }}>
                <X size={20} />
              </button>
              <h2 style={{ fontSize: "16px", fontWeight: 600 }}>Log in or sign up</h2>
              <div style={{ width: "36px" }} />
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Welcome to Airbnb</h3>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {authMode === "signup" && (
                <input type="text" placeholder="Full name" className="input-field" />
              )}
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" required />
              <button type="submit" className="btn-primary" style={{ borderRadius: "8px", padding: "14px", marginTop: "8px", fontSize: "16px" }}>
                {authMode === "login" ? "Log in" : "Sign up"}
              </button>
            </form>
            <p style={{ textAlign: "center", fontSize: "14px", color: "#717171", marginTop: "16px" }}>
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>
                {authMode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
            <div style={{ background: "#F7F7F7", borderRadius: "8px", padding: "12px 16px", marginTop: "16px", fontSize: "12px", color: "#717171" }}>
              <p style={{ fontWeight: 600, marginBottom: "4px" }}>Demo accounts:</p>
              <p>Guest: alex@example.com / password123</p>
              <p>Host: priya@example.com / password123</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
