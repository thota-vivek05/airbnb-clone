import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb - Vacation rentals, cabins, beach houses & more",
  description: "Find holiday rentals, cabins, beach houses, unique homes and experiences around the world - all made possible by hosts on Airbnb.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#222222",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "12px 20px",
              fontWeight: "500",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
