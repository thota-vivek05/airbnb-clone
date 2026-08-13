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

const TABS: { id: NavTab; label: string; activeIcon: string; inactiveIcon: string }[] = [
  {
    id: "all",
    label: "All",
    activeIcon: "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/f50ce552-509c-4f54-af4c-605c5220d906.png?im_w=240",
    inactiveIcon: "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/a811de29-114f-43a0-b8c5-698d4564bd04.png?im_w=240",
  },
  {
    id: "homes",
    label: "Homes",
    activeIcon: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/a32adab1-f9df-47e1-a411-bdff91b579c3.png?im_w=240",
    inactiveIcon: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240",
  },
  {
    id: "experiences",
    label: "Experiences",
    activeIcon: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240",
    inactiveIcon: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/1e24b1c9-b070-48d9-8a70-91aae3151830.png?im_w=240",
  },
  {
    id: "services",
    label: "Services",
    activeIcon: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240",
    inactiveIcon: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/2bf5d36d-e731-4465-a8ef-91abbf2ae8ce.png?im_w=240",
  },
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
          {/* Official Airbnb SVG Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0, color: "#FF385C" }}>
            <svg width="102" height="32" viewBox="0 0 3490 1080" style={{ display: "block", fill: "#FF385C" }}>
              <path d="M1494.71 456.953C1458.28 412.178 1408.46 389.892 1349.68 389.892C1233.51 389.892 1146.18 481.906 1146.18 605.892C1146.18 729.877 1233.51 821.892 1349.68 821.892C1408.46 821.892 1458.28 799.605 1494.71 754.83L1500.95 810.195H1589.84V401.588H1500.95L1494.71 456.953ZM1369.18 736.895C1295.33 736.895 1242.08 683.41 1242.08 605.892C1242.08 528.373 1295.33 474.888 1369.18 474.888C1443.02 474.888 1495.49 529.153 1495.49 605.892C1495.49 682.63 1443.8 736.895 1369.18 736.895ZM1656.11 810.195H1750.46V401.588H1656.11V810.195ZM948.912 666.715C875.618 506.859 795.308 344.664 713.438 184.809C698.623 155.177 670.554 98.2527 645.603 67.8412C609.736 24.1733 556.715 0.779785 502.915 0.779785C449.115 0.779785 396.094 24.1733 360.227 67.8412C335.277 98.2527 307.207 155.177 292.392 184.809C210.522 344.664 130.212 506.859 56.9187 666.715C47.5621 687.769 24.9504 737.675 16.3736 760.289C6.2373 787.581 0.779297 817.213 0.779297 846.845C0.779297 975.509 101.362 1079.22 235.473 1079.22C346.193 1079.22 434.3 1008.26 502.915 934.18C571.53 1008.26 659.638 1079.22 770.357 1079.22C904.468 1079.22 1005.83 975.509 1005.83 846.845C1005.83 817.213 999.593 787.581 989.457 760.289C980.88 737.675 958.268 687.769 948.912 666.715ZM502.915 810.195C447.555 738.455 396.094 649.56 396.094 577.819C396.094 506.079 446.776 470.209 502.915 470.209C559.055 470.209 610.516 508.419 610.516 577.819C610.516 647.22 558.275 738.455 502.915 810.195ZM770.357 998.902C688.362 998.902 618.032 941.557 555.741 872.656C619.966 792.541 690.826 679.121 690.826 577.819C690.826 458.513 598.04 389.892 502.915 389.892C407.79 389.892 315.784 458.513 315.784 577.819C315.784 679.098 386.145 792.478 450.144 872.593C387.845 941.526 317.491 998.902 235.473 998.902C146.586 998.902 81.0898 931.061 81.0898 846.845C81.0898 826.57 84.2087 807.856 91.2261 788.361C98.2436 770.426 120.855 720.52 130.212 701.025C203.505 541.17 282.256 380.534 364.126 220.679C378.941 191.047 403.891 141.921 422.605 119.307C442.877 94.3538 470.947 81.0975 502.915 81.0975C534.883 81.0975 562.953 94.3538 583.226 119.307C601.939 141.921 626.89 191.047 641.704 220.679C723.574 380.534 802.325 541.17 875.618 701.025C884.975 720.52 907.587 770.426 914.604 788.361C921.622 807.856 925.52 826.57 925.52 846.845C925.52 931.061 859.244 998.902 770.357 998.902ZM3285.71 389.892C3226.91 389.892 3175.97 413.098 3139.91 456.953V226.917H3045.56V810.195H3134.45L3140.69 754.83C3177.12 799.605 3226.94 821.892 3285.71 821.892C3401.89 821.892 3489.22 729.877 3489.22 605.892C3489.22 481.906 3401.89 389.892 3285.71 389.892ZM3266.22 736.895C3191.6 736.895 3139.91 682.63 3139.91 605.892C3139.91 529.153 3191.6 474.888 3266.22 474.888C3340.85 474.888 3393.32 528.373 3393.32 605.892C3393.32 683.41 3340.07 736.895 3266.22 736.895ZM2827.24 389.892C2766.15 389.892 2723.56 418.182 2699.37 456.953L2693.13 401.588H2604.24V810.195H2698.59V573.921C2698.59 516.217 2741.47 474.888 2800.73 474.888C2856.87 474.888 2888.84 513.097 2888.84 578.599V810.195H2983.19V566.903C2983.19 457.733 2923.15 389.892 2827.24 389.892ZM1911.86 460.072L1905.62 401.588H1816.73V810.195H1911.08V604.332C1911.08 532.592 1954.74 486.585 2027.26 486.585C2042.85 486.585 2058.44 488.144 2070.92 492.043V401.588C2059.22 396.91 2044.41 395.35 2028.04 395.35C1978.58 395.35 1936.66 421.177 1911.86 460.072ZM2353.96 389.892C2295.15 389.892 2244.21 413.098 2208.15 456.953V226.917H2113.8V810.195H2202.69L2208.93 754.83C2245.36 799.605 2295.18 821.892 2353.96 821.892C2470.13 821.892 2557.46 729.877 2557.46 605.892C2557.46 481.906 2470.13 389.892 2353.96 389.892ZM2334.46 736.895C2259.84 736.895 2208.15 682.63 2208.15 605.892C2208.15 529.153 2259.84 474.888 2334.46 474.888C2409.09 474.888 2461.56 528.373 2461.56 605.892C2461.56 683.41 2408.31 736.895 2334.46 736.895ZM1703.28 226.917C1669.48 226.917 1642.08 254.326 1642.08 288.13C1642.08 321.934 1669.48 349.343 1703.28 349.343C1737.09 349.343 1764.49 321.934 1764.49 288.13C1764.49 254.326 1737.09 226.917 1703.28 226.917Z" fill="currentcolor"></path>
            </svg>
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
                  <img
                    src={activeTab === tab.id ? tab.activeIcon : tab.inactiveIcon}
                    alt={tab.label}
                    style={{ width: "36px", height: "36px" }}
                  />
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
