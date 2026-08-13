import json
from app.database import engine, Base, SessionLocal
from app import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing
    db.query(models.Review).delete()
    db.query(models.Booking).delete()
    db.query(models.ListingImage).delete()
    db.query(models.Listing).delete()
    db.query(models.User).delete()
    db.commit()

    print("Seeding Users...")
    guest = models.User(
        id="user_guest_1",
        name="John Doe",
        email="john.doe@example.com",
        role="guest",
        avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        is_superhost=False,
        joined_date="Joined March 2022"
    )
    host1 = models.User(
        id="user_host_1",
        name="Sarah Jenkins",
        email="sarah.j@airbnb.com",
        role="host",
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        is_superhost=True,
        joined_date="Joined October 2018"
    )
    host2 = models.User(
        id="user_host_2",
        name="Marcus Vance",
        email="marcus.v@airbnb.com",
        role="host",
        avatar_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
        is_superhost=True,
        joined_date="Joined November 2019"
    )
    db.add_all([guest, host1, host2])
    db.commit()

    print("Seeding Listings...")
    listings_data = [
        {
            "id": "listing_1",
            "host_id": "user_host_1",
            "title": "The Glass Pavilion - Oceanfront Luxury Villa",
            "description": "Experience panoramic Pacific Ocean views in this architectural masterpiece. Featuring floor-to-ceiling glass walls, an infinity edge heated pool, outdoor lounge, and direct private beach access.",
            "category": "tropical",
            "property_type": "Entire home",
            "city": "Malibu",
            "country": "United States",
            "latitude": 34.0259,
            "longitude": -118.7798,
            "price_per_night": 550.0,
            "cleaning_fee": 120.0,
            "service_fee": 75.0,
            "max_guests": 6,
            "bedrooms": 3,
            "beds": 4,
            "baths": 3,
            "rating": 4.96,
            "reviews_count": 128,
            "amenities": ["Wifi", "Pool", "Free parking", "Air conditioning", "Kitchen", "Beachfront", "Hot tub"],
            "images": [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            ]
        },
        {
            "id": "listing_2",
            "host_id": "user_host_2",
            "title": "Modern Alpine Chalet with Private Cedar Hot Tub",
            "description": "Nestled in the pines of Aspen, this Scandinavian-inspired chalet offers timber vaulted ceilings, stone fireplace, indoor sauna, and outdoor private cedar soaking tub.",
            "category": "cabins",
            "property_type": "Entire home",
            "city": "Aspen",
            "country": "United States",
            "latitude": 39.1911,
            "longitude": -106.8175,
            "price_per_night": 420.0,
            "cleaning_fee": 95.0,
            "service_fee": 55.0,
            "max_guests": 8,
            "bedrooms": 4,
            "beds": 5,
            "baths": 3,
            "rating": 4.98,
            "reviews_count": 94,
            "amenities": ["Wifi", "Hot tub", "Indoor fireplace", "Free parking", "Sauna"],
            "images": [
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
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

    db.commit()
    print("Database successfully seeded!")
    db.close()

if __name__ == "__main__":
    seed_database()
