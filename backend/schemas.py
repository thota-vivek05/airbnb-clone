from pydantic import BaseModel
from typing import List, Optional

class Coordinates(BaseModel):
    lat: float
    lng: float

# --- Listings ---
class ListingBase(BaseModel):
    title: str
    location: str
    city: str
    country: str
    type: str
    price: float
    currency: str = "₹"
    rating: float = 0.0
    reviewCount: int = 0
    images: List[str]
    description: str
    amenities: List[str]
    maxGuests: int
    bedrooms: int
    bathrooms: int
    beds: int
    category: str
    hostId: str
    
class ListingCreate(ListingBase):
    lat: float = 20.5937
    lng: float = 78.9629

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    type: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    amenities: Optional[List[str]] = None
    maxGuests: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    beds: Optional[int] = None
    category: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class ListingResponse(ListingBase):
    id: str
    coordinates: Coordinates
    hostName: Optional[str] = None
    hostAvatar: Optional[str] = None
    hostSince: Optional[str] = None
    isSuperhost: Optional[bool] = False
    isGuestFavorite: Optional[bool] = False
    bookedDates: Optional[List[List[str]]] = []

    class Config:
        from_attributes = True

# --- Users ---
class UserBase(BaseModel):
    name: str
    email: str
    avatar: str
    isHost: bool
    joinedYear: int

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: str
    isHost: bool
    joinedYear: int

# --- Bookings ---
class BookingBase(BaseModel):
    listingId: str
    userId: str
    checkIn: str
    checkOut: str
    guests: int
    totalPrice: float
    status: str = "confirmed"
    createdAt: str

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: str

    class Config:
        from_attributes = True

# --- Reviews ---
class ReviewBase(BaseModel):
    listingId: str
    userId: str
    rating: float
    comment: str
    date: str

class ReviewCreate(ReviewBase):
    pass
    
class ReviewResponse(ReviewBase):
    id: str
    userName: str
    userAvatar: str
    
    class Config:
        from_attributes = True

# --- Wishlists ---
class WishlistToggle(BaseModel):
    userId: str
    listingId: str
