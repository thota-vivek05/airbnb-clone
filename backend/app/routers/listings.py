import json, uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/listings", tags=["Listings"])

@router.get("", response_model=List[schemas.ListingResponse])
def get_listings(
    category: Optional[str] = None,
    location: Optional[str] = None,
    guests: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    property_type: Optional[str] = None,
    amenities: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(models.Listing)

    if category:
        query = query.filter(models.Listing.category == category)
    if location:
        search_pattern = f"%{location}%"
        query = query.filter(
            (models.Listing.city.ilike(search_pattern)) |
            (models.Listing.country.ilike(search_pattern)) |
            (models.Listing.title.ilike(search_pattern))
        )
    if guests:
        query = query.filter(models.Listing.max_guests >= guests)
    if min_price is not None:
        query = query.filter(models.Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(models.Listing.price_per_night <= max_price)
    if property_type:
        query = query.filter(models.Listing.property_type == property_type)
    if amenities:
        # Simple string inclusion logic since we stored as JSON string
        for amenity in amenities.split(","):
            search_amenity = f"%{amenity.strip()}%"
            query = query.filter(models.Listing.amenities.ilike(search_amenity))

    listings = query.offset(skip).limit(limit).all()
    results = []

    for l in listings:
        images = [img.url for img in l.images]
        amenities_list = json.loads(l.amenities) if l.amenities else []
        results.append(
            schemas.ListingResponse(
                id=l.id,
                host_id=l.host_id,
                title=l.title,
                description=l.description or "",
                category=l.category or "",
                property_type=l.property_type or "Entire home",
                city=l.city or "",
                country=l.country or "",
                latitude=l.latitude or 0.0,
                longitude=l.longitude or 0.0,
                price_per_night=l.price_per_night,
                cleaning_fee=l.cleaning_fee or 0.0,
                service_fee=l.service_fee or 0.0,
                max_guests=l.max_guests,
                bedrooms=l.bedrooms,
                beds=l.beds,
                baths=l.baths,
                rating=l.rating or 5.0,
                reviews_count=l.reviews_count or 0,
                images=images,
                amenities=amenities_list,
                host=l.host
            )
        )
    return results

@router.get("/{listing_id}", response_model=schemas.ListingResponse)
def get_listing_detail(listing_id: str, db: Session = Depends(get_db)):
    l = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not l:
        raise HTTPException(status_code=404, detail="Listing not found")

    images = [img.url for img in l.images]
    amenities_list = json.loads(l.amenities) if l.amenities else []

    return schemas.ListingResponse(
        id=l.id,
        host_id=l.host_id,
        title=l.title,
        description=l.description or "",
        category=l.category or "",
        property_type=l.property_type or "Entire home",
        city=l.city or "",
        country=l.country or "",
        latitude=l.latitude or 0.0,
        longitude=l.longitude or 0.0,
        price_per_night=l.price_per_night,
        cleaning_fee=l.cleaning_fee or 0.0,
        service_fee=l.service_fee or 0.0,
        max_guests=l.max_guests,
        bedrooms=l.bedrooms,
        beds=l.beds,
        baths=l.baths,
        rating=l.rating or 5.0,
        reviews_count=l.reviews_count or 0,
        images=images,
        amenities=amenities_list,
        host=l.host
    )

@router.post("", response_model=schemas.ListingResponse)
def create_listing(payload: schemas.ListingCreate, host_id: str = "user_host_1", db: Session = Depends(get_db)):
    new_id = f"listing_{uuid.uuid4().hex[:8]}"
    listing = models.Listing(
        id=new_id,
        host_id=host_id,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        property_type=payload.property_type,
        city=payload.city,
        country=payload.country,
        latitude=payload.latitude,
        longitude=payload.longitude,
        price_per_night=payload.price_per_night,
        cleaning_fee=payload.cleaning_fee,
        service_fee=payload.service_fee,
        max_guests=payload.max_guests,
        bedrooms=payload.bedrooms,
        beds=payload.beds,
        baths=payload.baths,
        rating=5.0,
        reviews_count=1,
        amenities=json.dumps(payload.amenities)
    )

    db.add(listing)
    db.commit()

    for idx, img_url in enumerate(payload.images):
        db.add(models.ListingImage(listing_id=new_id, url=img_url, display_order=idx))

    db.commit()
    db.refresh(listing)

    return schemas.ListingResponse(
        id=listing.id,
        host_id=listing.host_id,
        title=listing.title,
        description=listing.description,
        category=listing.category,
        property_type=listing.property_type,
        city=listing.city,
        country=listing.country,
        latitude=listing.latitude,
        longitude=listing.longitude,
        price_per_night=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee,
        service_fee=listing.service_fee,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        baths=listing.baths,
        rating=listing.rating,
        reviews_count=listing.reviews_count,
        images=payload.images,
        amenities=payload.amenities,
        host=listing.host
    )

@router.put("/{listing_id}", response_model=schemas.ListingResponse)
def update_listing(listing_id: str, payload: schemas.ListingUpdate, db: Session = Depends(get_db)):
    l = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not l:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    update_data = payload.dict(exclude_unset=True)
    
    if "images" in update_data:
        images = update_data.pop("images")
        # clear old images
        db.query(models.ListingImage).filter(models.ListingImage.listing_id == listing_id).delete()
        for idx, img_url in enumerate(images):
            db.add(models.ListingImage(listing_id=listing_id, url=img_url, display_order=idx))
            
    if "amenities" in update_data:
        amenities = update_data.pop("amenities")
        update_data["amenities"] = json.dumps(amenities)
        
    for key, value in update_data.items():
        setattr(l, key, value)
        
    db.commit()
    db.refresh(l)
    
    images_list = [img.url for img in l.images]
    amenities_list = json.loads(l.amenities) if l.amenities else []
    
    return schemas.ListingResponse(
        id=l.id,
        host_id=l.host_id,
        title=l.title,
        description=l.description or "",
        category=l.category or "",
        property_type=l.property_type or "Entire home",
        city=l.city or "",
        country=l.country or "",
        latitude=l.latitude or 0.0,
        longitude=l.longitude or 0.0,
        price_per_night=l.price_per_night,
        cleaning_fee=l.cleaning_fee or 0.0,
        service_fee=l.service_fee or 0.0,
        max_guests=l.max_guests,
        bedrooms=l.bedrooms,
        beds=l.beds,
        baths=l.baths,
        rating=l.rating or 5.0,
        reviews_count=l.reviews_count or 0,
        images=images_list,
        amenities=amenities_list,
        host=l.host
    )

@router.delete("/{listing_id}")
def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    l = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not l:
        raise HTTPException(status_code=404, detail="Listing not found")
    db.delete(l)
    db.commit()
    return {"message": "Listing deleted successfully"}
