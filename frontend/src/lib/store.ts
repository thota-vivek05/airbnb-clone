"use client";
import { Booking, Listing, User, LISTINGS, USERS } from "./data";
import {
  fetchListings,
  createListingAPI,
  updateListingAPI,
  deleteListingAPI,
  createBookingAPI,
  cancelBookingAPI,
  toggleWishlistAPI,
  fetchUserBookings,
  fetchWishlists,
} from "./api";

const STORAGE_KEYS = {
  BOOKINGS: "airbnb_bookings",
  WISHLISTS: "airbnb_wishlists",
  CURRENT_USER: "airbnb_current_user",
  LISTINGS: "airbnb_listings",
};

// --- Auth ---
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export const MOCK_USERS = [
  { id: "u1", name: "Sarah Thompson", email: "sarah@example.com", password: "password123", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop", isHost: false, joinedYear: 2021 },
  { id: "h1", name: "Priya Sharma", email: "priya@example.com", password: "password123", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e7?w=100&auto=format&fit=crop", isHost: true, joinedYear: 2019 },
  { id: "guest1", name: "Alex Johnson", email: "alex@example.com", password: "password123", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop", isHost: false, joinedYear: 2022 },
  { id: "host2", name: "Raj Patel", email: "raj@example.com", password: "password123", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop", isHost: true, joinedYear: 2020 },
];

export function loginUser(email: string, password: string): User | null {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    setCurrentUser(safeUser as User);
    return safeUser as User;
  }
  return null;
}

// --- Bookings ---
export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

  // Sync to FastAPI Backend SQLite DB asynchronously
  createBookingAPI({
    listingId: booking.listingId,
    userId: booking.userId,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    totalPrice: booking.totalPrice,
    status: booking.status,
    createdAt: booking.createdAt,
  }).catch((err) => console.warn("Backend API sync fallback:", err));
}

export function getUserBookings(userId: string): Booking[] {
  return getBookings().filter(b => b.userId === userId);
}

export function cancelBooking(bookingId: string): void {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = "cancelled";
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }

  // Sync cancel to FastAPI Backend
  cancelBookingAPI(bookingId).catch((err) => console.warn("Backend cancel sync fallback:", err));
}

// --- Wishlists ---
export function getWishlists(): string[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.WISHLISTS);
  return data ? JSON.parse(data) : [];
}

export function toggleWishlist(listingId: string, userId: string = "u1"): boolean {
  const wishlists = getWishlists();
  const idx = wishlists.indexOf(listingId);
  let added = false;
  if (idx === -1) {
    wishlists.push(listingId);
    localStorage.setItem(STORAGE_KEYS.WISHLISTS, JSON.stringify(wishlists));
    added = true;
  } else {
    wishlists.splice(idx, 1);
    localStorage.setItem(STORAGE_KEYS.WISHLISTS, JSON.stringify(wishlists));
    added = false;
  }

  // Sync wishlist toggle to FastAPI Backend DB
  toggleWishlistAPI(userId, listingId).catch((err) => console.warn("Backend wishlist sync fallback:", err));
  return added;
}

export function isWishlisted(listingId: string): boolean {
  return getWishlists().includes(listingId);
}

// --- Host Listings ---
export function getHostListings(): Listing[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.LISTINGS);
  return data ? JSON.parse(data) : [];
}

export function saveHostListing(listing: Listing): void {
  const listings = getHostListings();
  const idx = listings.findIndex(l => l.id === listing.id);
  if (idx !== -1) {
    listings[idx] = listing;
    updateListingAPI(listing.id, listing as any).catch((err) => console.warn("Backend listing update fallback:", err));
  } else {
    listings.push(listing);
    createListingAPI({
      title: listing.title,
      location: listing.location,
      city: listing.city,
      country: listing.country,
      type: listing.type,
      price: listing.price,
      currency: listing.currency,
      images: listing.images,
      description: listing.description,
      amenities: listing.amenities,
      maxGuests: listing.maxGuests,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      beds: listing.beds,
      category: listing.category,
      hostId: listing.hostId,
      lat: listing.coordinates?.lat,
      lng: listing.coordinates?.lng,
    }).catch((err) => console.warn("Backend listing create fallback:", err));
  }
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
}

export function deleteHostListing(listingId: string): void {
  const listings = getHostListings().filter(l => l.id !== listingId);
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));

  // Sync delete to FastAPI Backend DB
  deleteListingAPI(listingId).catch((err) => console.warn("Backend delete listing fallback:", err));
}

export function getAllListings(): Listing[] {
  const hostListings = getHostListings();
  return [...LISTINGS, ...hostListings];
}

// --- Date utils ---
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function parseDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const finish = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (current < finish) {
    dates.push(formatDateKey(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function isDateRangeAvailable(listing: Listing, checkIn: Date, checkOut: Date): boolean {
  const requestedDates = getDatesInRange(checkIn, checkOut);
  const bookings = getBookings().filter(b => b.listingId === listing.id && b.status !== "cancelled");
  const bookedDatesFromBookings = bookings.flatMap(b => getDatesInRange(parseDateKey(b.checkIn), parseDateKey(b.checkOut)));
  const seedBookedDates = listing.bookedDates.flatMap(([s, e]) => getDatesInRange(parseDateKey(s), parseDateKey(e)));
  const allBookedDates = new Set([...bookedDatesFromBookings, ...seedBookedDates]);
  return !requestedDates.some(d => allBookedDates.has(d));
}

export function getBookedDatesForListing(listingId: string): Date[] {
  const listing = getAllListings().find(l => l.id === listingId);
  if (!listing) return [];
  const bookings = getBookings().filter(b => b.listingId === listingId && b.status !== "cancelled");
  const bookedFromBookings = bookings.flatMap(b => getDatesInRange(parseDateKey(b.checkIn), parseDateKey(b.checkOut)));
  const bookedFromSeed = listing.bookedDates.flatMap(([s, e]) => getDatesInRange(parseDateKey(s), parseDateKey(e)));
  return [...new Set([...bookedFromBookings, ...bookedFromSeed])].map(d => parseDateKey(d));
}
