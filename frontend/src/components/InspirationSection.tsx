"use client";
import { useState } from "react";

const TABS = ["Popular", "Arts & culture", "Beach", "Mountains", "Outdoors", "Things to do"];

const DESTINATIONS: Record<string, { city: string; type: string }[]> = {
  "Popular": [
    { city: "Port Aransas", type: "Flat rentals" },
    { city: "Kauai", type: "House rentals" },
    { city: "Ocean City", type: "House rentals" },
    { city: "Brooklyn", type: "House rentals" },
    { city: "Detroit", type: "House rentals" },
    { city: "Albuquerque", type: "Apartment rentals" },
    { city: "Dallas", type: "Holiday rentals" },
    { city: "Raleigh", type: "Holiday rentals" },
    { city: "Charleston", type: "Apartment rentals" },
    { city: "Pittsburgh", type: "Flat rentals" },
    { city: "Tampa", type: "Flat rentals" },
    { city: "Wilmington", type: "House rentals" },
    { city: "Key West", type: "Holiday rentals" },
    { city: "Portland", type: "Cabin rentals" },
    { city: "Minneapolis", type: "Flat rentals" },
    { city: "Cleveland", type: "House rentals" },
    { city: "Oahu", type: "House rentals" },
  ],
  "Arts & culture": [
    { city: "Paris", type: "Apartment rentals" },
    { city: "Florence", type: "House rentals" },
    { city: "Barcelona", type: "Flat rentals" },
    { city: "Kyoto", type: "Holiday rentals" },
    { city: "Vienna", type: "Apartment rentals" },
    { city: "Prague", type: "Flat rentals" },
    { city: "Rome", type: "Apartment rentals" },
    { city: "Amsterdam", type: "House rentals" },
    { city: "Berlin", type: "Flat rentals" },
    { city: "London", type: "Apartment rentals" },
    { city: "Istanbul", type: "Holiday rentals" },
    { city: "New York", type: "Apartment rentals" },
    { city: "San Francisco", type: "House rentals" },
    { city: "Chicago", type: "Apartment rentals" },
    { city: "New Orleans", type: "House rentals" },
    { city: "Nashville", type: "House rentals" },
    { city: "Savannah", type: "Holiday rentals" },
  ],
  "Beach": [
    { city: "Goa", type: "Villa rentals" },
    { city: "Bali", type: "Villa rentals" },
    { city: "Maldives", type: "Resort rentals" },
    { city: "Phuket", type: "Villa rentals" },
    { city: "Cancún", type: "House rentals" },
    { city: "Maui", type: "Holiday rentals" },
    { city: "Kovalam", type: "Cottage rentals" },
    { city: "Pondicherry", type: "Bungalow rentals" },
    { city: "Nice", type: "Apartment rentals" },
    { city: "Santorini", type: "Villa rentals" },
    { city: "Amalfi", type: "Flat rentals" },
    { city: "Zanzibar", type: "Holiday rentals" },
    { city: "Mykonos", type: "Villa rentals" },
    { city: "Dubrovnik", type: "Apartment rentals" },
    { city: "Langkawi", type: "Villa rentals" },
    { city: "Lombok", type: "House rentals" },
    { city: "Seychelles", type: "Resort rentals" },
  ],
  "Mountains": [
    { city: "Manali", type: "Cottage rentals" },
    { city: "Shimla", type: "House rentals" },
    { city: "Munnar", type: "Treehouse rentals" },
    { city: "Coorg", type: "Cabin rentals" },
    { city: "Darjeeling", type: "Holiday rentals" },
    { city: "Ooty", type: "Cottage rentals" },
    { city: "Leh", type: "Camp rentals" },
    { city: "Nainital", type: "House rentals" },
    { city: "Mussoorie", type: "Cottage rentals" },
    { city: "Banff", type: "Cabin rentals" },
    { city: "Interlaken", type: "Chalet rentals" },
    { city: "Chamonix", type: "Apartment rentals" },
    { city: "Aspen", type: "House rentals" },
    { city: "Zermatt", type: "Chalet rentals" },
    { city: "Lake Tahoe", type: "Cabin rentals" },
    { city: "Whistler", type: "House rentals" },
    { city: "Jackson Hole", type: "Cabin rentals" },
  ],
  "Outdoors": [
    { city: "Kaziranga", type: "Eco lodge rentals" },
    { city: "Jim Corbett", type: "Resort rentals" },
    { city: "Ranthambore", type: "Camp rentals" },
    { city: "Wayanad", type: "Treehouse rentals" },
    { city: "Jaisalmer", type: "Desert camp rentals" },
    { city: "Alleppey", type: "Houseboat rentals" },
    { city: "Yellowstone", type: "Cabin rentals" },
    { city: "Yosemite", type: "Cabin rentals" },
    { city: "Costa Rica", type: "Eco lodge rentals" },
    { city: "Queenstown", type: "House rentals" },
    { city: "Patagonia", type: "Cabin rentals" },
    { city: "Iceland", type: "Holiday rentals" },
    { city: "Norwegian Fjords", type: "Cabin rentals" },
    { city: "Scottish Highlands", type: "Cottage rentals" },
    { city: "Swiss Alps", type: "Chalet rentals" },
    { city: "Canadian Rockies", type: "Lodge rentals" },
    { city: "Grand Canyon", type: "Camp rentals" },
  ],
  "Things to do": [
    { city: "Bengaluru", type: "City experiences" },
    { city: "Mumbai", type: "Food tours" },
    { city: "Delhi", type: "Heritage walks" },
    { city: "Jaipur", type: "Cultural tours" },
    { city: "Udaipur", type: "Boat tours" },
    { city: "Varanasi", type: "Spiritual tours" },
    { city: "Tokyo", type: "Street food tours" },
    { city: "Bangkok", type: "Market tours" },
    { city: "Lisbon", type: "Tram tours" },
    { city: "Cape Town", type: "Wine tours" },
    { city: "Marrakech", type: "Souk tours" },
    { city: "Hanoi", type: "Cooking classes" },
    { city: "Mexico City", type: "Art tours" },
    { city: "Buenos Aires", type: "Tango classes" },
    { city: "Havana", type: "Classic car tours" },
    { city: "Seoul", type: "K-food tours" },
    { city: "Singapore", type: "Hawker tours" },
  ],
};

