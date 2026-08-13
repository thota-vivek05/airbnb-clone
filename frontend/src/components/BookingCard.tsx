"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Listing } from "@/lib/data";
import { getCurrentUser, saveBooking, generateId, isDateRangeAvailable, loginUser } from "@/lib/store";
import toast from "react-hot-toast";

interface BookingCardProps {
  listing: Listing;
}

export default function BookingCard({ listing }: BookingCardProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [showGuests, setShowGuests] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"checkin" | "checkout" | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const router = useRouter();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function parseDateInput(value: string) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((parseDateInput(checkOut).getTime() - parseDateInput(checkIn).getTime()) / 86400000))
      : 0;

  const subtotal = nights * listing.price;
  const cleaningFee = Math.round(listing.price * 0.15);
  const serviceFee = Math.round(subtotal * 0.14);
  const total = subtotal + cleaningFee + serviceFee;

  function handleBookingLogin(e: React.FormEvent) {
    e.preventDefault();
    const user = loginUser(authEmail, authPassword);

    if (!user) {
      toast.error("Invalid email or password. Try: alex@example.com / password123");
      return;
    }

    setAuthEmail("");
    setAuthPassword("");
    setShowAuthModal(false);
    toast.success(`Welcome back, ${user.name.split(" ")[0]}! 👋`);
  }

  function handleReserve() {
    const user = getCurrentUser();
    if (!user) {
      setShowAuthModal(true);
      toast.error("Please log in to make a booking");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (nights <= 0) {
      toast.error("Check-out must be after check-in");
      return;
    }
    if (!isDateRangeAvailable(listing, parseDateInput(checkIn), parseDateInput(checkOut))) {
      toast.error("These dates are not available. Please choose different dates.");
      return;
    }

    const booking = {
      id: generateId(),
      listingId: listing.id,
      userId: user.id,
      checkIn,
      checkOut,
      guests,
      totalPrice: total,
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
    };
    saveBooking(booking);
    router.push(`/booking-confirmation?id=${booking.id}&listingId=${listing.id}`);
  }

  const inpStyle = {
    border: "none", outline: "none", background: "none",
    fontSize: "14px", fontFamily: "inherit", color: "#222",
    cursor: "pointer", width: "100%",
  };

  const labelStyle = {
    fontSize: "10px", fontWeight: 700, textTransform: "uppercase" as const,
    letterSpacing: "0.8px", color: "#222", display: "block", marginBottom: "4px",
  };

  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;

  function formatDateDisplay(dateStr: string) {
    if (!dateStr) return "Add date";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function sameDay(dateA: string, dateB: string) {
    return dateA && dateB && dateA === dateB;
  }

  function dateToInputValue(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function handleCalendarDaySelect(dateValue: string) {
    if (calendarTarget === "checkin") {
      setCheckIn(dateValue);
      if (checkOut && dateValue >= checkOut) setCheckOut("");
      setCalendarTarget(null);
      return;
    }

    if (calendarTarget === "checkout") {
      setCheckOut(dateValue);
      setCalendarTarget(null);
    }
  }

  function buildMonthCells() {
    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const startWeekday = monthStart.getDay();
    const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
    const cells: Array<{ day: number | null; value: string | null }> = [];

    for (let i = 0; i < startWeekday; i++) {
      cells.push({ day: null, value: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const value = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, value });
    }

    while (cells.length < 42) {
      cells.push({ day: null, value: null });
    }

    return cells;
  }

  const monthCells = buildMonthCells();

  return (
    <div style={{
      border: "1px solid #DDDDDD", borderRadius: "12px",
      padding: "24px", boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
      position: "sticky", top: "100px",
    }}>
      {/* Price header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <span style={{ fontSize: "22px", fontWeight: 700 }}>{listing.currency}{listing.price.toLocaleString("en-IN")}</span>
          <span style={{ fontSize: "16px", color: "#717171" }}> / night</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px" }}>
          <Star size={14} style={{ fill: "#222", stroke: "#222" }} />
          <span style={{ fontWeight: 600 }}>{listing.rating}</span>
          <span style={{ color: "#717171" }}>· {listing.reviewCount} reviews</span>
        </div>
      </div>

      {/* Date + guests inputs — exact Airbnb border box */}
      <div style={{ border: "1px solid #B0B0B0", borderRadius: "8px", overflow: "visible", marginBottom: "12px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ position: "relative", borderRight: "1px solid #B0B0B0" }}>
            <button
              type="button"
              aria-label="Select check-in date"
              style={{
                width: "100%",
                padding: "12px 14px",
                cursor: "pointer",
                background: "white",
                textAlign: "left",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
                borderRight: "none",
              }}
              onClick={() => {
                setCalendarTarget(calendarTarget === "checkin" ? null : "checkin");
                setShowGuests(false);
              }}
            >
            <label style={{ ...labelStyle, cursor: "pointer", display: "block" }}>Check-in</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={16} color="#717171" />
              <span style={{ fontSize: "14px", color: checkIn ? "#222" : "#717171" }}>
                {formatDateDisplay(checkIn)}
              </span>
            </div>
            </button>

            {calendarTarget === "checkin" && (
              <div style={{
                position: isSmallScreen ? "fixed" : "absolute",
                top: isSmallScreen ? "50%" : "calc(100% + 10px)",
                left: isSmallScreen ? "50%" : "0",
                transform: isSmallScreen ? "translate(-50%, -50%)" : "none",
                width: isSmallScreen ? "min(330px, calc(100vw - 24px))" : "320px",
                zIndex: 80,
                background: "white",
                border: "1px solid #E6E6E6",
                borderRadius: "18px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                padding: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #DDDDDD", background: "white", cursor: "pointer" }}
                  >
                    ←
                  </button>
                  <strong style={{ fontSize: "15px", color: "#222" }}>
                    {new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #DDDDDD", background: "white", cursor: "pointer" }}
                  >
                    →
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "6px", marginBottom: "8px" }}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#717171", padding: "6px 0" }}>{day}</div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "6px" }}>
                  {monthCells.map((cell, index) => {
                    if (!cell.day || !cell.value) {
                      return <div key={`empty-${index}`} style={{ height: "36px" }} />;
                    }

                    const value = cell.value;
                    const isPast = value < todayStr;
                    const isSelected = sameDay(value, checkIn);
                    const isCheckoutDate = sameDay(value, checkOut);
                    const isBetween = !!checkIn && !!checkOut && value > checkIn && value < checkOut;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => !isPast && handleCalendarDaySelect(value)}
                        disabled={isPast}
                        style={{
                          height: "36px",
                          borderRadius: "50%",
                          border: isSelected || isCheckoutDate ? "1px solid #FF385C" : "1px solid transparent",
                          background: isSelected || isCheckoutDate ? "#FF385C" : isBetween ? "#FEE4EA" : "transparent",
                          color: isPast ? "#D0D0D0" : isSelected || isCheckoutDate ? "white" : "#222",
                          fontWeight: isSelected || isCheckoutDate ? 700 : 500,
                          cursor: isPast ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="Select check-out date"
              style={{
                width: "100%",
                padding: "12px 14px",
                cursor: "pointer",
                background: "white",
                textAlign: "left",
                borderTop: "none",
                borderBottom: "none",
                borderRight: "none",
                borderLeft: "none",
              }}
              onClick={() => {
                setCalendarTarget(calendarTarget === "checkout" ? null : "checkout");
                setShowGuests(false);
              }}
            >
            <label style={{ ...labelStyle, cursor: "pointer", display: "block" }}>Checkout</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={16} color="#717171" />
              <span style={{ fontSize: "14px", color: checkOut ? "#222" : "#717171" }}>
                {formatDateDisplay(checkOut)}
              </span>
            </div>
            </button>

            {calendarTarget === "checkout" && (
              <div style={{
                position: isSmallScreen ? "fixed" : "absolute",
                top: isSmallScreen ? "50%" : "calc(100% + 10px)",
                left: isSmallScreen ? "50%" : "0",
                transform: isSmallScreen ? "translate(-50%, -50%)" : "none",
                width: isSmallScreen ? "min(330px, calc(100vw - 24px))" : "320px",
                zIndex: 80,
                background: "white",
                border: "1px solid #E6E6E6",
                borderRadius: "18px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                padding: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #DDDDDD", background: "white", cursor: "pointer" }}
                  >
                    ←
                  </button>
                  <strong style={{ fontSize: "15px", color: "#222" }}>
                    {new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #DDDDDD", background: "white", cursor: "pointer" }}
                  >
                    →
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "6px", marginBottom: "8px" }}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#717171", padding: "6px 0" }}>{day}</div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "6px" }}>
                  {monthCells.map((cell, index) => {
                    if (!cell.day || !cell.value) {
                      return <div key={`checkout-empty-${index}`} style={{ height: "36px" }} />;
                    }

                    const value = cell.value;
                    const minDate = checkIn || todayStr;
                    const isPast = value < minDate;
                    const isSelected = sameDay(value, checkOut);
                    const isCheckInDate = sameDay(value, checkIn);
                    const isBetween = !!checkIn && !!checkOut && value > checkIn && value < checkOut;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => !isPast && handleCalendarDaySelect(value)}
                        disabled={isPast}
                        style={{
                          height: "36px",
                          borderRadius: "50%",
                          border: isSelected || isCheckInDate ? "1px solid #FF385C" : "1px solid transparent",
                          background: isSelected ? "#FF385C" : isBetween ? "#FEE4EA" : "transparent",
                          color: isPast ? "#D0D0D0" : isSelected || isCheckInDate ? "white" : "#222",
                          fontWeight: isSelected || isCheckInDate ? 700 : 500,
                          cursor: isPast ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guests row */}
        <div style={{ borderTop: "1px solid #B0B0B0", position: "relative" }}>
          <button
            type="button"
            aria-label="Select guests"
            style={{
              width: "100%",
              padding: "12px 14px",
              cursor: "pointer",
              background: "white",
              textAlign: "left",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: "none",
              borderTop: "none",
            }}
            onClick={(e) => { e.stopPropagation(); setShowGuests(!showGuests); setCalendarTarget(null); }}
          >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <label style={{ ...labelStyle, cursor: "pointer" }}>Guests</label>
              <p style={{ fontSize: "14px" }}>{guests} guest{guests > 1 ? "s" : ""}</p>
            </div>
            {showGuests ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          </button>

          {showGuests && (
            <div
              style={{ marginTop: "12px", padding: "0 14px 12px", borderTop: "1px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              onClick={e => e.stopPropagation()}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px" }}>Adults</p>
                <p style={{ fontSize: "12px", color: "#717171" }}>Age 13+</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                  style={{
                    width: "32px", height: "32px", border: "1px solid #717171", borderRadius: "50%",
                    background: "white", cursor: guests <= 1 ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", color: guests <= 1 ? "#DDDDDD" : "#222",
                  }}
                >−</button>
                <span style={{ fontSize: "14px", minWidth: "16px", textAlign: "center" }}>{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(listing.maxGuests, guests + 1))}
                  disabled={guests >= listing.maxGuests}
                  style={{
                    width: "32px", height: "32px", border: "1px solid #717171", borderRadius: "50%",
                    background: "white", cursor: guests >= listing.maxGuests ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", color: guests >= listing.maxGuests ? "#DDDDDD" : "#222",
                  }}
                >+</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reserve button */}
      <button
        id="booking-card-reserve"
        type="button"
        onClick={handleReserve}
        className="btn-primary"
        style={{ width: "100%", borderRadius: "8px", padding: "14px", fontSize: "16px", marginBottom: "12px" }}
      >
        Reserve
      </button>
      <p style={{ textAlign: "center", fontSize: "14px", color: "#717171", marginBottom: "20px" }}>
        You won&apos;t be charged yet
      </p>

      {showAuthModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "480px", padding: "18px 22px 22px", boxShadow: "0 24px 60px rgba(0,0,0,0.22)", border: "1px solid rgba(0,0,0,0.04)" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px", paddingBottom: "12px", borderBottom: "1px solid #EBEBEB" }}>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#222" }}
              >
                ×
              </button>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Log in or sign up</h3>
              <div style={{ width: "32px" }} />
            </div>

            <h4 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 18px", letterSpacing: "-0.05em" }}>Welcome to Airbnb</h4>

            <form onSubmit={handleBookingLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#222", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  style={{ border: "1px solid #DDDDDD", borderRadius: "12px", padding: "14px 16px", fontSize: "15px", outline: "none", background: "#fff", color: "#222" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#222", textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  required
                  style={{ border: "1px solid #DDDDDD", borderRadius: "12px", padding: "14px 16px", fontSize: "15px", outline: "none", background: "#fff", color: "#222" }}
                />
              </div>

              <button
                type="submit"
                style={{ background: "linear-gradient(90deg, #FF385C 0%, #E31C5F 100%)", color: "white", border: "none", borderRadius: "12px", padding: "14px 18px", fontSize: "16px", fontWeight: 700, cursor: "pointer", marginTop: "6px", boxShadow: "0 4px 12px rgba(255,56,92,0.28)" }}
              >
                Log in
              </button>
            </form>

            <div style={{ marginTop: "18px", background: "#F7F7F7", borderRadius: "12px", padding: "12px 14px", fontSize: "12px", color: "#717171", border: "1px solid #EBEBEB" }}>
              <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#222" }}>Demo account</p>
              <p style={{ margin: 0 }}>alex@example.com / password123</p>
            </div>
          </div>
        </div>
      )}

      {/* Price breakdown */}
      {nights > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textDecoration: "underline" }}>
              {listing.currency}{listing.price.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>{listing.currency}{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textDecoration: "underline" }}>Cleaning fee</span>
            <span>{listing.currency}{cleaningFee.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textDecoration: "underline" }}>Airbnb service fee</span>
            <span>{listing.currency}{serviceFee.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ height: "1px", background: "#EBEBEB", margin: "4px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "15px" }}>
            <span>Total before taxes</span>
            <span>{listing.currency}{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
