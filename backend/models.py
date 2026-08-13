from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text
from sqlalchemy.orm import relationship
import json
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    avatar = Column(String)
    isHost = Column(Boolean, default=False)
    joinedYear = Column(Integer)
    
    listings = relationship("Listing", back_populates="host")
    bookings = relationship("Booking", back_populates="user")
    reviews = relationship("Review", back_populates="user")

class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    location = Column(String)
    city = Column(String)
    country = Column(String)
    type = Column(String)
    price = Column(Float)
    currency = Column(String, default="₹")
    rating = Column(Float, default=0.0)
    reviewCount = Column(Integer, default=0)
    images_json = Column(Text, default="[]")
    description = Column(Text)
    amenities_json = Column(Text, default="[]")
    maxGuests = Column(Integer)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    beds = Column(Integer)
    category = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    
    hostId = Column(String, ForeignKey("users.id"))
    host = relationship("User", back_populates="listings")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")

    @property
    def images(self):
        return json.loads(self.images_json) if self.images_json else []
    
    @images.setter
    def images(self, value):
        self.images_json = json.dumps(value)
        
    @property
    def amenities(self):
        return json.loads(self.amenities_json) if self.amenities_json else []
        
    @amenities.setter
    def amenities(self, value):
        self.amenities_json = json.dumps(value)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    listingId = Column(String, ForeignKey("listings.id"))
    userId = Column(String, ForeignKey("users.id"))
    checkIn = Column(String)
    checkOut = Column(String)
    guests = Column(Integer)
    totalPrice = Column(Float)
    status = Column(String, default="confirmed")
    createdAt = Column(String)

    listing = relationship("Listing", back_populates="bookings")
    user = relationship("User", back_populates="bookings")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, index=True)
    listingId = Column(String, ForeignKey("listings.id"))
    userId = Column(String, ForeignKey("users.id"))
    rating = Column(Float)
    comment = Column(Text)
    date = Column(String)

    listing = relationship("Listing", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(String, primary_key=True, index=True)
    userId = Column(String, ForeignKey("users.id"))
    listingId = Column(String, ForeignKey("listings.id"))