export default function InspirationSection() {
  const [activeTab, setActiveTab] = useState("Popular");
  const [showMore, setShowMore] = useState(false);

  const destinations = DESTINATIONS[activeTab] || [];
  const visible = showMore ? destinations : destinations.slice(0, 18);

  return (
    <section style={{ background: "#F7F7F7", borderTop: "1px solid #DDDDDD" }}>
      <div style={{ padding: "48px 24px 56px", maxWidth: "1280px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#222222", marginBottom: "24px" }}>
          Inspiration for future getaways
        </h2>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #DDDDDD", marginBottom: "24px", overflowX: "auto" }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setShowMore(false); }}
              style={{
                padding: "12px 16px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #222222" : "2px solid transparent",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#222222" : "#717171",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Destination grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "0",
        }}>
          {visible.map((dest, i) => (
            <div
              key={`${activeTab}-${i}`}
              style={{ padding: "12px 8px 12px 0" }}
            >
              <a
                href="#"
                style={{
                  fontSize: "14px", fontWeight: 600, color: "#222222",
                  textDecoration: "none", lineHeight: "1.4",
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                {dest.city}
              </a>
              <p style={{ fontSize: "14px", color: "#717171", marginTop: "2px", lineHeight: "1.3" }}>
                {dest.type}
              </p>
            </div>
          ))}
        </div>

        {/* Show more */}
        {destinations.length > 18 && !showMore && (
          <button
            onClick={() => setShowMore(true)}
            style={{
              marginTop: "16px",
              background: "none", border: "none",
              fontSize: "14px", fontWeight: 600, color: "#222222",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
            }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
          >
            Show more ▾
          </button>
        )}
      </div>
    </section>
  );
}
