import Link from "next/link";
import { Globe } from "lucide-react";

const FOOTER_LINKS = {
  Support: [
    "Help Centre",
    "Get help with a safety issue",
    "AirCover",
    "Anti-discrimination",
    "Disability support",
    "Cancellation options",
    "Report neighbourhood concern"
  ],
  Hosting: [
    "Airbnb your home",
    "Airbnb your experience",
    "Airbnb your service",
    "AirCover for Hosts",
    "Hosting resources",
    "Community forum",
    "Hosting responsibly",
    "Join a free hosting class",
    "Find a co-host",
    "Refer a host"
  ],
  Airbnb: [
    "2026 Summer Release",
    "Newsroom",
    "Careers",
    "Investors",
    "Airbnb.org emergency stays"
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#F7F7F7] border-t border-[#DDDDDD] text-[14px] w-full">
      <div className="px-6 md:px-12 lg:px-20 xl:px-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-b border-[#DDDDDD]">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-[600] text-[#222222] mb-4">{category}</h3>
              <ul className="space-y-4">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-[#222222] hover:underline hover:text-[#222222] transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-between py-6 gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[#222222]">
            <span>© 2026 Airbnb, Inc.</span>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Company details</a>
          </div>
          <div className="flex items-center gap-6 text-[#222222] font-[500]">
            <button className="flex items-center gap-2 hover:underline">
              <Globe className="w-[16px] h-[16px]" />
              English (IN)
            </button>
            <button className="hover:underline">₹ INR</button>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-gray-600 transition-colors" aria-label="Facebook">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors" aria-label="X">
                <svg className="w-[16px] h-[16px]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors" aria-label="Instagram">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
