from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import listings, bookings

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(listings.router)
app.include_router(bookings.router)

@app.get("/")
def read_root():
    return {"message": "Airbnb Clone FastAPI Backend is running!"}
