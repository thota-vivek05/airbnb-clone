from sqlalchemy.orm import Session
import models, schemas
import uuid
import json

# --- Users ---
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        id=str(uuid.uuid4()),
        name=user.name,
        email=user.email,
        password=user.password,
        avatar=user.avatar,
        isHost=user.isHost,
        joinedYear=user.joinedYear
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Listings ---
def get_listings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Listing).offset(skip).limit(limit).all()

def get_listing(db: Session, listing_id: str):
    return db.query(models.Listing).filter(models.Listing.id == listing_id).first()

def get_listings_by_host(db: Session, host_id: str):
    return db.query(models.Listing).filter(models.Listing.hostId == host_id).all()

def create_listing(db: Session, listing: schemas.ListingCreate):
    db_listing = models.Listing(
        id=str(uuid.uuid4()),
        title=listing.title,
        location=listing.location,
        city=listing.city,
        country=listing.country,
        type=listing.type,
        price=listing.price,
        currency=listing.currency,
        rating=listing.rating,
        reviewCount=listing.reviewCount,
        images_json=json.dumps(listing.images),
        description=listing.description,
        amenities_json=json.dumps(listing.amenities),
        maxGuests=listing.maxGuests,
        bedrooms=listing.bedrooms,
        bathrooms=listing.bathrooms,
        beds=listing.beds,
        category=listing.category,
        lat=listing.lat,
        lng=listing.lng,
        hostId=listing.hostId
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def update_listing(db: Session, listing_id: str, listing: schemas.ListingUpdate):
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not db_listing:
        return None
    update_data = listing.model_dump(exclude_unset=True)
    if "images" in update_data:
        db_listing.images_json = json.dumps(update_data.pop("images"))
    if "amenities" in update_data:
        db_listing.amenities_json = json.dumps(update_data.pop("amenities"))
    for key, value in update_data.items():
        setattr(db_listing, key, value)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def delete_listing(db: Session, listing_id: str):
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if db_listing:
        db.delete(db_listing)
        db.commit()
        return True
    return False

# --- Bookings ---
def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Booking).offset(skip).limit(limit).all()

def get_bookings_by_user(db: Session, user_id: str):
    return db.query(models.Booking).filter(models.Booking.userId == user_id).all()

def get_bookings_by_listing(db: Session, listing_id: str):
    return db.query(models.Booking).filter(models.Booking.listingId == listing_id).all()

def get_bookings_for_host(db: Session, host_id: str):
    """Get all bookings for listings owned by a specific host."""
    host_listings = db.query(models.Listing.id).filter(models.Listing.hostId == host_id).all()
    listing_ids = [l.id for l in host_listings]
    if not listing_ids:
        return []
    return db.query(models.Booking).filter(models.Booking.listingId.in_(listing_ids)).all()

def create_booking(db: Session, booking: schemas.BookingCreate):
    db_booking = models.Booking(
        id=str(uuid.uuid4()),
        listingId=booking.listingId,
        userId=booking.userId,
        checkIn=booking.checkIn,
        checkOut=booking.checkOut,
        guests=booking.guests,
        totalPrice=booking.totalPrice,
        status=booking.status,
        createdAt=booking.createdAt
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def cancel_booking(db: Session, booking_id: str):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if db_booking:
        db_booking.status = "cancelled"
        db.commit()
        db.refresh(db_booking)
        return db_booking
    return None

# --- Wishlists ---
def get_wishlists(db: Session, user_id: str):
    return db.query(models.Wishlist).filter(models.Wishlist.userId == user_id).all()

def toggle_wishlist(db: Session, user_id: str, listing_id: str):
    existing = db.query(models.Wishlist).filter(
        models.Wishlist.userId == user_id,
        models.Wishlist.listingId == listing_id
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
        return False
    else:
        db_wishlist = models.Wishlist(
            id=str(uuid.uuid4()),
            userId=user_id,
            listingId=listing_id
        )
        db.add(db_wishlist)
        db.commit()
        return True
