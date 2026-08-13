from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _listing_to_response(listing, db: Session):
    """Helper to convert a DB listing to the frontend-expected response format."""
    listing_dict = {
        "id": listing.id,
        "title": listing.title,
        "location": listing.location,
        "city": listing.city,
        "country": listing.country,
        "type": listing.type,
        "price": listing.price,
        "currency": listing.currency,
        "rating": listing.rating,
        "reviewCount": listing.reviewCount,
        "images": listing.images,
        "description": listing.description,
        "amenities": listing.amenities,
        "maxGuests": listing.maxGuests,
        "bedrooms": listing.bedrooms,
        "bathrooms": listing.bathrooms,
        "beds": listing.beds,
        "category": listing.category,
        "coordinates": {"lat": listing.lat, "lng": listing.lng},
        "hostId": listing.hostId,
        "hostName": None,
        "hostAvatar": None,
        "hostSince": None,
        "isSuperhost": False,
        "isGuestFavorite": False,
    }
    if listing.host:
        listing_dict["hostName"] = listing.host.name
        listing_dict["hostAvatar"] = listing.host.avatar
        listing_dict["hostSince"] = str(listing.host.joinedYear)

    bookings = crud.get_bookings_by_listing(db, listing.id)
    booked_dates = [[b.checkIn, b.checkOut] for b in bookings if b.status != "cancelled"]
    listing_dict["bookedDates"] = booked_dates
    return listing_dict

# ========== AUTH ==========

@app.post("/auth/login", response_model=schemas.LoginResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=req.email)
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user

# ========== USERS ==========

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# ========== LISTINGS ==========

@app.get("/listings/", response_model=List[schemas.ListingResponse])
def read_listings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    listings = crud.get_listings(db, skip=skip, limit=limit)
    return [_listing_to_response(l, db) for l in listings]

@app.get("/listings/{listing_id}", response_model=schemas.ListingResponse)
def read_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = crud.get_listing(db, listing_id=listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return _listing_to_response(listing, db)

@app.post("/listings/", response_model=schemas.ListingResponse)
def create_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    db_listing = crud.create_listing(db=db, listing=listing)
    return _listing_to_response(db_listing, db)

@app.put("/listings/{listing_id}", response_model=schemas.ListingResponse)
def update_listing(listing_id: str, listing: schemas.ListingUpdate, db: Session = Depends(get_db)):
    db_listing = crud.update_listing(db, listing_id, listing)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return _listing_to_response(db_listing, db)

@app.delete("/listings/{listing_id}")
def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    success = crud.delete_listing(db, listing_id)
    if not success:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"detail": "Listing deleted"}

# ========== HOST-SPECIFIC ==========

@app.get("/hosts/{host_id}/listings", response_model=List[schemas.ListingResponse])
def read_host_listings(host_id: str, db: Session = Depends(get_db)):
    listings = crud.get_listings_by_host(db, host_id)
    return [_listing_to_response(l, db) for l in listings]

@app.get("/hosts/{host_id}/bookings", response_model=List[schemas.BookingResponse])
def read_host_bookings(host_id: str, db: Session = Depends(get_db)):
    return crud.get_bookings_for_host(db, host_id)

# ========== BOOKINGS ==========

@app.post("/bookings/", response_model=schemas.BookingResponse)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    return crud.create_booking(db=db, booking=booking)

@app.get("/users/{user_id}/bookings/", response_model=List[schemas.BookingResponse])
def read_user_bookings(user_id: str, db: Session = Depends(get_db)):
    return crud.get_bookings_by_user(db, user_id=user_id)

@app.patch("/bookings/{booking_id}/cancel", response_model=schemas.BookingResponse)
def cancel_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = crud.cancel_booking(db, booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

# ========== WISHLISTS ==========

@app.get("/users/{user_id}/wishlists")
def read_wishlists(user_id: str, db: Session = Depends(get_db)):
    wishlists = crud.get_wishlists(db, user_id)
    return [w.listingId for w in wishlists]

@app.post("/wishlists/toggle")
def toggle_wishlist(req: schemas.WishlistToggle, db: Session = Depends(get_db)):
    added = crud.toggle_wishlist(db, req.userId, req.listingId)
    return {"added": added}
