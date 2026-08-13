"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar, { NavTab } from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import FilterModal from "@/components/FilterModal";
import Footer from "@/components/Footer";
import { getAllListings } from "@/lib/store";
import { Listing, CATEGORIES } from "@/lib/data";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

function HomesContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [category, setCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [propertyType, setPropertyType] = useState("all");
  const [activeTab] = useState<NavTab>("homes");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;
  const searchParams = useSearchParams();

  useEffect(() => {
    import("@/lib/api").then(api => {
      api.fetchListings().then(setListings).catch(console.error);
    });
  }, []);

  useEffect(() => {
    let result = [...listings];
    if (category !== "all") result = result.filter(l => l.category === category);
    const where = searchParams.get("where");
    if (where) result = result.filter(l =>
      l.city.toLowerCase().includes(where.toLowerCase()) ||
      l.location.toLowerCase().includes(where.toLowerCase())
    );
    result = result.filter(l => l.price >= priceRange[0] && l.price <= priceRange[1]);
    if (propertyType !== "all") result = result.filter(l => l.type.toLowerCase().includes(propertyType));
    setFiltered(result);
    setPage(1);
  }, [listings, category, searchParams, priceRange, propertyType]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginatedListings = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const showingEnd = Math.min(page * PER_PAGE, filtered.length);

  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <Navbar activeTab={activeTab} onTabChange={() => {}} />

      {/* Category bar */}
      <div style={{ borderBottom: "1px solid #EBEBEB", position: "sticky", top: "72px", background: "white", zIndex: 50 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ flex: 1, overflowX: "auto", display: "flex", scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`category-tab ${category === cat.id ? "active" : ""}`}
              >
                <span className="icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
          <div style={{ borderLeft: "1px solid #EBEBEB", paddingLeft: "16px", flexShrink: 0 }}>
            <button onClick={() => setShowFilter(true)} className="filter-btn">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <p style={{ fontSize: "14px", color: "#717171", marginBottom: "24px" }}>
          {filtered.length === 0 ? "0 places" : `${showingStart}–${showingEnd} of ${filtered.length} place${filtered.length !== 1 ? "s" : ""}`} to stay
          {searchParams.get("where") ? ` in ${searchParams.get("where")}` : ""}
        </p>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏠</div>
            <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>No places found</h2>
            <p style={{ color: "#717171", marginBottom: "24px" }}>Try adjusting your filters</p>
            <button onClick={() => { setCategory("all"); setPriceRange([0, 20000]); setPropertyType("all"); }}
              className="btn-primary" style={{ borderRadius: "8px", padding: "12px 24px" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="listings-grid">
              {paginatedListings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", marginTop: "48px", paddingTop: "24px",
                borderTop: "1px solid #EBEBEB",
              }}>
                <button
                  disabled={page <= 1}
                  onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    border: "1px solid #222222", background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: page <= 1 ? "not-allowed" : "pointer",
                    opacity: page <= 1 ? 0.3 : 1,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (page > 1) e.currentTarget.style.background = "#F7F7F7"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      border: "none",
                      background: p === page ? "#222222" : "transparent",
                      color: p === page ? "white" : "#222222",
                      fontWeight: 600, fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (p !== page) e.currentTarget.style.background = "#F7F7F7"; }}
                    onMouseLeave={e => { if (p !== page) e.currentTarget.style.background = "transparent"; }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={page >= totalPages}
                  onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    border: "1px solid #222222", background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                    opacity: page >= totalPages ? 0.3 : 1,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (page < totalPages) e.currentTarget.style.background = "#F7F7F7"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      {showFilter && (
        <FilterModal priceRange={priceRange} propertyType={propertyType}
          onApply={(r, t) => { setPriceRange(r); setPropertyType(t); setShowFilter(false); }}
          onClose={() => setShowFilter(false)} />
      )}
    </div>
  );
}

export default function HomesPage() {
  return (
    <Suspense>
      <HomesContent />
    </Suspense>
  );
}
