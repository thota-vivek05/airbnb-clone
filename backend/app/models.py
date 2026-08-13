from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="guest") # "guest" | "host"
    avatar_url = Column(String)
    is_superhost = Column(Boolean, default=False)
    joined_date = Column(String)

    listings = relationship("Listing", back_populates="host")
    bookings = relationship("Booking", back_populates="guest")

class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True, index=True)
    host_id = Column(String, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String, index=True) # "trending", "cabins", "tropical", etc.
    property_type = Column(String) # "Entire home", "Private room", etc.
    city = Column(String, index=True)
    country = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=0.0)
    service_fee = Column(Float, default=0.0)
    max_guests = Column(Integer, default=1)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    baths = Column(Integer, default=1)
    rating = Column(Float, default=5.0)
    reviews_count = Column(Integer, default=0)
    amenities = Column(Text) # JSON string array
    created_at = Column(DateTime, default=datetime.utcnow)

    host = relationship("User", back_populates="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")

class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    listing_id = Column(String, ForeignKey("listings.id"))
    url = Column(String, nullable=False)
    display_order = Column(Integer, default=0)

    listing = relationship("Listing", back_populates="images")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    listing_id = Column(String, ForeignKey("listings.id"))
    guest_id = Column(String, ForeignKey("users.id"))
    check_in = Column(String, nullable=False) # YYYY-MM-DD
    check_out = Column(String, nullable=False) # YYYY-MM-DD
    guests_count = Column(Integer, default=1)
    nightly_price = Column(Float)
    total_nights = Column(Integer)
    cleaning_fee = Column(Float)
    service_fee = Column(Float)
    total_price = Column(Float)
    status = Column(String, default="confirmed")
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, index=True)
    listing_id = Column(String, ForeignKey("listings.id"))
    author_name = Column(String)
    author_avatar = Column(String)
    rating = Column(Float, default=5.0)
    date = Column(String)
    comment = Column(Text)

    listing = relationship("Listing", back_populates="reviews")

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"))
    listing_id = Column(String, ForeignKey("listings.id"))
