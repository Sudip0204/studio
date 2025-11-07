
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
  acceptedMaterials: string[];
};

export const recyclingCenters: RecyclingCenter[] = [
  {
    id: 'rc1',
    name: 'Mumbai Waste Management',
    address: 'A-21, MIDC Industrial Area, Andheri (E)',
    pincode: '400093',
    phone: '022-2832-5588',
    hours: { open: '08:00 AM', close: '06:00 PM' },
    rating: 4.6,
    reviews: 152,
    location: { lat: 19.1136, lng: 72.8697 },
    acceptedMaterials: ['Plastic', 'Paper', 'E-waste'],
  },
  {
    id: 'rc2',
    name: 'Green-First Recycling',
    address: 'Plot 42, Sector 19, Vashi, Navi Mumbai',
    pincode: '400703',
    phone: '022-2788-1234',
    hours: { open: '09:00 AM', close: '07:00 PM' },
    rating: 4.8,
    reviews: 210,
    location: { lat: 19.0683, lng: 72.9958 },
    acceptedMaterials: ['Plastic', 'Paper', 'Glass', 'Metal'],
  },
  {
    id: 'rc3',
    name: 'EcoRecycle Solutions',
    address: '15/B, Deonar Industrial Estate, Govandi',
    pincode: '400088',
    phone: '022-2550-7890',
    hours: { open: '08:30 AM', close: '05:30 PM' },
    rating: 4.3,
    reviews: 98,
    location: { lat: 19.043, lng: 72.9228 },
    acceptedMaterials: ['Plastic', 'Paper', 'Metal', 'Hazardous'],
  },
  {
    id: 'rc4',
    name: 'Thane E-Waste Collection',
    address: 'Wagle Industrial Estate, Road No. 28, Thane (W)',
    pincode: '400604',
    phone: '022-2582-4411',
    hours: { open: '10:00 AM', close: '05:00 PM' },
    rating: 4.7,
    reviews: 189,
    location: { lat: 19.197, lng: 72.9634 },
    acceptedMaterials: ['E-waste', 'Batteries'],
  },
  {
    id: 'rc5',
    name: 'Dombivli Recycling Hub',
    address: 'Plot J-7, MIDC, Dombivli (E)',
    pincode: '421203',
    phone: '0251-247-0055',
    hours: { open: '09:00 AM', close: '06:00 PM' },
    rating: 4.4,
    reviews: 76,
    location: { lat: 19.2215, lng: 73.085 },
    acceptedMaterials: ['Plastic', 'Paper', 'Glass'],
  },
  {
    id: 'rc6',
    name: 'Pune GreenCycle',
    address: 'Plot B-3, Chakan Industrial Area, Phase 2, Pune',
    pincode: '410501',
    phone: '020-6722-8899',
    hours: { open: '09:00 AM', close: '06:00 PM' },
    rating: 4.7,
    reviews: 250,
    location: { lat: 18.74, lng: 73.85 },
    acceptedMaterials: ['Plastic', 'Paper', 'E-waste', 'Metal'],
  },
  {
    id: 'rc7',
    name: 'Nagpur Eco-Recyclers',
    address: 'C-1, Butibori Industrial Area, Nagpur',
    pincode: '441122',
    phone: '0712-265-4321',
    hours: { open: '10:00 AM', close: '05:00 PM' },
    rating: 4.5,
    reviews: 120,
    location: { lat: 20.91, lng: 79.09 },
    acceptedMaterials: ['Paper', 'Metal', 'E-waste'],
  },
  {
    id: 'rc8',
    name: 'Nashik Waste Warriors',
    address: 'Plot 5, Ambad MIDC, Nashik',
    pincode: '422010',
    phone: '0253-238-1020',
    hours: { open: '09:30 AM', close: '06:30 PM' },
    rating: 4.6,
    reviews: 115,
    location: { lat: 19.96, lng: 73.78 },
    acceptedMaterials: ['Plastic', 'Glass', 'Batteries'],
  },
  {
    id: 'rc9',
    name: 'Hinjewadi IT Park E-Waste',
    address: 'Phase 1, Hinjewadi Rajiv Gandhi Infotech Park, Pune',
    pincode: '411057',
    phone: '020-4674-1100',
    hours: { open: '10:00 AM', close: '07:00 PM' },
    rating: 4.9,
    reviews: 310,
    location: { lat: 18.59, lng: 73.73 },
    acceptedMaterials: ['E-waste', 'Batteries', 'Cables'],
  },
   {
    id: 'rc10',
    name: 'Aurangabad Industrial Recyclers',
    address: 'M-10, Waluj MIDC, Aurangabad',
    pincode: '431136',
    phone: '0240-255-5555',
    hours: { open: '09:00 AM', close: '05:00 PM' },
    rating: 4.2,
    reviews: 65,
    location: { lat: 19.82, lng: 75.25 },
    acceptedMaterials: ['Metal', 'Plastic', 'Hazardous'],
  },
];
