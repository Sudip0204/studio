export type RecyclingCenter = {
  id: string;
  name: string;
  address: string;
  pincode: string;
  phone: string;
  hours: {
    open: string;
    close: string;
  };
  rating: number;
  reviews: number;
  location: {
    lat: number;
    lng: number;
  };
};

export const recyclingCenters: RecyclingCenter[] = [
  {
    id: "rc1",
    name: "Green Future Recycling",
    address: "123 Recycle Rd, Eco-Town",
    pincode: "12345",
    phone: "555-0101",
    hours: { open: "08:00 AM", close: "05:00 PM" },
    rating: 4.5,
    reviews: 128,
    location: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: "rc2",
    name: "Eco-Cycle Solutions",
    address: "456 Sustainability Ave, Green City",
    pincode: "54321",
    phone: "555-0102",
    hours: { open: "09:00 AM", close: "06:00 PM" },
    rating: 4.8,
    reviews: 256,
    location: { lat: 40.7328, lng: -74.0160 },
  },
  {
    id: "rc3",
    name: "Planet Savers Center",
    address: "789 Earth Blvd, Natureville",
    pincode: "67890",
    phone: "555-0103",
    hours: { open: "07:00 AM", close: "04:00 PM" },
    rating: 4.2,
    reviews: 98,
    location: { lat: 40.7028, lng: -73.9960 },
  },
    {
    id: "rc4",
    name: "The Reuse Hub",
    address: "101 Refabricate St, Circularton",
    pincode: "13579",
    phone: "555-0104",
    hours: { open: "10:00 AM", close: "07:00 PM" },
    rating: 4.9,
    reviews: 312,
    location: { lat: 40.7528, lng: -74.0260 },
  },
];