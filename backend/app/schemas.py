from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar_url: str
    is_superhost: bool
    joined_date: str

    class Config:
        from_attributes = True

class ListingImageBase(BaseModel):
    url: str
    display_order: int = 0

    class Config:
        from_attributes = True

class ListingCreate(BaseModel):
    title: str
    description: str
    category: str
    property_type: str
    city: str
    country: str
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
    price_per_night: float
    cleaning_fee: float = 0.0
    service_fee: float = 0.0
    max_guests: int = 1
    bedrooms: int = 1
    beds: int = 1
    baths: int = 1
    images: List[str]
    amenities: List[str]

class ListingResponse(BaseModel):
    id: str
    host_id: str
    title: str
    description: str
    category: str
    property_type: str
    city: str
    country: str
    latitude: float
    longitude: float
    price_per_night: float
    cleaning_fee: float
    service_fee: float
    max_guests: int
    bedrooms: int
    beds: int
    baths: int
    rating: float
    reviews_count: int
    images: List[str]
    amenities: List[str]
    host: Optional[UserBase]

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    listing_id: str
    guest_id: str = "user_guest_1"
    check_in: str
    check_out: str
    guests_count: int = 1

class BookingResponse(BaseModel):
    id: str
    listing_id: str
    guest_id: str
    check_in: str
    check_out: str
    guests_count: int
    nightly_price: float
    total_nights: int
    cleaning_fee: float
    service_fee: float
    total_price: float
    status: str
    listing: Optional[ListingResponse]

    class Config:
        from_attributes = True
