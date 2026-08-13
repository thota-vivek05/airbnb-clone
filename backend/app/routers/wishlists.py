from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(prefix="/api/wishlists", tags=["Wishlists"])

@router.get("/{user_id}", response_model=List[schemas.WishlistResponse])
def get_user_wishlists(user_id: str, db: Session = Depends(get_db)):
    wishlists = db.query(models.Wishlist).filter(models.Wishlist.user_id == user_id).all()
    results = []
    for w in wishlists:
        results.append(schemas.WishlistResponse(
            id=w.id,
            user_id=w.user_id,
            listing_id=w.listing_id,
            created_at=w.created_at.isoformat() if w.created_at else ""
        ))
    return results

@router.post("/toggle")
def toggle_wishlist(user_id: str, listing_id: str, db: Session = Depends(get_db)):
    existing = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.listing_id == listing_id
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "removed"}
    else:
        new_w = models.Wishlist(user_id=user_id, listing_id=listing_id)
        db.add(new_w)
        db.commit()
        return {"status": "added"}
