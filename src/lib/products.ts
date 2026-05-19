import { resolveImage } from "./images";

export type Collection = "Sneakers" | "Apparel" | "Streetwear" | "Activewear" | "Accessories";

export type ProductColor = { name: string; swatch: string; image: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  collection: Collection;
  price: number;
  salePrice: number | null;
  description: string;
  materials: string;
  material: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  isNew: boolean;
  isJustIn: boolean;
  inStock: boolean;
  tags: string[];
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  image: string;
};

const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "aeris-01-sneaker",
    name: "Aeris 01 Sneaker",
    brand: "LUMINA",
    category: "Sneakers",
    collection: "Sneakers",
    price: 185,
    salePrice: null,
    description:
      "Engineered for the streets. The Aeris 01 features a lightweight knit upper, responsive foam midsole, and full-length rubber outsole for all-day comfort and durability.",
    materials: "Knit upper, foam midsole, rubber outsole",
    material: "Knit upper, foam midsole, rubber outsole",
    features: [
      "Lightweight knit upper",
      "Responsive foam cushioning",
      "Full-length rubber outsole",
      "Breathable mesh panels",
    ],
    rating: 4.8,
    reviewsCount: 128,
    isNew: true,
    isJustIn: true,
    inStock: true,
    tags: ["new", "featured", "sneakers"],
    sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    colors: [
      { name: "White", swatch: "#FFFFFF", image: resolveImage("sneaker-6") },
      { name: "Black", swatch: "#111111", image: resolveImage("sneaker-5") },
    ],
    images: [resolveImage("sneaker-6"), resolveImage("sneaker-5")],
    image: resolveImage("sneaker-6"),
  },
  {
    id: "2",
    slug: "volt-runner-pro",
    name: "Volt Runner Pro",
    brand: "LUMINA",
    category: "Sneakers",
    collection: "Sneakers",
    price: 220,
    salePrice: 195,
    description:
      "Performance running shoe with carbon fiber plate and energy-return cushioning. Built for speed and long-distance comfort.",
    materials: "Engineered mesh, carbon plate, EVA foam",
    material: "Engineered mesh, carbon plate, EVA foam",
    features: [
      "Carbon fiber speed plate",
      "Energy-return foam",
      "Engineered mesh upper",
      "Durable rubber outsole",
    ],
    rating: 4.9,
    reviewsCount: 86,
    isNew: false,
    isJustIn: true,
    inStock: true,
    tags: ["running", "performance", "sale"],
    sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    colors: [
      { name: "Emerald", swatch: "#059669", image: resolveImage("sneaker-3") },
      { name: "Midnight", swatch: "#1e293b", image: resolveImage("sneaker-4") },
    ],
    images: [resolveImage("sneaker-3"), resolveImage("sneaker-4")],
    image: resolveImage("sneaker-3"),
  },
  {
    id: "3",
    slug: "trail-blazer-x",
    name: "Trail Blazer X",
    brand: "LUMINA",
    category: "Sneakers",
    collection: "Sneakers",
    price: 160,
    salePrice: null,
    description:
      "All-terrain trail shoe with waterproof membrane and aggressive lug pattern. Conquer any trail with confidence.",
    materials: "Synthetic leather, waterproof membrane, rubber",
    material: "Synthetic leather, waterproof membrane, rubber",
    features: [
      "Waterproof membrane",
      "Aggressive lug pattern",
      "Reinforced toe cap",
      "Ankle support collar",
    ],
    rating: 4.7,
    reviewsCount: 94,
    isNew: true,
    isJustIn: false,
    inStock: true,
    tags: ["trail", "outdoor", "waterproof"],
    sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    colors: [
      { name: "Olive", swatch: "#556b2f", image: resolveImage("sneaker-2") },
      { name: "Sand", swatch: "#d2b48c", image: resolveImage("sneaker-4") },
    ],
    images: [resolveImage("sneaker-2"), resolveImage("sneaker-4")],
    image: resolveImage("sneaker-2"),
  },
  {
    id: "4",
    slug: "classic-low-canvas",
    name: "Classic Low Canvas",
    brand: "LUMINA",
    category: "Sneakers",
    collection: "Sneakers",
    price: 95,
    salePrice: 79,
    description:
      "Minimalist canvas sneaker with vulcanized rubber sole. A timeless silhouette for everyday wear.",
    materials: "Canvas upper, vulcanized rubber sole",
    material: "Canvas upper, vulcanized rubber sole",
    features: ["Canvas upper", "Vulcanized rubber sole", "Cushioned footbed", "Minimalist design"],
    rating: 4.6,
    reviewsCount: 210,
    isNew: false,
    isJustIn: false,
    inStock: true,
    tags: ["classic", "canvas", "casual"],
    sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    colors: [
      { name: "White", swatch: "#FFFFFF", image: resolveImage("sneaker-1") },
      { name: "Black", swatch: "#111111", image: resolveImage("sneaker-3") },
    ],
    images: [resolveImage("sneaker-1"), resolveImage("sneaker-3")],
    image: resolveImage("sneaker-1"),
  },
  {
    id: "5",
    slug: "editorial-oversized-tee",
    name: "Editorial Oversized Tee",
    brand: "LUMINA",
    category: "T-Shirts",
    collection: "Apparel",
    price: 65,
    salePrice: null,
    description:
      "Premium heavyweight cotton tee with dropped shoulders and relaxed fit. Designed for editorial silhouettes.",
    materials: "100% organic cotton, 280gsm",
    material: "100% organic cotton, 280gsm",
    features: [
      "Heavyweight 280gsm cotton",
      "Dropped shoulders",
      "Relaxed oversized fit",
      "Pre-shrunk",
    ],
    rating: 4.8,
    reviewsCount: 156,
    isNew: true,
    isJustIn: true,
    inStock: true,
    tags: ["new", "apparel", "oversized"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Bone", swatch: "#f5f5dc", image: resolveImage("apparel-1") },
      { name: "Charcoal", swatch: "#36454f", image: resolveImage("apparel-2") },
    ],
    images: [resolveImage("apparel-1"), resolveImage("apparel-2")],
    image: resolveImage("apparel-1"),
  },
  {
    id: "6",
    slug: "tech-fleece-hoodie",
    name: "Tech Fleece Hoodie",
    brand: "LUMINA",
    category: "Hoodies",
    collection: "Apparel",
    price: 120,
    salePrice: 99,
    description:
      "Double-knit tech fleece hoodie with articulated sleeves and hidden zip pockets. Warm without the weight.",
    materials: "67% cotton, 33% polyester tech fleece",
    material: "67% cotton, 33% polyester tech fleece",
    features: [
      "Tech fleece double-knit",
      "Articulated sleeves",
      "Hidden zip pockets",
      "Adjustable hood",
    ],
    rating: 4.9,
    reviewsCount: 112,
    isNew: false,
    isJustIn: true,
    inStock: true,
    tags: ["hoodie", "tech-fleece", "layering"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Heather Grey", swatch: "#808080", image: resolveImage("apparel-3") },
      { name: "Deep Forest", swatch: "#013220", image: resolveImage("apparel-4") },
    ],
    images: [resolveImage("apparel-3"), resolveImage("apparel-4")],
    image: resolveImage("apparel-3"),
  },
  {
    id: "7",
    slug: "performance-jogger",
    name: "Performance Jogger",
    brand: "LUMINA",
    category: "Pants",
    collection: "Activewear",
    price: 110,
    salePrice: null,
    description:
      "Four-way stretch jogger with moisture-wicking fabric and zippered ankle cuffs. From gym to street.",
    materials: "88% polyester, 12% spandex",
    material: "88% polyester, 12% spandex",
    features: [
      "Four-way stretch",
      "Moisture-wicking",
      "Zippered ankle cuffs",
      "Hidden waistband pocket",
    ],
    rating: 4.7,
    reviewsCount: 78,
    isNew: true,
    isJustIn: false,
    inStock: true,
    tags: ["joggers", "activewear", "stretch"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", swatch: "#111111", image: resolveImage("apparel-2") },
      { name: "Navy", swatch: "#000080", image: resolveImage("apparel-4") },
    ],
    images: [resolveImage("apparel-2"), resolveImage("apparel-4")],
    image: resolveImage("apparel-2"),
  },
  {
    id: "8",
    slug: "merino-base-layer",
    name: "Merino Base Layer",
    brand: "LUMINA",
    category: "Base Layers",
    collection: "Activewear",
    price: 85,
    salePrice: null,
    description:
      "Ultra-fine merino wool base layer with natural temperature regulation and odor resistance.",
    materials: "100% merino wool, 18.5 micron",
    material: "100% merino wool, 18.5 micron",
    features: ["18.5 micron merino", "Temperature regulating", "Odor resistant", "Flatlock seams"],
    rating: 4.8,
    reviewsCount: 64,
    isNew: false,
    isJustIn: false,
    inStock: true,
    tags: ["merino", "base-layer", "outdoor"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Oatmeal", swatch: "#f5deb3", image: resolveImage("apparel-1") },
      { name: "Slate", swatch: "#708090", image: resolveImage("apparel-3") },
    ],
    images: [resolveImage("apparel-1"), resolveImage("apparel-3")],
    image: resolveImage("apparel-1"),
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbProduct(p: any): Product {
  const resolvedImages = Array.isArray(p.images)
    ? p.images.map((img: string) => resolveImage(img))
    : [];

  const resolvedColors = Array.isArray(p.colors)
    ? p.colors.map((c: Record<string, unknown>) => ({
        ...c,
        image: resolveImage(String(c.image)),
      }))
    : [];

  const mainImage = p.image
    ? resolveImage(p.image)
    : resolvedImages[0] || resolveImage("sneaker-1");

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: "LUMINA",
    category: p.category,
    collection: p.collection as Collection,
    price: Number(p.price),
    salePrice: p.sale_price ? Number(p.sale_price) : null,
    description: p.description || "",
    materials: p.materials || "",
    material: p.materials || "",
    features: Array.isArray(p.features) ? p.features : [],
    rating: p.rating ? Number(p.rating) : 4.8,
    reviewsCount: p.reviews_count ? Number(p.reviews_count) : 120,
    isNew: !!p.is_new,
    isJustIn: !!p.is_just_in,
    inStock: p.in_stock !== false,
    tags: Array.isArray(p.tags) ? p.tags : [p.category.toLowerCase()],
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    colors: resolvedColors,
    images: resolvedImages,
    image: mainImage,
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  return [...PRODUCTS];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const product = PRODUCTS.find((p) => p.slug === slug);
  return product ? { ...product } : null;
}
