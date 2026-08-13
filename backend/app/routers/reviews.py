from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
import uuid
from typing import List

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@router.get("/{listing_id}", response_model=List[schemas.ReviewResponse])
def get_reviews(listing_id: str, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.listing_id == listing_id).all()
    results = []
    for r in reviews:
        results.append(schemas.ReviewResponse(
            id=r.id,
            listing_id=r.listing_id,
            user_id=r.user_id or "",
            author_name=r.author_name or "",
            author_avatar=r.author_avatar or "",
            rating=r.rating,
            date=r.date or "",
            comment=r.comment or ""
        ))
    return results

@router.post("", response_model=schemas.ReviewResponse)
def create_review(payload: schemas.ReviewCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    import datetime
    new_r = models.Review(
        id=f"rev_{uuid.uuid4().hex[:8]}",
        listing_id=payload.listing_id,
        user_id=payload.user_id,
        author_name=user.name,
        author_avatar=user.avatar_url,
        rating=payload.rating,
        date=datetime.datetime.now().strftime("%B %Y"),
        comment=payload.comment
    )
    db.add(new_r)
    
    # update listing rating and count
    listing = db.query(models.Listing).filter(models.Listing.id == payload.listing_id).first()
    if listing:
        current_count = listing.reviews_count or 0
        current_rating = listing.rating or 5.0
        new_count = current_count + 1
        listing.rating = round(((current_rating * current_count) + payload.rating) / new_count, 2)
        listing.reviews_count = new_count
        
    db.commit()
    db.refresh(new_r)
    return schemas.ReviewResponse(
        id=new_r.id,
        listing_id=new_r.listing_id,
        user_id=new_r.user_id,
        author_name=new_r.author_name,
        author_avatar=new_r.author_avatar,
        rating=new_r.rating,
        date=new_r.date,
        comment=new_r.comment
    )
