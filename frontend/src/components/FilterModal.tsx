"use client";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const PROPERTY_TYPES = [
  { id: "all", label: "All types" },
  { id: "apartment", label: "Apartment" },
  { id: "villa", label: "Villa" },
  { id: "cottage", label: "Cottage" },
  { id: "bungalow", label: "Bungalow" },
  { id: "cabin", label: "Cabin" },
  { id: "treehouse", label: "Treehouse" },
  { id: "houseboat", label: "Houseboat" },
  { id: "tent", label: "Tent" },
  { id: "penthouse", label: "Penthouse" },
];

interface FilterModalProps {
  priceRange: [number, number];
  propertyType: string;
  onApply: (range: [number, number], type: string) => void;
  onClose: () => void;
}

export default function FilterModal({ priceRange, propertyType, onApply, onClose }: FilterModalProps) {
  const [range, setRange] = useState<[number, number]>(priceRange);
  const [type, setType] = useState(propertyType);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
          <h2 className="font-semibold">Filters</h2>
          <div className="w-9" />
        </div>

        {/* Price range */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-1">Price range</h3>
          <p className="text-sm text-gray-500 mb-4">Nightly prices before fees</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">₹{range[0].toLocaleString("en-IN")}</span>
            <span className="text-sm font-medium">₹{range[1].toLocaleString("en-IN")}</span>
          </div>
          <input
            type="range"
            min={0}
            max={20000}
            step={500}
            value={range[1]}
            onChange={e => setRange([range[0], parseInt(e.target.value)])}
            className="w-full accent-[#FF385C]"
          />
          <div className="flex gap-4 mt-4">
            <div className="flex-1 border border-gray-300 rounded-lg p-3">
              <div className="text-xs text-gray-500">Min price</div>
              <input
                type="number"
                value={range[0]}
                onChange={e => setRange([parseInt(e.target.value) || 0, range[1]])}
                className="w-full text-sm font-medium outline-none"
              />
            </div>
            <div className="flex-1 border border-gray-300 rounded-lg p-3">
              <div className="text-xs text-gray-500">Max price</div>
              <input
                type="number"
                value={range[1]}
                onChange={e => setRange([range[0], parseInt(e.target.value) || 20000])}
                className="w-full text-sm font-medium outline-none"
              />
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Property type */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4">Property type</h3>
          <div className="grid grid-cols-3 gap-3">
            {PROPERTY_TYPES.map(pt => (
              <button
                key={pt.id}
                onClick={() => setType(pt.id)}
                className={`border rounded-xl py-3 px-4 text-sm font-medium transition-colors text-left ${
                  type === pt.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => { setRange([0, 20000]); setType("all"); }}
            className="text-sm font-semibold underline hover:text-gray-600"
          >
            Clear all
          </button>
          <button
            onClick={() => onApply(range, type)}
            className="btn-primary rounded-lg px-6 py-3 text-sm"
          >
            <SlidersHorizontal className="w-4 h-4 inline mr-2" />
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
