from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/login", response_model=schemas.UserBase)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == payload.email,
        models.User.password == payload.password
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    return schemas.UserBase(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        avatar_url=user.avatar_url or "",
        is_superhost=user.is_superhost or False,
        joined_date=user.joined_date or ""
    )

@router.get("/users", response_model=List[schemas.UserBase])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return [schemas.UserBase(
        id=u.id, name=u.name, email=u.email, role=u.role,
        avatar_url=u.avatar_url or "", is_superhost=u.is_superhost or False,
        joined_date=u.joined_date or ""
    ) for u in users]
