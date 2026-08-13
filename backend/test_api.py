import sys
import unittest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestBackendAPI(unittest.TestCase):
    def test_01_read_listings(self):
        response = client.get("/api/listings")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        print(f"GET /listings/ returned {len(data)} listings.")

    def test_02_read_single_listing(self):
        response = client.get("/api/listings/1")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], "1")
        self.assertIn("title", data)
        self.assertIn("images", data)

    def test_03_login(self):
        response = client.post("/api/auth/login", json={"email": "priya@example.com", "password": "password123"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], "priya@example.com")
        self.assertEqual(data.get("role"), "host")

    def test_04_wishlists(self):
        response = client.post("/api/wishlists/toggle?user_id=u1&listing_id=1")
        self.assertEqual(response.status_code, 200)

        response = client.get("/api/wishlists/u1")
        self.assertEqual(response.status_code, 200)
        wishlists = response.json()
        self.assertTrue(any(w["listing_id"] == "1" for w in wishlists))

    def test_05_create_and_cancel_booking(self):
        booking_payload = {
            "listing_id": "2",
            "guest_id": "u1",
            "check_in": "2026-10-01",
            "check_out": "2026-10-05",
            "guests_count": 2
        }
        response = client.post("/api/bookings", json=booking_payload)
        self.assertEqual(response.status_code, 200)
        booking = response.json()
        booking_id = booking["id"]

        # Read user bookings
        response = client.get("/api/bookings/my-trips?guest_id=u1")
        self.assertEqual(response.status_code, 200)
        user_bookings = response.json()
        self.assertTrue(any(b["id"] == booking_id for b in user_bookings))

        # Cancel booking
        response = client.patch(f"/api/bookings/{booking_id}/cancel")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "cancelled")

    def test_06_listings_root(self):
        response = client.get("/api/listings")
        self.assertEqual(response.status_code, 200)
        listings = response.json()
        self.assertIsInstance(listings, list)

if __name__ == "__main__":
    unittest.main()
