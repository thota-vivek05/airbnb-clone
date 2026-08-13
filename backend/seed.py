"""
Run this script directly from the backend directory: python seed.py
It seeds the SQLite database with sample data matching the frontend's mock data.
"""
import json
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# --- Users ---
users_data = [
    {"id": "u1", "name": "Sarah Thompson", "email": "sarah@example.com", "password": "password123",
     "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop", "isHost": False, "joinedYear": 2021},
    {"id": "h1", "name": "Priya Sharma", "email": "priya@example.com", "password": "password123",
     "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b5e7?w=100&auto=format&fit=crop", "isHost": True, "joinedYear": 2019},
    {"id": "guest1", "name": "Alex Johnson", "email": "alex@example.com", "password": "password123",
     "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop", "isHost": False, "joinedYear": 2022},
    {"id": "host2", "name": "Raj Patel", "email": "raj@example.com", "password": "password123",
     "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop", "isHost": True, "joinedYear": 2020},
]

for u in users_data:
    if not db.query(models.User).filter_by(id=u["id"]).first():
        db.add(models.User(**u))

# --- Listings (matching frontend data.ts) ---
listings_data = [
    {
        "id": "1", "title": "Luxury Villa with Private Pool in Goa",
        "location": "Calangute, Goa", "city": "Goa", "country": "India",
        "type": "Entire villa", "price": 8500, "currency": "₹", "rating": 4.97, "reviewCount": 128,
        "images_json": json.dumps([
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
        ]),
        "description": "Experience the ultimate luxury in this stunning villa with a private infinity pool overlooking the Arabian Sea.",
        "amenities_json": json.dumps(["WiFi", "Private pool", "Air conditioning", "Kitchen", "Free parking", "TV", "Washing machine", "BBQ grill", "Ocean view", "Beach access"]),
        "maxGuests": 8, "bedrooms": 4, "bathrooms": 4, "beds": 4,
        "category": "luxe", "lat": 15.5494, "lng": 73.7554, "hostId": "h1"
    },
    {
        "id": "2", "title": "Modern Apartment near Connaught Place",
        "location": "Connaught Place, Delhi", "city": "Delhi", "country": "India",
        "type": "Entire apartment", "price": 4200, "currency": "₹", "rating": 4.85, "reviewCount": 94,
        "images_json": json.dumps([
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
        ]),
        "description": "Stylish and modern 2BHK apartment in the heart of Delhi, walking distance to Connaught Place.",
        "amenities_json": json.dumps(["WiFi", "Air conditioning", "Kitchen", "TV", "Elevator", "Washing machine"]),
        "maxGuests": 4, "bedrooms": 2, "bathrooms": 2, "beds": 2,
        "category": "trending", "lat": 28.6315, "lng": 77.2167, "hostId": "host2"
    },
    {
        "id": "3", "title": "Beachfront Cottage in Pondicherry",
        "location": "White Town, Pondicherry", "city": "Pondicherry", "country": "India",
        "type": "Entire home", "price": 5800, "currency": "₹", "rating": 4.92, "reviewCount": 76,
        "images_json": json.dumps([
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
        ]),
        "description": "A charming beachfront cottage with stunning ocean views and French colonial architecture.",
        "amenities_json": json.dumps(["WiFi", "Beach access", "Air conditioning", "Kitchen", "Free parking", "Sea view"]),
        "maxGuests": 6, "bedrooms": 3, "bathrooms": 2, "beds": 3,
        "category": "beachfront", "lat": 11.9344, "lng": 79.8297, "hostId": "h1"
    },
    {
        "id": "4", "title": "Treehouse Retreat in Munnar",
        "location": "Munnar, Kerala", "city": "Munnar", "country": "India",
        "type": "Treehouse", "price": 6500, "currency": "₹", "rating": 4.95, "reviewCount": 52,
        "images_json": json.dumps([
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop",
        ]),
        "description": "A magical treehouse nestled among tea plantations with panoramic mountain views.",
        "amenities_json": json.dumps(["WiFi", "Mountain view", "Breakfast included", "Free parking"]),
        "maxGuests": 2, "bedrooms": 1, "bathrooms": 1, "beds": 1,
        "category": "treehouses", "lat": 10.0889, "lng": 77.0595, "hostId": "host2"
    },
    {
        "id": "5", "title": "Heritage Haveli in Jaipur",
        "location": "Old City, Jaipur", "city": "Jaipur", "country": "India",
        "type": "Entire home", "price": 7200, "currency": "₹", "rating": 4.88, "reviewCount": 110,
        "images_json": json.dumps([
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop",
        ]),
        "description": "A beautifully restored heritage haveli with intricate Rajasthani architecture and modern comforts.",
        "amenities_json": json.dumps(["WiFi", "Air conditioning", "Kitchen", "Rooftop terrace", "Free parking", "Breakfast included"]),
        "maxGuests": 6, "bedrooms": 3, "bathrooms": 3, "beds": 3,
        "category": "castles", "lat": 26.9124, "lng": 75.7873, "hostId": "h1"
    },
    {
        "id": "6", "title": "Cozy Cabin in Manali",
        "location": "Old Manali, Himachal Pradesh", "city": "Manali", "country": "India",
        "type": "Cabin", "price": 3500, "currency": "₹", "rating": 4.91, "reviewCount": 89,
        "images_json": json.dumps([
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
        ]),
        "description": "A cozy wooden cabin surrounded by pine forests with stunning Himalayan views.",
        "amenities_json": json.dumps(["WiFi", "Fireplace", "Mountain view", "Kitchen", "Free parking"]),
        "maxGuests": 4, "bedrooms": 2, "bathrooms": 1, "beds": 2,
        "category": "cabins", "lat": 32.2432, "lng": 77.1892, "hostId": "host2"
    },
]

for l in listings_data:
    if not db.query(models.Listing).filter_by(id=l["id"]).first():
        db.add(models.Listing(**l))

# --- Sample bookings ---
bookings_data = [
    {"id": "b1", "listingId": "1", "userId": "u1", "checkIn": "2026-09-01", "checkOut": "2026-09-05",
     "guests": 4, "totalPrice": 34000, "status": "confirmed", "createdAt": "2026-08-10"},
    {"id": "b2", "listingId": "3", "userId": "guest1", "checkIn": "2026-09-10", "checkOut": "2026-09-14",
     "guests": 2, "totalPrice": 23200, "status": "confirmed", "createdAt": "2026-08-11"},
]

for b in bookings_data:
    if not db.query(models.Booking).filter_by(id=b["id"]).first():
        db.add(models.Booking(**b))

db.commit()
db.close()
print("Database seeded successfully with users, listings, and bookings!")
