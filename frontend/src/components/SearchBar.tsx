"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const POPULAR_DESTINATIONS = [
  { city: "Goa", emoji: "🏖️" },
  { city: "Mumbai", emoji: "🏙️" },
  { city: "Bengaluru", emoji: "🌿" },
  { city: "Jaipur", emoji: "🏯" },
  { city: "Kerala", emoji: "🌴" },
  { city: "Delhi", emoji: "🕌" },
  { city: "Manali", emoji: "⛰️" },
  { city: "Pondicherry", emoji: "🌊" },
];

interface SearchBarProps {
  thirdLabel?: string;
  thirdPlaceholder?: string;
}

export default function HomeSearchBar({ thirdLabel = "Who", thirdPlaceholder = "Add guests" }: SearchBarProps) {
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showDest, setShowDest] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  function handleSearch() {
    const params = new URLSearchParams();
    if (where) params.set("where", where);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    router.push(`/homes?${params.toString()}`);
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "16px 24px 20px" }}>
      <div ref={ref} style={{ position: "relative", width: "100%", maxWidth: "720px" }}>
        <div
          style={{
            display: "flex", alignItems: "stretch",
            border: "1px solid #DDDDDD", borderRadius: "40px",
            background: "white",
            boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Where */}
          <div
            style={{ flex: "1.2", padding: "12px 24px", borderRight: "1px solid #EBEBEB", cursor: "pointer" }}
            onClick={() => setShowDest(true)}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#222222", marginBottom: "2px" }}>Where</div>
            <input
              type="text"
              placeholder="Search destinations"
              value={where}
              onChange={e => { setWhere(e.target.value); setShowDest(true); }}
              onFocus={() => setShowDest(true)}
              style={{
                background: "none", border: "none", outline: "none",
                fontSize: "14px", color: where ? "#222" : "#717171",
                width: "100%", padding: 0, cursor: "pointer",
              }}
            />
          </div>

          {/* When */}
          <div
            style={{ flex: 1, padding: "12px 20px", borderRight: "1px solid #EBEBEB", cursor: "pointer", position: "relative" }}
            onClick={() => {
              const inp = document.getElementById("airbnb-checkin") as HTMLInputElement;
              if (inp) inp.showPicker?.();
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#222222", marginBottom: "2px" }}>When</div>
            <div style={{ fontSize: "14px", color: "#717171", pointerEvents: "none" }}>
              {checkIn && checkOut
                ? `${new Date(checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} – ${new Date(checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`
                : checkIn
                ? new Date(checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                : "Add dates"}
            </div>
            <input
              id="airbnb-checkin"
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", top: 0, left: 0, pointerEvents: "none" }}
            />
            {checkIn && (
              <input
                id="airbnb-checkout"
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                min={checkIn}
                style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", top: 0, left: 0, pointerEvents: "none" }}
              />
            )}
          </div>

          {/* Who / Type */}
          <div style={{ flex: 1, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#222222", marginBottom: "2px" }}>{thirdLabel}</div>
              <div style={{ fontSize: "14px", color: "#717171" }}>{thirdPlaceholder}</div>
            </div>
            {/* Search button */}
            <button
              onClick={handleSearch}
              style={{
                background: "#FF385C",
                border: "none", borderRadius: "50%",
                width: "48px", height: "48px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#e61e4d")}
              onMouseLeave={e => (e.currentTarget.style.background = "#FF385C")}
            >
              <Search size={18} color="white" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Destination suggestions */}
        {showDest && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setShowDest(false)} />
            <div style={{
              position: "absolute", top: "calc(100% + 12px)", left: 0, right: 0,
              background: "white", borderRadius: "24px",
              boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
              padding: "24px", zIndex: 50,
            }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#222", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Popular destinations</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {POPULAR_DESTINATIONS.filter(d => !where || d.city.toLowerCase().includes(where.toLowerCase())).map(dest => (
                  <button
                    key={dest.city}
                    onClick={() => { setWhere(dest.city); setShowDest(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "12px", border: "none", background: "none",
                      borderRadius: "12px", cursor: "pointer", textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F7")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <div style={{ width: "48px", height: "48px", background: "#F0F0F0", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                      {dest.emoji}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#222" }}>{dest.city}</p>
                      <p style={{ fontSize: "12px", color: "#717171" }}>India</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
