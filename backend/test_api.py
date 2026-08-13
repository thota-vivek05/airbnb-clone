import sys
import unittest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestBackendAPI(unittest.TestCase):
    def test_01_read_listings(self):
        response = client.get("/listings/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        print(f"GET /listings/ returned {len(data)} listings.")

    def test_02_read_single_listing(self):
        response = client.get("/listings/1")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], "1")
        self.assertIn("title", data)
        self.assertIn("coordinates", data)

    def test_03_login(self):
        response = client.post("/auth/login", json={"email": "priya@example.com", "password": "password123"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], "priya@example.com")
        self.assertTrue(data["isHost"])

    def test_04_wishlists(self):
        response = client.post("/wishlists/toggle", json={"userId": "u1", "listingId": "1"})
        self.assertEqual(response.status_code, 200)
        
        response = client.get("/users/u1/wishlists")
        self.assertEqual(response.status_code, 200)
        wishlists = response.json()
        self.assertIn("1", wishlists)

    def test_05_create_and_cancel_booking(self):
        booking_payload = {
            "listingId": "2",
            "userId": "u1",
            "checkIn": "2026-10-01",
            "checkOut": "2026-10-05",
            "guests": 2,
            "totalPrice": 16800,
            "status": "confirmed",
            "createdAt": "2026-08-13"
        }
        response = client.post("/bookings/", json=booking_payload)
        self.assertEqual(response.status_code, 200)
        booking = response.json()
        booking_id = booking["id"]

        # Read user bookings
        response = client.get("/users/u1/bookings/")
        self.assertEqual(response.status_code, 200)
        user_bookings = response.json()
        self.assertTrue(any(b["id"] == booking_id for b in user_bookings))

        # Cancel booking
        response = client.patch(f"/bookings/{booking_id}/cancel")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "cancelled")

    def test_06_host_listings(self):
        response = client.get("/hosts/h1/listings")
        self.assertEqual(response.status_code, 200)
        listings = response.json()
        self.assertIsInstance(listings, list)

if __name__ == "__main__":
    unittest.main()
