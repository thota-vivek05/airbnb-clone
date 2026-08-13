import { Listing, Booking } from "./data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Generic fetch helper ---
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const errorBody = await res.text().catch(() => "Unknown error");
    throw new Error(`API Error ${res.status}: ${errorBody}`);
  }
  return res.json();
}

// --- Listings ---
export async function fetchListings(): Promise<Listing[]> {
  return apiFetch<Listing[]>("/listings/");
}

export async function fetchListing(id: string): Promise<Listing> {
  return apiFetch<Listing>(`/listings/${id}`);
}

export async function fetchHostListings(hostId: string): Promise<Listing[]> {
  return apiFetch<Listing[]>(`/hosts/${hostId}/listings`);
}

export async function createListingAPI(listing: {
  title: string;
  location: string;
  city: string;
  country: string;
  type: string;
  price: number;
  currency?: string;
  images: string[];
  description: string;
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  category: string;
  hostId: string;
  lat?: number;
  lng?: number;
}): Promise<Listing> {
  return apiFetch<Listing>("/listings/", {
    method: "POST",
    body: JSON.stringify({
      ...listing,
      currency: listing.currency || "₹",
      rating: 5.0,
      reviewCount: 0,
      lat: listing.lat || 20.5937,
      lng: listing.lng || 78.9629,
    }),
  });
}

export async function updateListingAPI(
  id: string,
  updates: Record<string, unknown>
): Promise<Listing> {
  return apiFetch<Listing>(`/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteListingAPI(id: string): Promise<void> {
  await apiFetch(`/listings/${id}`, { method: "DELETE" });
}

// --- Bookings ---
export async function fetchHostBookings(hostId: string): Promise<Booking[]> {
  return apiFetch<Booking[]>(`/hosts/${hostId}/bookings`);
}

export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  return apiFetch<Booking[]>(`/users/${userId}/bookings/`);
}

export async function createBookingAPI(booking: {
  listingId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status?: string;
  createdAt: string;
}): Promise<Booking> {
  return apiFetch<Booking>("/bookings/", {
    method: "POST",
    body: JSON.stringify({ ...booking, status: booking.status || "confirmed" }),
  });
}

export async function cancelBookingAPI(bookingId: string): Promise<Booking> {
  return apiFetch<Booking>(`/bookings/${bookingId}/cancel`, { method: "PATCH" });
}

// --- Auth ---
export async function loginAPI(email: string, password: string) {
  return apiFetch<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    isHost: boolean;
    joinedYear: number;
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// --- Wishlists ---
export async function fetchWishlists(userId: string): Promise<string[]> {
  return apiFetch<string[]>(`/users/${userId}/wishlists`);
}

export async function toggleWishlistAPI(
  userId: string,
  listingId: string
): Promise<{ added: boolean }> {
  return apiFetch<{ added: boolean }>("/wishlists/toggle", {
    method: "POST",
    body: JSON.stringify({ userId, listingId }),
  });
}
