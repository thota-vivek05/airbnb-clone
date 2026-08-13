"use client";
import { useState } from "react";
import Navbar, { NavTab } from "@/components/Navbar";
import HomeSearchBar from "@/components/SearchBar";
import HorizontalSection from "@/components/HorizontalSection";
import Footer from "@/components/Footer";
import InspirationSection from "@/components/InspirationSection";

// ─────────────── HOMES DATA ───────────────
const BENGALURU_HOMES = [
  { id: "h-blr-1", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop", title: "Home in Bommanahalli", price: "₹7,302 for 2 nights", rating: 4.91, badge: "Guest favourite", href: "/listings/1", type: "listing" as const },
  { id: "h-blr-2", image: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&auto=format&fit=crop", title: "Flat in Seshadripuram", price: "₹10,000 for 2 nights", rating: 4.92, badge: "Guest favourite", href: "/listings/3", type: "listing" as const },
  { id: "h-blr-3", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop", title: "Flat in HSR Layout", price: "₹9,200 for 2 nights", rating: 4.83, badge: "Guest favourite", href: "/listings/3", type: "listing" as const },
  { id: "h-blr-4", image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&auto=format&fit=crop", title: "Bungalow in Bengaluru", price: "₹32,183 for 2 nights", rating: 5.0, badge: "Guest favourite", href: "/listings/9", type: "listing" as const },
  { id: "h-blr-5", image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&auto=format&fit=crop", title: "Flat in Bommanahalli", price: "₹5,700 for 2 nights", rating: 4.96, badge: "Guest favourite", href: "/listings/3", type: "listing" as const },
  { id: "h-blr-6", image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&auto=format&fit=crop", title: "Home in HBR Layout", price: "₹11,239 for 2 nights", rating: 5.0, badge: "Guest favourite", href: "/listings/9", type: "listing" as const },
  { id: "h-blr-7", image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&auto=format&fit=crop", title: "Flat in Bommanahalli", price: "₹8,398 for 2 nights", rating: 4.95, badge: "Guest favourite", href: "/listings/3", type: "listing" as const },
  { id: "h-blr-8", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop", title: "Studio in Koramangala", price: "₹6,500 for 2 nights", rating: 4.88, badge: "Guest favourite", href: "/listings/3", type: "listing" as const },
];

const GOA_HOMES = [
  { id: "h-goa-1", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&auto=format&fit=crop", title: "Villa in Assagao", price: "₹33,572 for 2 nights", rating: 5.0, href: "/listings/1", type: "listing" as const },
  { id: "h-goa-2", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&auto=format&fit=crop", title: "Apartment in Vagator", price: "₹14,000 for 2 nights", rating: 4.92, badge: "Guest favourite", href: "/listings/2", type: "listing" as const },
  { id: "h-goa-3", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop", title: "Villa in Anjuna", price: "₹20,462 for 2 nights", rating: 4.97, badge: "Guest favourite", href: "/listings/1", type: "listing" as const },
  { id: "h-goa-4", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&auto=format&fit=crop", title: "Home in Baga", price: "₹21,420 for 2 nights", rating: 4.93, href: "/listings/1", type: "listing" as const },
  { id: "h-goa-5", image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=400&auto=format&fit=crop", title: "Villa in Assagao", price: "₹32,000 for 2 nights", rating: 4.97, badge: "Guest favourite", href: "/listings/1", type: "listing" as const },
  { id: "h-goa-6", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop", title: "Flat in Nerul", price: "₹25,000 for 2 nights", rating: 5.0, href: "/listings/1", type: "listing" as const },
  { id: "h-goa-7", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&auto=format&fit=crop", title: "Flat in Calangute", price: "₹14,178 for 2 nights", rating: 4.84, href: "/listings/1", type: "listing" as const },
  { id: "h-goa-8", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop", title: "House in Candolim", price: "₹18,500 for 2 nights", rating: 4.90, badge: "Guest favourite", href: "/listings/1", type: "listing" as const },
];

const MUMBAI_HOMES = [
  { id: "h-mum-1", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop", title: "Flat in Bandra", price: "₹5,700 for 2 nights", rating: 4.96, badge: "Guest favourite", href: "/listings/3", type: "listing" as const },
  { id: "h-mum-2", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&auto=format&fit=crop", title: "Studio in Juhu", price: "₹8,200 for 2 nights", rating: 4.89, badge: "Guest favourite", href: "/listings/3", type: "listing" as const },
  { id: "h-mum-3", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop", title: "Apartment in Worli", price: "₹12,400 for 2 nights", rating: 4.94, href: "/listings/3", type: "listing" as const },
  { id: "h-mum-4", image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&auto=format&fit=crop", title: "Penthouse in Lower Parel", price: "₹19,800 for 2 nights", rating: 4.97, href: "/listings/9", type: "listing" as const },
  { id: "h-mum-5", image: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&auto=format&fit=crop", title: "Flat in Powai", price: "₹6,300 for 2 nights", rating: 4.85, badge: "Guest favourite", href: "/listings/3", type: "listing" as const },
  { id: "h-mum-6", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop", title: "Home in Andheri", price: "₹7,100 for 2 nights", rating: 4.91, href: "/listings/3", type: "listing" as const },
  { id: "h-mum-7", image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&auto=format&fit=crop", title: "Villa in Alibaug", price: "₹24,000 for 2 nights", rating: 4.98, badge: "Guest favourite", href: "/listings/1", type: "listing" as const },
];

// ─────────────── EXPERIENCES DATA ───────────────
const AIRBNB_ORIGINALS = [
  { id: "exp-1", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&auto=format&fit=crop", title: "Carve marble with a third-generation sculptor", subtitle: "Athens, Greece", price: "From ₹6,609 / guest", rating: 5.0, badge: "Original", href: "/experiences/1", type: "experience" as const },
  { id: "exp-2", image: "https://images.unsplash.com/photo-1564839489309-d0b5f1dfc4b2?w=400&auto=format&fit=crop", title: "Art Walking Tour in San Miguel de Allende", subtitle: "San Miguel, Mexico", price: "From ₹3,744 / guest", badge: "Original", href: "/experiences/2", type: "experience" as const },
  { id: "exp-3", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop", title: "Savor Premium Matcha in a tea ceremony in Shibuya", subtitle: "Shibuya, Japan", price: "From ₹3,595 / guest", rating: 5.0, badge: "Original", href: "/experiences/3", type: "experience" as const },
  { id: "exp-4", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&auto=format&fit=crop", title: "Kayak to Hudson-Athens lighthouse at golden hour", subtitle: "Athens, United States", price: "From ₹8,588 / guest", rating: 5.0, badge: "Original", href: "/experiences/4", type: "experience" as const },
  { id: "exp-5", image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop", title: "Learn pot painting with natural cochinilla dye", subtitle: "Los Angeles, United States", price: "From ₹4,771 / guest", rating: 4.98, badge: "Original", href: "/experiences/5", type: "experience" as const },
  { id: "exp-6", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop", title: "Learn mahjong and sip tea in Brooklyn", subtitle: "Brooklyn, United States", price: "From ₹5,725 / guest", rating: 5.0, badge: "Original", href: "/experiences/6", type: "experience" as const },
  { id: "exp-7", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop", title: "Discover Melbourne's acclaimed coffee culture", subtitle: "Melbourne, Australia", price: "From ₹5,729 / guest", rating: 5.0, badge: "Original", href: "/experiences/7", type: "experience" as const },
];

const PARIS_EXPERIENCES = [
  { id: "px-1", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&auto=format&fit=crop", title: "Seine River Cruise at sunset", subtitle: "Paris, France", price: "From ₹3,500 / guest", rating: 4.97, badge: "Popular", href: "/experiences/8", type: "experience" as const },
  { id: "px-2", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop", title: "Eiffel Tower private night tour", subtitle: "Paris, France", price: "From ₹8,200 / guest", rating: 4.99, badge: "Popular", href: "/experiences/9", type: "experience" as const },
  { id: "px-3", image: "https://images.unsplash.com/photo-1550159930-40066082a4fc?w=400&auto=format&fit=crop", title: "French pastry baking class", subtitle: "Paris, France", price: "From ₹4,100 / guest", rating: 5.0, badge: "Popular", href: "/experiences/10", type: "experience" as const },
  { id: "px-4", image: "https://images.unsplash.com/photo-1473181488821-2d23949a045a?w=400&auto=format&fit=crop", title: "Louvre skip-the-line guided tour", subtitle: "Paris, France", price: "From ₹5,600 / guest", rating: 4.96, badge: "Popular", href: "/experiences/11", type: "experience" as const },
  { id: "px-5", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop", title: "Wine & Cheese tasting in Montmartre", subtitle: "Paris, France", price: "From ₹4,800 / guest", rating: 4.95, badge: "Popular", href: "/experiences/12", type: "experience" as const },
  { id: "px-6", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop", title: "Private dinner at the top of Paris", subtitle: "Paris, France", price: "From ₹15,000 / guest", rating: 5.0, badge: "Popular", href: "/experiences/13", type: "experience" as const },
  { id: "px-7", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop", title: "French perfume creation workshop", subtitle: "Paris, France", price: "From ₹6,200 / guest", rating: 4.98, badge: "Popular", href: "/experiences/14", type: "experience" as const },
];

// ─────────────── SERVICES DATA ───────────────
const LA_SERVICES = [
  { id: "svc-1", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop", title: "LA Hair & Makeup by Ashanta Artistry", price: "From ₹19,083 / guest", rating: 5.0, href: "/services/1", type: "service" as const },
  { id: "svc-2", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop", title: "For the love of Soccer LA Game Day Experiences", price: "From ₹9,065 / group", rating: 5.0, href: "/services/2", type: "service" as const },
  { id: "svc-3", image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&auto=format&fit=crop", title: "Highly-curated men's haircuts MarVista by Saints", price: "From ₹6,679 / guest", rating: 5.0, href: "/services/3", type: "service" as const },
  { id: "svc-4", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop", title: "Los Angeles Editorial Lifestyle Portraits & Events", price: "From ₹19,083 / group", rating: 5.0, href: "/services/4", type: "service" as const },
  { id: "svc-5", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&auto=format&fit=crop", title: "Scenic lifestyle photos by Emily", price: "From ₹12,404 / guest", rating: 4.96, href: "/services/5", type: "service" as const },
  { id: "svc-6", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop", title: "Thai Bodywork in Old Town Pasadena", price: "From ₹9,351 / guest", rating: 5.0, href: "/services/6", type: "service" as const },
  { id: "svc-7", image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=400&auto=format&fit=crop", title: "Authentic Photography by Alexa Jade", price: "From ₹23,854 / group", rating: 5.0, href: "/services/7", type: "service" as const },
];

const LONDON_SERVICES = [
  { id: "svc-8", image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&auto=format&fit=crop", title: "Private Restorative Yoga Sanctuary", price: "From ₹2,965 / guest", rating: 5.0, href: "/services/8", type: "service" as const },
  { id: "svc-9", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop", title: "Results-oriented fitness by Amram", price: "From ₹5,801 / guest", href: "/services/9", type: "service" as const },
  { id: "svc-10", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop", title: "Magical Hands Massage in top location - Bond Street", price: "From ₹5,801 / guest", rating: 4.95, badge: "Popular", href: "/services/10", type: "service" as const },
  { id: "svc-11", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop", title: "Got Your Back London, Host Advisory Board massage", price: "From ₹2,063 / guest", rating: 5.0, href: "/services/11", type: "service" as const },
  { id: "svc-12", image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=400&auto=format&fit=crop", title: "Soulful London Private Photoshoot", price: "From ₹6,445 / guest", rating: 4.96, href: "/services/12", type: "service" as const },
  { id: "svc-13", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop", title: "Seasonal gourmet menus by Chef Anna Jane", price: "From ₹15,469 / guest", rating: 5.0, href: "/services/13", type: "service" as const },
];

// ─────────────── TAB CONTENT ───────────────
function HomesContent() {
  return (
    <>
      <HorizontalSection title="Popular homes in Bengaluru" seeAllHref="/homes?where=Bengaluru" cards={BENGALURU_HOMES} />
      <HorizontalSection title="Available next month in North Goa" seeAllHref="/homes?where=Goa" cards={GOA_HOMES} />
      <HorizontalSection title="Stay in Mumbai" seeAllHref="/homes?where=Mumbai" cards={MUMBAI_HOMES} />
    </>
  );
}

function ExperiencesContent() {
  return (
    <>
      <div style={{ marginBottom: "8px" }}>
        <p style={{ fontSize: "14px", color: "#717171" }}>Hosted by the world&apos;s most interesting people</p>
      </div>
      <HorizontalSection title="Airbnb Originals" seeAllHref="/experiences" cards={AIRBNB_ORIGINALS} />
      <div style={{ marginBottom: "8px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#222222" }}>Popular with travellers from your area</h2>
      </div>
      <HorizontalSection title="Experiences in Paris" seeAllHref="/experiences?city=Paris" cards={PARIS_EXPERIENCES} />
    </>
  );
}

function ServicesContent() {
  return (
    <>
      <HorizontalSection title="Services in Los Angeles" seeAllHref="/services?city=LA" cards={LA_SERVICES} />
      <HorizontalSection title="Services in London" seeAllHref="/services?city=London" cards={LONDON_SERVICES} />
    </>
  );
}

function AllContent() {
  return (
    <>
      <HorizontalSection title="Popular homes in Bengaluru" seeAllHref="/homes?where=Bengaluru" cards={BENGALURU_HOMES} />
      <HorizontalSection title="Available next month in North Goa" seeAllHref="/homes?where=Goa" cards={GOA_HOMES} />
      <HorizontalSection title="Airbnb Originals" seeAllHref="/experiences" cards={AIRBNB_ORIGINALS} />
      <HorizontalSection title="Stay in Mumbai" seeAllHref="/homes?where=Mumbai" cards={MUMBAI_HOMES} />
      <HorizontalSection title="Services in Los Angeles" seeAllHref="/services?city=LA" cards={LA_SERVICES} />
      <HorizontalSection title="Experiences in Paris" seeAllHref="/experiences?city=Paris" cards={PARIS_EXPERIENCES} />
    </>
  );
}

// ─────────────── PAGE ───────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("all");

  const searchBarProps: Record<NavTab, { thirdLabel: string; thirdPlaceholder: string }> = {
    all: { thirdLabel: "Who", thirdPlaceholder: "Add guests" },
    homes: { thirdLabel: "Who", thirdPlaceholder: "Add guests" },
    experiences: { thirdLabel: "Who", thirdPlaceholder: "Add guests" },
    services: { thirdLabel: "Type of service", thirdPlaceholder: "Add service" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "white", fontFamily: "Inter, -apple-system, sans-serif" }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {activeTab === "all" && <AllContent />}
        {activeTab === "homes" && <HomesContent />}
        {activeTab === "experiences" && <ExperiencesContent />}
        {activeTab === "services" && <ServicesContent />}
      </main>

      <InspirationSection />
      <Footer />
    </div>
  );
}
