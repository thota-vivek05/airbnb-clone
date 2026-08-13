"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ImageIcon, ChevronLeft, MapPin, DollarSign, Home, Image as ImageIcon2, Star, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/store";
import { createListingAPI } from "@/lib/api";
import { CATEGORIES } from "@/lib/data";
import toast from "react-hot-toast";

const AMENITIES_LIST = ["WiFi", "Air conditioning", "Kitchen", "Free parking", "TV", "Washing machine", "BBQ grill", "Pool", "Gym", "Beach access", "Sea view", "Mountain view", "Fireplace", "Breakfast included", "Rooftop terrace", "Elevator", "Outdoor shower", "Pet friendly"];

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    country: "India",
    type: "Entire apartment",
    price: "",
    maxGuests: "4",
    bedrooms: "2",
    bathrooms: "1",
    beds: "2",
    category: "trending",
    amenities: [] as string[],
    images: [""],
  });

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || !u.isHost) { router.push("/"); return; }
  }, [router]);

  function toggleAmenity(amenity: string) {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  function addImageField() {
    setForm(prev => ({ ...prev, images: [...prev.images, ""] }));
  }

  function updateImage(idx: number, value: string) {
    setForm(prev => {
      const imgs = [...prev.images];
      imgs[idx] = value;
      return { ...prev, images: imgs };
    });
  }

  function removeImage(idx: number) {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const u = getCurrentUser();
    if (!u) return;

    if (!form.title || !form.description || !form.location || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const validImages = form.images.filter(img => img.trim() !== "");
    if (validImages.length === 0) {
      toast.error("Please add at least one photo URL");
      return;
    }

    setLoading(true);
    try {
      await createListingAPI({
        title: form.title,
        description: form.description,
        location: form.location,
        city: form.city || form.location.split(",")[0].trim(),
        country: form.country,
        type: form.type,
        price: parseInt(form.price),
        images: validImages,
        amenities: form.amenities,
        maxGuests: parseInt(form.maxGuests),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        beds: parseInt(form.beds),
        category: form.category,
        hostId: u.id,
      });
      toast.success("Listing created successfully!");
      router.push("/host/dashboard");
    } catch {
      toast.error("Failed to create listing. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7" }}>
      <Navbar />
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#717171" }}>Host center</p>
            <h1 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-0.02em", color: "#222222", marginTop: "4px" }}>Create a new listing</h1>
            <p style={{ fontSize: "16px", color: "#717171", marginTop: "4px" }}>Showcase your home and start accepting bookings faster.</p>
          </div>
          <button 
            onClick={() => router.back()} 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #DDDDDD",
              background: "white",
              fontSize: "14px",
              fontWeight: 500,
              color: "#222222",
              cursor: "pointer",
              transition: "all 0.15s",
              width: "fit-content",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.background = "#F7F7F7"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.background = "white"; }}
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Basic Information */}
          <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ display: "flex", width: "48px", height: "48px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "#F7F7F7", flexShrink: 0 }}>
                <Home size={20} style={{ color: "#222222" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#222222" }}>Basic Information</h2>
                <p style={{ fontSize: "14px", color: "#717171" }}>The essentials guests need to know first.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Listing Title *</label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} 
                  placeholder="e.g. Cozy beachfront villa with pool" 
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                    fontSize: "16px",
                    color: "#222222",
                    transition: "all 0.15s",
                    outline: "none",
                    background: "white",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Description *</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} 
                  placeholder="Describe your space, neighborhood, and what makes it special..." 
                  rows={5} 
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                    fontSize: "16px",
                    color: "#222222",
                    resize: "vertical",
                    transition: "all 0.15s",
                    outline: "none",
                    fontFamily: "inherit",
                    background: "white",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                  required 
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>
                    <MapPin size={16} /> Location *
                  </label>
                  <input 
                    type="text" 
                    value={form.location} 
                    onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))} 
                    placeholder="e.g. Calangute, Goa" 
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "1px solid #DDDDDD",
                      fontSize: "16px",
                      color: "#222222",
                      transition: "all 0.15s",
                      outline: "none",
                      background: "white",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>City</label>
                  <input 
                    type="text" 
                    value={form.city} 
                    onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))} 
                    placeholder="e.g. Goa" 
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "1px solid #DDDDDD",
                      fontSize: "16px",
                      color: "#222222",
                      transition: "all 0.15s",
                      outline: "none",
                      background: "white",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Property type</label>
                  <select 
                    value={form.type} 
                    onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))} 
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "1px solid #DDDDDD",
                      fontSize: "16px",
                      color: "#222222",
                      background: "white",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      outline: "none",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {["Entire apartment", "Entire villa", "Entire home", "Private room", "Shared room", "Cabin", "Treehouse", "Houseboat", "Tent", "Penthouse", "Cottage", "Eco lodge"].map(t => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Category</label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} 
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "1px solid #DDDDDD",
                      fontSize: "16px",
                      color: "#222222",
                      background: "white",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      outline: "none",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {CATEGORIES.slice(1).map(c => (<option key={c.id} value={c.id}>{c.icon} {c.label}</option>))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ display: "flex", width: "48px", height: "48px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "#F7F7F7", flexShrink: 0 }}>
                <DollarSign size={20} style={{ color: "#222222" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#222222" }}>Pricing & Capacity</h2>
                <p style={{ fontSize: "14px", color: "#717171" }}>Set guest expectations and nightly rate.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Price per night (₹) *</label>
                <input 
                  type="number" 
                  value={form.price} 
                  onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} 
                  placeholder="2000" 
                  min="100" 
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                    fontSize: "16px",
                    color: "#222222",
                    transition: "all 0.15s",
                    outline: "none",
                    background: "white",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Max guests</label>
                <input 
                  type="number" 
                  value={form.maxGuests} 
                  onChange={e => setForm(prev => ({ ...prev, maxGuests: e.target.value }))} 
                  min="1" 
                  max="30" 
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                    fontSize: "16px",
                    color: "#222222",
                    transition: "all 0.15s",
                    outline: "none",
                    background: "white",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Bedrooms</label>
                <input 
                  type="number" 
                  value={form.bedrooms} 
                  onChange={e => setForm(prev => ({ ...prev, bedrooms: e.target.value }))} 
                  min="0" 
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                    fontSize: "16px",
                    color: "#222222",
                    transition: "all 0.15s",
                    outline: "none",
                    background: "white",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Beds</label>
                <input 
                  type="number" 
                  value={form.beds} 
                  onChange={e => setForm(prev => ({ ...prev, beds: e.target.value }))} 
                  min="1" 
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                    fontSize: "16px",
                    color: "#222222",
                    transition: "all 0.15s",
                    outline: "none",
                    background: "white",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Bathrooms</label>
                <input 
                  type="number" 
                  value={form.bathrooms} 
                  onChange={e => setForm(prev => ({ ...prev, bathrooms: e.target.value }))} 
                  min="1" 
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #DDDDDD",
                    fontSize: "16px",
                    color: "#222222",
                    transition: "all 0.15s",
                    outline: "none",
                    background: "white",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ display: "flex", width: "48px", height: "48px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "#F7F7F7", flexShrink: 0 }}>
                <ImageIcon2 size={20} style={{ color: "#222222" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#222222" }}>Photos</h2>
                <p style={{ fontSize: "14px", color: "#717171" }}>Add the best visuals of your stay.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {form.images.map((img, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px", borderRadius: "8px", border: "1px solid #DDDDDD", background: "#FAFAFA", padding: "12px 16px" }}>
                  <div style={{ display: "flex", width: "72px", height: "72px", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: "8px", border: "1px solid #DDDDDD", background: "white", flexShrink: 0 }}>
                    {img ? (<img src={img} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />) : (<ImageIcon size={24} style={{ color: "#CCCCCC" }} />)}
                  </div>
                  <input 
                    type="url" 
                    value={img} 
                    onChange={e => updateImage(idx, e.target.value)} 
                    placeholder="Paste image URL (https://...)" 
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      background: "white",
                      border: "1px solid #DDDDDD",
                      borderRadius: "6px",
                      fontSize: "14px",
                      color: "#222222",
                      outline: "none",
                      transition: "all 0.15s",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#222222"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#DDDDDD"; }}
                  />
                  {form.images.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)} 
                      style={{
                        padding: "8px",
                        borderRadius: "6px",
                        border: "none",
                        background: "transparent",
                        color: "#E11900",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button 
              type="button" 
              onClick={addImageField} 
              style={{
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "1px dashed #DDDDDD",
                background: "white",
                fontSize: "14px",
                fontWeight: 500,
                color: "#222222",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.background = "#FAFAFA"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.background = "white"; }}
            >
              <Plus size={18} /> Add another photo
            </button>
          </div>

          {/* Amenities */}
          <div style={{ borderRadius: "12px", border: "1px solid #DDDDDD", background: "white", padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ display: "flex", width: "48px", height: "48px", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "#F7F7F7", flexShrink: 0 }}>
                <Star size={20} style={{ color: "#222222" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#222222" }}>Amenities</h2>
                <p style={{ fontSize: "14px", color: "#717171" }}>Highlight what makes your place stand out.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {AMENITIES_LIST.map(amenity => {
                const isSelected = form.amenities.includes(amenity);
                return (
                  <label 
                    key={amenity} 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: `2px solid ${isSelected ? "#222222" : "#DDDDDD"}`,
                      background: isSelected ? "#F7F7F7" : "white",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      userSelect: "none",
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "#CCCCCC"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "#DDDDDD"; }}
                  >
                    <div style={{
                      display: "flex",
                      width: "20px",
                      height: "20px",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      border: `2px solid ${isSelected ? "#222222" : "#DDDDDD"}`,
                      background: isSelected ? "#222222" : "white",
                      transition: "all 0.15s",
                      flexShrink: 0,
                    }}>
                      {isSelected && (
                        <svg style={{ width: "12px", height: "12px", color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: isSelected ? "#222222" : "#717171" }}>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", borderTop: "1px solid #DDDDDD", paddingTop: "32px", marginTop: "8px" }}>
            <button 
              type="button" 
              onClick={() => router.back()} 
              style={{
                padding: "14px 32px",
                borderRadius: "8px",
                border: "1px solid #DDDDDD",
                background: "white",
                fontSize: "16px",
                fontWeight: 600,
                color: "#222222",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.background = "#F7F7F7"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDDDDD"; e.currentTarget.style.background = "white"; }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px 40px",
                borderRadius: "8px",
                border: "none",
                background: loading ? "#CCCCCC" : "#FF385C",
                fontSize: "16px",
                fontWeight: 600,
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                minWidth: "180px",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#E31C5F"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#FF385C"; }}
            >
              {loading && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
              {loading ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (max-width: 1024px) {
            .amenities-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            .amenities-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}</style>
      </main>
      <Footer />
    </div>
  );
}