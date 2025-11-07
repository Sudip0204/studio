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
];
