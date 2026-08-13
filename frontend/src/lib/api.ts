import { Listing, Booking, Review, User } from "./data";

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
export async function fetchListings(queryParams?: Record<string, string>): Promise<Listing[]> {
  const q = new URLSearchParams(queryParams || {});
  return apiFetch<any[]>(`/api/listings?${q.toString()}`).then(res => res.map(mapBackendListing));
}

export async function fetchListing(id: string): Promise<Listing> {
  return apiFetch<any>(`/api/listings/${id}`).then(mapBackendListing);
}

export async function fetchHostListings(hostId: string): Promise<Listing[]> {
  // Since we haven't added a dedicated host listings endpoint, we fetch all and filter for now
  // In a real app we'd add `host_id` query param to `/api/listings`
  const all = await fetchListings();
  return all.filter(l => l.hostId === hostId);
}

export async function createListingAPI(listing: any): Promise<Listing> {
  const payload = {
    title: listing.title,
    description: listing.description,
    category: listing.category,
    property_type: listing.type,
    city: listing.city,
    country: listing.country,
    latitude: listing.lat || 0.0,
    longitude: listing.lng || 0.0,
    price_per_night: listing.price,
    cleaning_fee: 0.0,
    service_fee: 0.0,
    max_guests: listing.maxGuests,
    bedrooms: listing.bedrooms,
    beds: listing.beds,
    baths: listing.bathrooms,
    images: listing.images,
    amenities: listing.amenities
  };
  return apiFetch<any>(`/api/listings?host_id=${listing.hostId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(mapBackendListing);
}

export async function updateListingAPI(id: string, updates: Record<string, unknown>): Promise<Listing> {
  // Normalize frontend field names to backend schema
  const payload: Record<string, unknown> = { ...updates };
  if ((updates as any).price !== undefined) {
    payload.price_per_night = (updates as any).price;
    delete payload.price;
  }
  if ((updates as any).type !== undefined) {
    payload.property_type = (updates as any).type;
    delete payload.type;
  }
  if ((updates as any).maxGuests !== undefined) {
    payload.max_guests = (updates as any).maxGuests;
    delete payload.maxGuests;
  }
  if ((updates as any).bathrooms !== undefined) {
    payload.baths = (updates as any).bathrooms;
    delete payload.bathrooms;
  }

  return apiFetch<any>(`/api/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }).then(mapBackendListing);
}

export async function deleteListingAPI(id: string): Promise<void> {
  await apiFetch(`/api/listings/${id}`, { method: "DELETE" });
}

// --- Bookings ---
export async function fetchHostBookings(hostId: string): Promise<Booking[]> {
  return apiFetch<any[]>(`/api/bookings/host/${hostId}`).then(res => res.map(mapBackendBooking));
}

export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  return apiFetch<any[]>(`/api/bookings/my-trips?guest_id=${userId}`).then(res => res.map(mapBackendBooking));
}

export async function fetchBookedDates(listingId: string): Promise<string[][]> {
  const dates = await apiFetch<{check_in: string, check_out: string}[]>(`/api/bookings/${listingId}/dates`);
  return dates.map(d => [d.check_in, d.check_out]);
}

export async function createBookingAPI(booking: any): Promise<Booking> {
  const payload = {
    listing_id: booking.listingId,
    guest_id: booking.userId,
    check_in: booking.checkIn,
    check_out: booking.checkOut,
    guests_count: booking.guests
  };
  return apiFetch<any>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(mapBackendBooking);
}

export async function cancelBookingAPI(bookingId: string): Promise<Booking> {
  return apiFetch<any>(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" }).then(mapBackendBooking);
}

// --- Auth ---
export async function loginAPI(email: string, password: string): Promise<User> {
  return apiFetch<any>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then(mapBackendUser);
}

export async function fetchUsers(): Promise<User[]> {
  return apiFetch<any[]>("/api/auth/users").then(res => res.map(mapBackendUser));
}

// --- Wishlists ---
export async function fetchWishlists(userId: string): Promise<string[]> {
  return apiFetch<any[]>(`/api/wishlists/${userId}`).then(res => res.map(w => w.listing_id));
}

export async function toggleWishlistAPI(userId: string, listingId: string): Promise<{ added: boolean }> {
  const res = await apiFetch<{status: string}>(`/api/wishlists/toggle?user_id=${userId}&listing_id=${listingId}`, {
    method: "POST"
  });
  return { added: res.status === "added" };
}

// --- Reviews ---
export async function fetchReviews(listingId: string): Promise<Review[]> {
  return apiFetch<any[]>(`/api/reviews/${listingId}`).then(res => res.map(mapBackendReview));
}

export async function submitReviewAPI(review: any): Promise<Review> {
  const payload = {
    listing_id: review.listingId,
    user_id: review.userId,
    rating: review.rating,
    comment: review.comment
  };
  return apiFetch<any>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(mapBackendReview);
}

// --- Mappers ---
function mapBackendListing(l: any): Listing {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    location: `${l.city}, ${l.country}`,
    city: l.city,
    country: l.country,
    type: l.property_type,
    price: l.price_per_night,
    currency: "₹",
    rating: l.rating,
    reviewCount: l.reviews_count,
    images: l.images,
    amenities: l.amenities,
    maxGuests: l.max_guests,
    bedrooms: l.bedrooms,
    bathrooms: l.baths,
    beds: l.beds,
    hostId: l.host_id,
    hostName: l.host?.name || "Host",
    hostAvatar: l.host?.avatar_url || "",
    hostSince: l.host?.joined_date || "",
    isSuperhost: l.host?.is_superhost || false,
    isGuestFavorite: l.rating >= 4.8 && l.reviews_count > 5,
    category: l.category,
    coordinates: { lat: l.latitude, lng: l.longitude },
    bookedDates: []
  };
}

function mapBackendBooking(b: any): Booking {
  return {
    id: b.id,
    listingId: b.listing_id,
    userId: b.guest_id,
    checkIn: b.check_in,
    checkOut: b.check_out,
    guests: b.guests_count,
    totalPrice: b.total_price,
    status: b.status as any,
    createdAt: new Date().toISOString()
  };
}

function mapBackendUser(u: any): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar_url,
    isHost: u.role === "host",
    joinedYear: parseInt(u.joined_date?.match(/\d{4}/)?.[0] || "2024")
  };
}

function mapBackendReview(r: any): Review {
  return {
    id: r.id,
    listingId: r.listing_id,
    userId: r.user_id,
    userName: r.author_name,
    userAvatar: r.author_avatar,
    rating: r.rating,
    comment: r.comment,
    date: r.date
  };
}
