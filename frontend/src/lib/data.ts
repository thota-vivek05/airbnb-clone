export interface Listing {
  id: string;
  title: string;
  location: string;
  city: string;
  country: string;
  type: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostSince: string;
  isSuperhost: boolean;
  isGuestFavorite: boolean;
  category: string;
  coordinates: { lat: number; lng: number };
  bookedDates: string[][];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isHost: boolean;
  joinedYear: number;
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const CATEGORIES = [
  { id: "all", label: "All", icon: "🌍" },
  { id: "beachfront", label: "Beachfront", icon: "🏖️" },
  { id: "amazing-pools", label: "Amazing pools", icon: "🏊" },
  { id: "cabins", label: "Cabins", icon: "🏡" },
  { id: "trending", label: "Trending", icon: "📈" },
  { id: "mansions", label: "Mansions", icon: "🏰" },
  { id: "tiny-homes", label: "Tiny homes", icon: "🏠" },
  { id: "countryside", label: "Countryside", icon: "🌿" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "luxe", label: "Luxe", icon: "✨" },
  { id: "national-parks", label: "National parks", icon: "🌲" },
  { id: "farms", label: "Farms", icon: "🚜" },
  { id: "castles", label: "Castles", icon: "🏯" },
  { id: "treehouses", label: "Treehouses", icon: "🌳" },
];

export const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Luxury Villa with Private Pool in Goa",
    location: "Calangute, Goa",
    city: "Goa",
    country: "India",
    type: "Entire villa",
    price: 8500,
    currency: "₹",
    rating: 4.97,
    reviewCount: 128,
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
    ],
    description:
      "Experience the ultimate luxury in this stunning villa with a private infinity pool overlooking the Arabian Sea. The villa features 4 elegantly designed bedrooms, a fully equipped gourmet kitchen, spacious living areas, and a stunning outdoor deck perfect for sunbathing and entertaining. Located just 5 minutes from Calangute Beach, this is your perfect Goa escape.",
    amenities: ["WiFi", "Private pool", "Air conditioning", "Kitchen", "Free parking", "TV", "Washing machine", "BBQ grill", "Ocean view", "Beach access"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 4,
    beds: 5,
    hostId: "h1",
    hostName: "Priya Sharma",
    hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e7?w=100&auto=format&fit=crop",
    hostSince: "2019",
    isSuperhost: true,
    isGuestFavorite: true,
    category: "amazing-pools",
    coordinates: { lat: 15.5489, lng: 73.7534 },
    bookedDates: [["2024-12-20", "2024-12-27"], ["2025-01-10", "2025-01-15"]],
  },
  {
    id: "2",
    title: "Beachfront Cottage in Kovalam",
    location: "Kovalam, Kerala",
    city: "Kovalam",
    country: "India",
    type: "Entire cottage",
    price: 4200,
    currency: "₹",
    rating: 4.89,
    reviewCount: 87,
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop",
    ],
    description:
      "Wake up to the sound of waves in this charming beachfront cottage in Kerala. Enjoy direct beach access, stunning sunset views, and the serene backwater experience. Perfect for couples seeking a romantic getaway.",
    amenities: ["WiFi", "Beach access", "Air conditioning", "Kitchen", "Sea view", "Hammock", "Outdoor shower", "Fishing equipment"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: 2,
    hostId: "h2",
    hostName: "Rahul Nair",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
    hostSince: "2020",
    isSuperhost: false,
    isGuestFavorite: true,
    category: "beachfront",
    coordinates: { lat: 8.3988, lng: 76.9782 },
    bookedDates: [["2024-12-25", "2025-01-02"]],
  },
  {
    id: "3",
    title: "Modern Flat in Bandra, Mumbai",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    country: "India",
    type: "Entire apartment",
    price: 5700,
    currency: "₹",
    rating: 4.96,
    reviewCount: 203,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop",
    ],
    description:
      "Stay in the heart of Mumbai's most trendy neighborhood. This beautifully designed flat is steps away from Bandra's famous cafes, restaurants, and the sea link. Perfect for business travelers and urban explorers.",
    amenities: ["WiFi", "Air conditioning", "Kitchen", "Washing machine", "TV", "Gym access", "Elevator", "Security"],
    maxGuests: 3,
    bedrooms: 2,
    bathrooms: 2,
    beds: 2,
    hostId: "h3",
    hostName: "Anjali Mehta",
    hostAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop",
    hostSince: "2018",
    isSuperhost: true,
    isGuestFavorite: true,
    category: "design",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    bookedDates: [],
  },
  {
    id: "4",
    title: "Heritage Haveli in Jaipur",
    location: "Old City, Jaipur",
    city: "Jaipur",
    country: "India",
    type: "Entire home",
    price: 6800,
    currency: "₹",
    rating: 4.93,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop",
    ],
    description:
      "Step back in time and experience Rajasthani royalty in this beautifully restored heritage haveli. With intricate frescoes, a rooftop terrace, traditional courtyard, and courteous staff, this is an unforgettable stay in the Pink City.",
    amenities: ["WiFi", "Air conditioning", "Rooftop terrace", "Traditional meals", "Cultural tours", "Courtyard", "Heritage architecture", "City view"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    beds: 4,
    hostId: "h4",
    hostName: "Vikram Singh",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
    hostSince: "2017",
    isSuperhost: true,
    isGuestFavorite: false,
    category: "mansions",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    bookedDates: [["2024-12-15", "2024-12-20"]],
  },
  {
    id: "5",
    title: "Treehouse Retreat in Munnar",
    location: "Munnar, Kerala",
    city: "Munnar",
    country: "India",
    type: "Treehouse",
    price: 3900,
    currency: "₹",
    rating: 4.98,
    reviewCount: 72,
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
    ],
    description:
      "Nestle among the treetops in this magical treehouse surrounded by tea plantations and misty mountains. Enjoy breathtaking views, fresh mountain air, and complete seclusion from the city hustle.",
    amenities: ["WiFi", "Mountain view", "Tea plantation walks", "Bonfire", "Nature trails", "Breakfast included", "Bird watching"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    hostId: "h2",
    hostName: "Rahul Nair",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
    hostSince: "2020",
    isSuperhost: false,
    isGuestFavorite: true,
    category: "treehouses",
    coordinates: { lat: 10.0889, lng: 77.0595 },
    bookedDates: [],
  },
  {
    id: "6",
    title: "Houseboat on Dal Lake, Srinagar",
    location: "Dal Lake, Srinagar",
    city: "Srinagar",
    country: "India",
    type: "Houseboat",
    price: 7200,
    currency: "₹",
    rating: 4.91,
    reviewCount: 94,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1468824297222-8db5b5c38fdb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop",
    ],
    description:
      "Float on the legendary Dal Lake in a traditional Kashmiri houseboat. Enjoy shikara rides, traditional Wazwan cuisine, and stunning mountain reflections on the lake. The most unique stay in India.",
    amenities: ["Shikara ride", "Traditional meals included", "Mountain view", "Lake view", "Fishing", "Cultural experience", "Butler service"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: 2,
    hostId: "h5",
    hostName: "Farooq Abdullah",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
    hostSince: "2016",
    isSuperhost: true,
    isGuestFavorite: true,
    category: "trending",
    coordinates: { lat: 34.0837, lng: 74.7973 },
    bookedDates: [["2025-01-05", "2025-01-10"]],
  },
  {
    id: "7",
    title: "Forest Cabin in Coorg",
    location: "Madikeri, Coorg",
    city: "Coorg",
    country: "India",
    type: "Cabin",
    price: 5100,
    currency: "₹",
    rating: 4.88,
    reviewCount: 63,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop",
    ],
    description:
      "Escape to this stunning forest cabin surrounded by coffee plantations and lush rainforests. Coorg's cool climate, misty mornings, and aromatic coffee make this an ideal retreat for nature lovers.",
    amenities: ["WiFi", "Coffee plantation walk", "Fireplace", "Forest view", "Hammock", "Bonfire", "Hiking trails", "Breakfast included"],
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2,
    beds: 3,
    hostId: "h6",
    hostName: "Shreya Gowda",
    hostAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop",
    hostSince: "2021",
    isSuperhost: false,
    isGuestFavorite: false,
    category: "cabins",
    coordinates: { lat: 12.4244, lng: 75.7382 },
    bookedDates: [],
  },
  {
    id: "8",
    title: "Beachside Bungalow in Pondicherry",
    location: "Promenade Beach, Pondicherry",
    city: "Pondicherry",
    country: "India",
    type: "Entire bungalow",
    price: 4600,
    currency: "₹",
    rating: 4.94,
    reviewCount: 118,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
    ],
    description:
      "A charming French colonial-style bungalow steps from the promenade beach. Experience the unique blend of French and Tamil culture, excellent local cuisine, and the peaceful sea breeze.",
    amenities: ["WiFi", "Beach access", "Air conditioning", "Kitchen", "Courtyard", "Bicycle rental", "French ambiance", "Sea view"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    beds: 3,
    hostId: "h7",
    hostName: "Marie Dupont",
    hostAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop",
    hostSince: "2019",
    isSuperhost: true,
    isGuestFavorite: true,
    category: "beachfront",
    coordinates: { lat: 11.9416, lng: 79.8083 },
    bookedDates: [["2024-12-28", "2025-01-03"]],
  },
  {
    id: "9",
    title: "Luxury Penthouse in Bengaluru",
    location: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    country: "India",
    type: "Entire penthouse",
    price: 9800,
    currency: "₹",
    rating: 4.95,
    reviewCount: 47,
    images: [
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop",
    ],
    description:
      "Live like royalty in this ultra-modern penthouse atop one of Bengaluru's most iconic buildings. Floor-to-ceiling windows offer panoramic city views, while the rooftop terrace with jacuzzi takes luxury to another level.",
    amenities: ["WiFi", "Rooftop jacuzzi", "Air conditioning", "Smart home", "City panorama", "Gym access", "Pool", "Concierge", "Parking"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 3,
    beds: 2,
    hostId: "h8",
    hostName: "Arjun Reddy",
    hostAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop",
    hostSince: "2020",
    isSuperhost: false,
    isGuestFavorite: false,
    category: "luxe",
    coordinates: { lat: 12.9784, lng: 77.6408 },
    bookedDates: [],
  },
  {
    id: "10",
    title: "Desert Camp in Jaisalmer",
    location: "Sam Sand Dunes, Jaisalmer",
    city: "Jaisalmer",
    country: "India",
    type: "Tent",
    price: 3200,
    currency: "₹",
    rating: 4.90,
    reviewCount: 201,
    images: [
      "https://images.unsplash.com/photo-1531795210866-1c5f1b4e2eda?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop",
    ],
    description:
      "Sleep under a million stars in this luxury desert camp on the golden Sam Sand Dunes. Enjoy camel rides, live folk music, traditional Rajasthani dinner, and unrivaled sunrise views over the desert.",
    amenities: ["Camel ride", "Folk performances", "Traditional meals", "Bonfire", "Stargazing", "Desert safari", "Photography spots"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    hostId: "h4",
    hostName: "Vikram Singh",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
    hostSince: "2017",
    isSuperhost: true,
    isGuestFavorite: true,
    category: "countryside",
    coordinates: { lat: 26.9124, lng: 70.5680 },
    bookedDates: [],
  },
  {
    id: "11",
    title: "Farmhouse Stay in Nashik Vineyard",
    location: "Nashik, Maharashtra",
    city: "Nashik",
    country: "India",
    type: "Entire farmhouse",
    price: 6200,
    currency: "₹",
    rating: 4.87,
    reviewCount: 55,
    images: [
      "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536301027200-d3e2d1ccc1ab?w=800&auto=format&fit=crop",
    ],
    description:
      "Wake up to vineyards as far as the eye can see in this charming farmhouse in Nashik's wine country. Enjoy wine tasting tours, farm-to-table meals, and the peaceful countryside lifestyle.",
    amenities: ["WiFi", "Vineyard tour", "Wine tasting", "Farm meals", "Swimming pool", "Cycling", "Picnic area", "Outdoor dining"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    beds: 5,
    hostId: "h9",
    hostName: "Neha Kulkarni",
    hostAvatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&auto=format&fit=crop",
    hostSince: "2022",
    isSuperhost: false,
    isGuestFavorite: false,
    category: "farms",
    coordinates: { lat: 20.0114, lng: 73.7902 },
    bookedDates: [],
  },
  {
    id: "12",
    title: "Eco Lodge in Kaziranga Forests",
    location: "Kaziranga, Assam",
    city: "Kaziranga",
    country: "India",
    type: "Eco lodge",
    price: 4800,
    currency: "₹",
    rating: 4.92,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&auto=format&fit=crop",
    ],
    description:
      "A sustainable eco-lodge at the edge of the famous Kaziranga National Park. Wake up to elephant herds, go on jeep safaris, and experience the unmatched biodiversity of Northeast India.",
    amenities: ["Jeep safari", "Wildlife viewing", "Nature walks", "Organic meals", "Solar power", "Rainwater harvesting", "Bird watching"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: 2,
    hostId: "h10",
    hostName: "Dipak Borah",
    hostAvatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&auto=format&fit=crop",
    hostSince: "2021",
    isSuperhost: false,
    isGuestFavorite: true,
    category: "national-parks",
    coordinates: { lat: 26.6638, lng: 93.3729 },
    bookedDates: [],
  },
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    listingId: "1",
    userId: "u1",
    userName: "Sarah Thompson",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop",
    rating: 5,
    comment: "Absolutely stunning property! The pool view was incredible and Priya was an amazing host. Would definitely come back!",
    date: "November 2024",
  },
  {
    id: "r2",
    listingId: "1",
    userId: "u2",
    userName: "James Chen",
    userAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&auto=format&fit=crop",
    rating: 5,
    comment: "Perfect villa for a family vacation. The amenities were top-notch and the location was ideal. Highly recommended!",
    date: "October 2024",
  },
  {
    id: "r3",
    listingId: "1",
    userId: "u3",
    userName: "Aisha Patel",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop",
    rating: 4,
    comment: "Beautiful place, great host. Minor issues with the AC in one room but overall a fantastic stay.",
    date: "October 2024",
  },
  {
    id: "r4",
    listingId: "2",
    userId: "u1",
    userName: "Sarah Thompson",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop",
    rating: 5,
    comment: "The most peaceful place I've ever stayed. Falling asleep to the sound of waves was magical.",
    date: "September 2024",
  },
  {
    id: "r5",
    listingId: "3",
    userId: "u4",
    userName: "Rohan Desai",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop",
    rating: 5,
    comment: "Perfect location in Bandra. The flat is modern, clean, and has everything you need. Anjali is very responsive.",
    date: "November 2024",
  },
];

export const USERS: User[] = [
  {
    id: "u1",
    name: "Sarah Thompson",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop",
    isHost: false,
    joinedYear: 2021,
  },
  {
    id: "h1",
    name: "Priya Sharma",
    email: "priya@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e7?w=100&auto=format&fit=crop",
    isHost: true,
    joinedYear: 2019,
  },
];
