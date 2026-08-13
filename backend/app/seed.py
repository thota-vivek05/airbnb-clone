import json
import uuid
import datetime
from app.database import engine, Base, SessionLocal
from app import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing
    db.query(models.Review).delete()
    db.query(models.Wishlist).delete()
    db.query(models.Booking).delete()
    db.query(models.ListingImage).delete()
    db.query(models.Listing).delete()
    db.query(models.User).delete()
    db.commit()

    print("Seeding Users...")
    users = [
        models.User(
            id="u1", name="Sarah Thompson", email="sarah@example.com", password="password123",
            role="guest", avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop",
            is_superhost=False, joined_date="Joined 2021"
        ),
        models.User(
            id="u2", name="James Chen", email="james@example.com", password="password123",
            role="guest", avatar_url="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&auto=format&fit=crop",
            is_superhost=False, joined_date="Joined 2022"
        ),
        models.User(
            id="h1", name="Priya Sharma", email="priya@example.com", password="password123",
            role="host", avatar_url="https://images.unsplash.com/photo-1494790108755-2616b612b5e7?w=100&auto=format&fit=crop",
            is_superhost=True, joined_date="Joined 2019"
        ),
        models.User(
            id="h2", name="Rahul Nair", email="rahul@example.com", password="password123",
            role="host", avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
            is_superhost=False, joined_date="Joined 2020"
        ),
        models.User(
            id="alex", name="Alex Demo", email="alex@example.com", password="password123",
            role="guest", avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            is_superhost=False, joined_date="Joined 2023"
        )
    ]
    db.add_all(users)
    db.commit()

    print("Seeding Listings...")
    listings_data = [
        {
            "id": "1", "host_id": "h1", "title": "Luxury Villa with Private Pool in Goa",
            "description": "Experience the ultimate luxury in this stunning villa with a private infinity pool overlooking the Arabian Sea.",
            "category": "amazing-pools", "property_type": "Entire villa", "city": "Goa", "country": "India",
            "latitude": 15.5489, "longitude": 73.7534, "price_per_night": 8500, "cleaning_fee": 1500, "service_fee": 1000,
            "max_guests": 8, "bedrooms": 4, "beds": 5, "baths": 4, "rating": 4.97, "reviews_count": 128,
            "amenities": ["WiFi", "Private pool", "Air conditioning", "Kitchen", "Free parking", "TV", "Washing machine", "BBQ grill", "Ocean view", "Beach access"],
            "images": [
                "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "2", "host_id": "h2", "title": "Beachfront Cottage in Kovalam",
            "description": "Wake up to the sound of waves in this charming beachfront cottage in Kerala.",
            "category": "beachfront", "property_type": "Entire cottage", "city": "Kovalam", "country": "India",
            "latitude": 8.3988, "longitude": 76.9782, "price_per_night": 4200, "cleaning_fee": 800, "service_fee": 500,
            "max_guests": 4, "bedrooms": 2, "beds": 2, "baths": 2, "rating": 4.89, "reviews_count": 87,
            "amenities": ["WiFi", "Beach access", "Air conditioning", "Kitchen", "Sea view", "Hammock", "Outdoor shower", "Fishing equipment"],
            "images": [
                "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "3", "host_id": "h1", "title": "Modern Flat in Bandra, Mumbai",
            "description": "Stay in the heart of Mumbai's most trendy neighborhood. Beautifully designed flat.",
            "category": "design", "property_type": "Entire apartment", "city": "Mumbai", "country": "India",
            "latitude": 19.0596, "longitude": 72.8295, "price_per_night": 5700, "cleaning_fee": 1000, "service_fee": 700,
            "max_guests": 3, "bedrooms": 2, "beds": 2, "baths": 2, "rating": 4.96, "reviews_count": 203,
            "amenities": ["WiFi", "Air conditioning", "Kitchen", "Washing machine", "TV", "Gym access", "Elevator", "Security"],
            "images": [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "4", "host_id": "h1", "title": "Heritage Haveli in Jaipur",
            "description": "Step back in time and experience Rajasthani royalty in this beautifully restored heritage haveli.",
            "category": "mansions", "property_type": "Entire home", "city": "Jaipur", "country": "India",
            "latitude": 26.9124, "longitude": 75.7873, "price_per_night": 6800, "cleaning_fee": 1200, "service_fee": 800,
            "max_guests": 6, "bedrooms": 3, "beds": 4, "baths": 3, "rating": 4.93, "reviews_count": 156,
            "amenities": ["WiFi", "Air conditioning", "Rooftop terrace", "Traditional meals", "Cultural tours", "Courtyard", "Heritage architecture", "City view"],
            "images": [
                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "5", "host_id": "h2", "title": "Treehouse Retreat in Munnar",
            "description": "Nestle among the treetops in this magical treehouse surrounded by tea plantations and misty mountains.",
            "category": "treehouses", "property_type": "Treehouse", "city": "Munnar", "country": "India",
            "latitude": 10.0889, "longitude": 77.0595, "price_per_night": 3900, "cleaning_fee": 700, "service_fee": 450,
            "max_guests": 2, "bedrooms": 1, "beds": 1, "baths": 1, "rating": 4.98, "reviews_count": 72,
            "amenities": ["WiFi", "Mountain view", "Tea plantation walks", "Bonfire", "Nature trails", "Breakfast included", "Bird watching"],
            "images": [
                "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "6", "host_id": "h1", "title": "Houseboat on Dal Lake, Srinagar",
            "description": "Float on the legendary Dal Lake in a traditional Kashmiri houseboat.",
            "category": "trending", "property_type": "Houseboat", "city": "Srinagar", "country": "India",
            "latitude": 34.0837, "longitude": 74.7973, "price_per_night": 7200, "cleaning_fee": 1000, "service_fee": 850,
            "max_guests": 4, "bedrooms": 2, "beds": 2, "baths": 2, "rating": 4.91, "reviews_count": 94,
            "amenities": ["Shikara ride", "Traditional meals included", "Mountain view", "Lake view", "Fishing", "Cultural experience", "Butler service"],
            "images": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1468824297222-8db5b5c38fdb?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "7", "host_id": "h2", "title": "Forest Cabin in Coorg",
            "description": "Escape to this stunning forest cabin surrounded by coffee plantations and lush rainforests.",
            "category": "cabins", "property_type": "Cabin", "city": "Coorg", "country": "India",
            "latitude": 12.4244, "longitude": 75.7382, "price_per_night": 5100, "cleaning_fee": 800, "service_fee": 600,
            "max_guests": 5, "bedrooms": 2, "beds": 3, "baths": 2, "rating": 4.88, "reviews_count": 63,
            "amenities": ["WiFi", "Coffee plantation walk", "Fireplace", "Forest view", "Hammock", "Bonfire", "Hiking trails", "Breakfast included"],
            "images": [
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "8", "host_id": "h1", "title": "Beachside Bungalow in Pondicherry",
            "description": "A charming French colonial-style bungalow steps from the promenade beach.",
            "category": "beachfront", "property_type": "Entire bungalow", "city": "Pondicherry", "country": "India",
            "latitude": 11.9416, "longitude": 79.8083, "price_per_night": 4600, "cleaning_fee": 900, "service_fee": 550,
            "max_guests": 6, "bedrooms": 3, "beds": 3, "baths": 2, "rating": 4.94, "reviews_count": 118,
            "amenities": ["WiFi", "Beach access", "Air conditioning", "Kitchen", "Courtyard", "Bicycle rental", "French ambiance", "Sea view"],
            "images": [
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "9", "host_id": "h2", "title": "Luxury Penthouse in Bengaluru",
            "description": "Live like royalty in this ultra-modern penthouse atop one of Bengaluru's most iconic buildings.",
            "category": "luxe", "property_type": "Entire penthouse", "city": "Bengaluru", "country": "India",
            "latitude": 12.9784, "longitude": 77.6408, "price_per_night": 9800, "cleaning_fee": 1800, "service_fee": 1200,
            "max_guests": 4, "bedrooms": 2, "beds": 2, "baths": 3, "rating": 4.95, "reviews_count": 47,
            "amenities": ["WiFi", "Rooftop jacuzzi", "Air conditioning", "Smart home", "City panorama", "Gym access", "Pool", "Concierge", "Parking"],
            "images": [
                "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "10", "host_id": "h1", "title": "Desert Camp in Jaisalmer",
            "description": "Sleep under a million stars in this luxury desert camp on the golden Sam Sand Dunes.",
            "category": "countryside", "property_type": "Tent", "city": "Jaisalmer", "country": "India",
            "latitude": 26.9124, "longitude": 70.5680, "price_per_night": 3200, "cleaning_fee": 500, "service_fee": 350,
            "max_guests": 2, "bedrooms": 1, "beds": 1, "baths": 1, "rating": 4.90, "reviews_count": 201,
            "amenities": ["Camel ride", "Folk performances", "Traditional meals", "Bonfire", "Stargazing", "Desert safari", "Photography spots"],
            "images": [
                "https://images.unsplash.com/photo-1531795210866-1c5f1b4e2eda?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "11", "host_id": "h2", "title": "Farmhouse Stay in Nashik Vineyard",
            "description": "Wake up to vineyards as far as the eye can see in this charming farmhouse in Nashik's wine country.",
            "category": "farms", "property_type": "Entire farmhouse", "city": "Nashik", "country": "India",
            "latitude": 20.0114, "longitude": 73.7902, "price_per_night": 6200, "cleaning_fee": 1100, "service_fee": 700,
            "max_guests": 8, "bedrooms": 4, "beds": 5, "baths": 3, "rating": 4.87, "reviews_count": 55,
            "amenities": ["WiFi", "Vineyard tour", "Wine tasting", "Farm meals", "Swimming pool", "Cycling", "Picnic area", "Outdoor dining"],
            "images": [
                "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1536301027200-d3e2d1ccc1ab?w=800&auto=format&fit=crop",
            ]
        },
        {
            "id": "12", "host_id": "h1", "title": "Eco Lodge in Kaziranga Forests",
            "description": "A sustainable eco-lodge at the edge of the famous Kaziranga National Park.",
            "category": "national-parks", "property_type": "Eco lodge", "city": "Kaziranga", "country": "India",
            "latitude": 26.6638, "longitude": 93.3729, "price_per_night": 4800, "cleaning_fee": 850, "service_fee": 550,
            "max_guests": 4, "bedrooms": 2, "beds": 2, "baths": 2, "rating": 4.92, "reviews_count": 38,
            "amenities": ["Jeep safari", "Wildlife viewing", "Nature walks", "Organic meals", "Solar power", "Rainwater harvesting", "Bird watching"],
            "images": [
                "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&auto=format&fit=crop",
            ]
        }
    ]

    for item in listings_data:
        images = item.pop("images")
        amenities = item.pop("amenities")

        listing = models.Listing(**item, amenities=json.dumps(amenities))
        db.add(listing)
        db.commit()

        for idx, url in enumerate(images):
            db.add(models.ListingImage(listing_id=listing.id, url=url, display_order=idx))

    print("Seeding Reviews...")
    reviews_data = [
        {"id": "r1", "listing_id": "1", "user_id": "u1", "rating": 5, "comment": "Absolutely stunning property! The pool view was incredible.", "date": "November 2024"},
        {"id": "r2", "listing_id": "1", "user_id": "u2", "rating": 5, "comment": "Perfect villa for a family vacation. The amenities were top-notch.", "date": "October 2024"},
        {"id": "r4", "listing_id": "2", "user_id": "u1", "rating": 5, "comment": "The most peaceful place I've ever stayed.", "date": "September 2024"},
        {"id": "r5", "listing_id": "3", "user_id": "u2", "rating": 5, "comment": "Perfect location in Bandra. The flat is modern, clean, and has everything.", "date": "November 2024"}
    ]
    for r_item in reviews_data:
        u = db.query(models.User).filter(models.User.id == r_item["user_id"]).first()
        r = models.Review(**r_item, author_name=u.name, author_avatar=u.avatar_url)
        db.add(r)
    
    print("Seeding Bookings...")
    b1 = models.Booking(
        id="booking_1", listing_id="1", guest_id="alex",
        check_in="2025-12-10", check_out="2025-12-15", guests_count=2,
        nightly_price=8500, total_nights=5, cleaning_fee=1500, service_fee=1000,
        total_price=(8500*5 + 1500 + 1000), status="confirmed"
    )
    db.add(b1)

    db.commit()
    print("Database successfully seeded!")
    db.close()

if __name__ == "__main__":
    seed_database()
