import { Leaf, Bot, Map, ShoppingBag, Award, BarChart2, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type WasteDetail = {
  title: string;
  content: string | string[];
};

export type WasteCategory = {
  id: string;
  title: string;
  Icon: LucideIcon;
  color: string;
  description: string;
  details: WasteDetail[];
  imageId: string;
};

const findImageUrl = (id: string) => PlaceHolderImages.find(p => p.id === id)?.imageUrl || '';

export const wasteCategories: WasteCategory[] = [
  {
    id: "organic",
    title: "Organic Waste (Biodegradable)",
    Icon: Leaf,
    color: "text-green-600",
    imageId: "organic-waste",
    description: "Waste that decomposes naturally, turning into nutrient-rich soil.",
    details: [
      { title: "Examples", content: ["Food scraps (vegetable peels, fruit waste, eggshells)", "Garden waste (leaves, grass clippings)", "Uncoated paper and cardboard", "Natural fibers (cotton, wool)"] },
      { title: "Disposal Methods", content: ["Home composting (guide available in 'Interactive Tools')", "Municipal composting facilities", "Vermicomposting (with worms)", "Biogas generation"] },
      { title: "Recycling Process", content: "Organic waste is collected and allowed to decompose in controlled conditions. This process, which takes 4-6 months, creates compost, a natural fertilizer used in gardening and agriculture." },
      { title: "Do's and Don'ts", content: ["✅ DO: Keep a separate bin for organic waste.", "✅ DO: Remove stickers from fruits.", "❌ DON'T: Mix with plastic or metal.", "❌ DON'T: Include meat or dairy in home composts (attracts pests)."] },
      { title: "External Resources", content: ["Find local composting facilities", "Video tutorial on home composting"] },
    ],
  },
  {
    id: "plastic",
    title: "Plastic Waste",
    Icon: Bot,
    color: "text-blue-600",
    imageId: "plastic-waste",
    description: "Synthetic polymers that are a major environmental concern but can often be recycled.",
    details: [
        { title: "Types of Plastics (Recycling Code)", content: [
            "**(1) PET/PETE:** Water/soda bottles",
            "**(2) HDPE:** Milk jugs, detergent bottles",
            "**(3) PVC:** Pipes, credit cards (rarely recycled)",
            "**(4) LDPE:** Plastic bags, squeeze bottles",
            "**(5) PP:** Yogurt containers, bottle caps",
            "**(6) PS (Styrofoam):** Disposable cups (rarely recycled)",
            "**(7) Other:** Mixed plastics",
        ] },
        { title: "Disposal Methods", content: ["Check local recycling centers for accepted plastic types", "Specialized collection programs", "Upcycling projects"] },
        { title: "Recycling Process", content: "Plastics are sorted by type, cleaned, shredded, melted, and formed into pellets. These pellets are then used to manufacture new products." },
        { title: "Environmental Impact", content: "Most plastics take 450-1000 years to decompose and are a leading cause of ocean pollution and microplastic contamination." },
        { title: "External Resources", content: ["Learn about plastic-free initiatives", "Guide to plastic recycling symbols"] },
    ],
  },
  {
    id: "paper",
    title: "Paper & Cardboard",
    Icon: Users,
    color: "text-yellow-600",
    imageId: "paper-waste",
    description: "Cellulose-based materials that are widely recyclable.",
    details: [
      { title: "Examples", content: ["Newspapers, magazines, office paper", "Cardboard boxes, paper bags", "Books and catalogs"] },
      { title: "Disposal Methods", content: ["Curbside recycling programs", "Paper recycling centers", "Shred for composting"] },
      { title: "Recycling Process", content: "Paper is turned into a pulp, de-inked, screened, cleaned, and then pressed and dried to create new paper products. Paper can typically be recycled 5-7 times." },
      { title: "Preparation Tips", content: ["Flatten cardboard boxes", "Keep paper clean and dry", "Remove plastic windows from envelopes"] },
      { title: "Non-Recyclable Paper", content: ["Greasy pizza boxes", "Wax-coated paper (e.g., paper cups)", "Paper towels and tissues", "Receipts (thermal paper)"] },
      { title: "External Resources", content: ["Watch how paper is recycled"] },
    ],
  },
   {
    id: "glass",
    title: "Glass",
    Icon: Bot,
    color: "text-teal-600",
    imageId: "glass-waste",
    description: "A 100% recyclable material that can be recycled infinitely without loss of quality.",
    details: [
      { title: "Examples", content: ["Beverage bottles (wine, beer)", "Food jars (jam, pickles)", "Glass containers"] },
      { title: "Color Separation", content: "For recycling, glass is often sorted by color: Clear (Flint), Green, and Brown (Amber)." },
      { title: "Disposal Methods", content: ["Bottle banks at local collection points", "Curbside collection", "Specialized glass recycling facilities"] },
      { title: "Recycling Process", content: "Glass is sorted, crushed into 'cullet', melted at 1500°C, and then molded into new glass products, saving significant energy." },
      { title: "Safety Tip", content: "Handle broken glass with extreme care. Check with your local facility before recycling broken items." },
      { title: "External Resources", content: ["The journey of a glass bottle"] },
    ],
  },
  {
    id: "metal",
    title: "Metal (Aluminum & Steel)",
    Icon: BarChart2,
    color: "text-gray-600",
    imageId: "metal-waste",
    description: "Highly valuable and infinitely recyclable materials.",
    details: [
      { title: "Examples", content: ["Aluminum cans (soda, beer)", "Steel food cans (soups, vegetables)", "Aluminum foil (clean)", "Empty aerosol cans"] },
      { title: "Disposal Methods", content: ["Curbside recycling", "Scrap metal dealers", "Metal recycling centers"] },
      { title: "Recycling Process", content: "Metals are sorted (often with magnets for steel), shredded, melted, purified, and cast into ingots to create new products." },
      { title: "Environmental Benefits", content: "Recycling aluminum saves 95% of the energy needed to make it from raw materials. For steel, the saving is around 60%." },
      { title: "Preparation", content: "Rinse cans and remove any paper or plastic labels if possible." },
      { title: "External Resources", content: ["Learn about the metal recycling industry"] },
    ],
  },
    {
    id: "ewaste",
    title: "E-Waste (Electronic Waste)",
    Icon: Bot,
    color: "text-indigo-600",
    imageId: "ewaste",
    description: "The world's fastest-growing waste stream, containing both valuable and hazardous materials.",
    details: [
      { title: "Examples", content: ["Mobile phones, tablets, computers", "TVs, monitors, printers", "All types of batteries", "Cables and chargers", "Small appliances"] },
      { title: "Disposal Methods", content: ["**Never put in regular trash.**", "Designated e-waste collection centers", "Manufacturer take-back programs", "Community e-waste drives"] },
      { title: "Recycling Process", content: "Involves manual dismantling, separation of components, recovery of precious metals (gold, silver), and safe disposal of hazardous parts like batteries and leaded glass." },
      { title: "Data Security", content: "Always wipe your personal data from devices before disposal. Many certified recyclers offer data destruction services." },
      { title: "External Resources", content: ["Find a certified e-waste recycler near you"] },
    ],
  },
  {
    id: "hazardous",
    title: "Hazardous Waste",
    Icon: Award,
    color: "text-red-600",
    imageId: "hazardous-waste",
    description: "Waste that requires special handling due to its toxic, corrosive, or flammable nature.",
    details: [
      { title: "Examples", content: ["Batteries (alkaline, lithium)", "Paints and solvents", "Motor oil, pesticides", "Medical waste (needles, old medicine)", "Fluorescent bulbs (CFLs)"] },
      { title: "Disposal Methods", content: ["**Never pour down drains or put in regular trash.**", "Household hazardous waste (HHW) facilities", "Special collection events", "Pharmacy take-back programs for medicines"] },
      { title: "Safety Precautions", content: ["Keep in original, sealed containers", "Store away from children and pets", "Wear protective gear when handling"] },
      { title: "Environmental Impact", content: "Improper disposal can severely contaminate soil and groundwater, posing a risk to ecosystems and human health." },
      { title: "External Resources", content: ["Your local government's HHW disposal guidelines"] },
    ],
  },
  {
    id: "textile",
    title: "Textile Waste",
    Icon: ShoppingBag,
    color: "text-pink-600",
    imageId: "textile-waste",
    description: "Clothing, footwear, and other fabric materials.",
    details: [
      { title: "Examples", content: ["Old clothing, bed linens, towels", "Shoes and bags", "Fabric scraps"] },
      { title: "Disposal Methods", content: ["Donate wearable items to charity", "Textile recycling bins", "Upcycle into new items (e.g., cleaning rags, quilts)", "Animal shelters may accept old towels and blankets"] },
      { title: "Recycling Process", content: "Textiles are sorted by material, shredded into fibers, and then re-spun into yarn to manufacture new textiles, insulation, or stuffing." },
      { title: "Impact of Fast Fashion", content: "The fast fashion industry is a major contributor to textile waste and environmental degradation. Consider buying second-hand or from sustainable brands." },
      { title: "External Resources", content: ["Find textile recycling organizations"] },
    ],
  },
  {
    id: "construction",
    title: "Construction & Demolition (C&D) Waste",
    Icon: Map,
    color: "text-orange-600",
    imageId: "construction-waste",
    description: "Waste generated from building, renovation, and demolition projects.",
    details: [
      { title: "Examples", content: ["Concrete, bricks, tiles", "Wood and lumber", "Metals (rebar, pipes)", "Insulation materials", "Drywall"] },
      { title:al Methods", content: ["C&D recycling facilities", "Salvage yards for reusable materials", "Landfills as a last resort"] },
      { title: "Recycling Process", content: "Materials are sorted and processed for reuse. Concrete can be crushed for aggregate, wood can be chipped for mulch, and metals are recycled." },
      { title: "Reuse Opportunities", content: "Architectural salvage yards are great places to find unique items like doors, windows, and fixtures for reuse in other projects." },
      { title: "External Resources", content: ["Resources on green building practices"] },
    ],
  },
];
