import uuid, json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("", response_model=schemas.BookingResponse)
def create_booking(payload: schemas.BookingCreate, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == payload.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    # Overlap validation
    existing_bookings = db.query(models.Booking).filter(
        models.Booking.listing_id == payload.listing_id,
        models.Booking.status == "confirmed"
    ).all()

    for b in existing_bookings:
        if payload.check_in < b.check_out and payload.check_out > b.check_in:
            raise HTTPException(
                status_code=400,
                detail="Selected dates overlap with an existing reservation. Please choose different dates."
            )

    # Compute nights & fees
    d1 = datetime.strptime(payload.check_in, "%Y-%m-%d")
    d2 = datetime.strptime(payload.check_out, "%Y-%m-%d")
    total_nights = max(1, (d2 - d1).days)

    nightly_price = listing.price_per_night
    nightly_total = nightly_price * total_nights
    cleaning_fee = listing.cleaning_fee or 60.0
    service_fee = listing.service_fee or 40.0
    total_price = nightly_total + cleaning_fee + service_fee

    new_booking = models.Booking(
        id=f"booking_{uuid.uuid4().hex[:8]}",
        listing_id=payload.listing_id,
        guest_id=payload.guest_id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        guests_count=payload.guests_count,
        nightly_price=nightly_price,
        total_nights=total_nights,
        cleaning_fee=cleaning_fee,
        service_fee=service_fee,
        total_price=total_price,
        status="confirmed"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    images = [img.url for img in listing.images]
    amenities_list = json.loads(listing.amenities) if listing.amenities else []

    listing_resp = schemas.ListingResponse(
        id=listing.id,
        host_id=listing.host_id,
        title=listing.title,
        description=listing.description or "",
        category=listing.category or "",
        property_type=listing.property_type or "Entire home",
        city=listing.city or "",
        country=listing.country or "",
        latitude=listing.latitude or 0.0,
        longitude=listing.longitude or 0.0,
        price_per_night=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee or 0.0,
        service_fee=listing.service_fee or 0.0,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        baths=listing.baths,
        rating=listing.rating or 5.0,
        reviews_count=listing.reviews_count or 0,
        images=images,
        amenities=amenities_list,
        host=listing.host
    )

    return schemas.BookingResponse(
        id=new_booking.id,
        listing_id=new_booking.listing_id,
        guest_id=new_booking.guest_id,
        check_in=new_booking.check_in,
        check_out=new_booking.check_out,
        guests_count=new_booking.guests_count,
        nightly_price=new_booking.nightly_price,
        total_nights=new_booking.total_nights,
        cleaning_fee=new_booking.cleaning_fee,
        service_fee=new_booking.service_fee,
        total_price=new_booking.total_price,
        status=new_booking.status,
        listing=listing_resp
    )

@router.get("/my-trips", response_model=List[schemas.BookingResponse])
def get_my_trips(guest_id: str = "user_guest_1", db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).filter(models.Booking.guest_id == guest_id).all()
    results = []

    for b in bookings:
        listing = b.listing
        images = [img.url for img in listing.images] if listing else []
        amenities_list = json.loads(listing.amenities) if (listing and listing.amenities) else []

        listing_resp = schemas.ListingResponse(
            id=listing.id,
            host_id=listing.host_id,
            title=listing.title,
            description=listing.description or "",
            category=listing.category or "",
            property_type=listing.property_type or "Entire home",
            city=listing.city or "",
            country=listing.country or "",
            latitude=listing.latitude or 0.0,
            longitude=listing.longitude or 0.0,
            price_per_night=listing.price_per_night,
            cleaning_fee=listing.cleaning_fee or 0.0,
            service_fee=listing.service_fee or 0.0,
            max_guests=listing.max_guests,
            bedrooms=listing.bedrooms,
            beds=listing.beds,
            baths=listing.baths,
            rating=listing.rating or 5.0,
            reviews_count=listing.reviews_count or 0,
            images=images,
            amenities=amenities_list,
            host=listing.host
        ) if listing else None

        results.append(
            schemas.BookingResponse(
                id=b.id,
                listing_id=b.listing_id,
                guest_id=b.guest_id,
                check_in=b.check_in,
                check_out=b.check_out,
                guests_count=b.guests_count,
                nightly_price=b.nightly_price,
                total_nights=b.total_nights,
                cleaning_fee=b.cleaning_fee,
                service_fee=b.service_fee,
                total_price=b.total_price,
                status=b.status,
                listing=listing_resp
            )
        )

    return results

@router.patch("/{booking_id}/cancel", response_model=schemas.BookingResponse)
def cancel_booking(booking_id: str, db: Session = Depends(get_db)):
    b = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    b.status = "cancelled"
    db.commit()
    db.refresh(b)
    
    listing = b.listing
    images = [img.url for img in listing.images] if listing else []
    amenities_list = json.loads(listing.amenities) if (listing and listing.amenities) else []
    
    listing_resp = schemas.ListingResponse(
        id=listing.id,
        host_id=listing.host_id,
        title=listing.title,
        description=listing.description or "",
        category=listing.category or "",
        property_type=listing.property_type or "Entire home",
        city=listing.city or "",
        country=listing.country or "",
        latitude=listing.latitude or 0.0,
        longitude=listing.longitude or 0.0,
        price_per_night=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee or 0.0,
        service_fee=listing.service_fee or 0.0,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        baths=listing.baths,
        rating=listing.rating or 5.0,
        reviews_count=listing.reviews_count or 0,
        images=images,
        amenities=amenities_list,
        host=listing.host
    ) if listing else None
    
    return schemas.BookingResponse(
        id=b.id,
        listing_id=b.listing_id,
        guest_id=b.guest_id,
        check_in=b.check_in,
        check_out=b.check_out,
        guests_count=b.guests_count,
        nightly_price=b.nightly_price,
        total_nights=b.total_nights,
        cleaning_fee=b.cleaning_fee,
        service_fee=b.service_fee,
        total_price=b.total_price,
        status=b.status,
        listing=listing_resp
    )

@router.get("/host/{host_id}", response_model=List[schemas.BookingResponse])
def get_host_bookings(host_id: str, db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).join(models.Listing).filter(models.Listing.host_id == host_id).all()
    results = []
    for b in bookings:
        listing = b.listing
        images = [img.url for img in listing.images] if listing else []
        amenities_list = json.loads(listing.amenities) if (listing and listing.amenities) else []
        listing_resp = schemas.ListingResponse(
            id=listing.id, host_id=listing.host_id, title=listing.title,
            description=listing.description or "", category=listing.category or "",
            property_type=listing.property_type or "Entire home", city=listing.city or "",
            country=listing.country or "", latitude=listing.latitude or 0.0, longitude=listing.longitude or 0.0,
            price_per_night=listing.price_per_night, cleaning_fee=listing.cleaning_fee or 0.0,
            service_fee=listing.service_fee or 0.0, max_guests=listing.max_guests,
            bedrooms=listing.bedrooms, beds=listing.beds, baths=listing.baths,
            rating=listing.rating or 5.0, reviews_count=listing.reviews_count or 0,
            images=images, amenities=amenities_list, host=listing.host
        ) if listing else None
        results.append(schemas.BookingResponse(
            id=b.id, listing_id=b.listing_id, guest_id=b.guest_id, check_in=b.check_in,
            check_out=b.check_out, guests_count=b.guests_count, nightly_price=b.nightly_price,
            total_nights=b.total_nights, cleaning_fee=b.cleaning_fee, service_fee=b.service_fee,
            total_price=b.total_price, status=b.status, listing=listing_resp
        ))
    return results

@router.get("/{listing_id}/dates")
def get_booked_dates(listing_id: str, db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "confirmed"
    ).all()
    
    dates = []
    for b in bookings:
        dates.append({"check_in": b.check_in, "check_out": b.check_out})
    return dates
