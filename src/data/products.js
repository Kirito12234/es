import {
  Armchair,
  Baby,
  BookOpen,
  Camera,
  CarFront,
  Dumbbell,
  Footprints,
  Gamepad2,
  Gem,
  HeartPulse,
  Headphones,
  Keyboard,
  LaptopMinimal,
  Leaf,
  Martini,
  Monitor,
  PackageCheck,
  Pill,
  Shirt,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Utensils,
} from 'lucide-react'

const baseCatalogProducts = [
  {
    title: 'HAVIT HV-G92 Gamepad',
    price: 120,
    oldPrice: 160,
    rating: 5,
    reviews: 88,
    sale: 40,
    icon: Gamepad2,
    accentClassName: 'text-[#db4444]',
    productSlug: 'havit-hv-g92-gamepad',
  },
  {
    title: 'AK-900 Wired Keyboard',
    price: 960,
    oldPrice: 1160,
    rating: 4,
    reviews: 75,
    sale: 35,
    icon: Keyboard,
    accentClassName: 'text-[#5f8a1b]',
    productSlug: 'ak-900-wired-keyboard',
  },
  {
    title: 'IPS LCD Gaming Monitor',
    price: 370,
    oldPrice: 400,
    rating: 5,
    reviews: 99,
    sale: 30,
    icon: Monitor,
    accentClassName: 'text-[#db4444]',
    productSlug: 'ips-lcd-gaming-monitor',
  },
  {
    title: 'S-Series Comfort Chair',
    price: 375,
    oldPrice: 400,
    rating: 4,
    reviews: 99,
    sale: 25,
    icon: Armchair,
    accentClassName: 'text-[#9d9d9d]',
    productSlug: 's-series-comfort-chair',
  },
  {
    title: 'Jr. Zoom Soccer Boots',
    price: 1160,
    oldPrice: 1400,
    rating: 5,
    reviews: 35,
    sale: 25,
    icon: Footprints,
    accentClassName: 'text-[#d9ab00]',
    productSlug: 'jr-zoom-soccer-boots',
  },
  {
    title: 'The north coat',
    price: 260,
    oldPrice: 360,
    rating: 5,
    reviews: 65,
    icon: Shirt,
    accentClassName: 'text-[#f26f8b]',
    productSlug: 'the-north-coat',
  },
  {
    title: 'Gucci duffle bag',
    price: 960,
    oldPrice: 1160,
    rating: 4,
    reviews: 65,
    sale: 15,
    icon: ShoppingBag,
    accentClassName: 'text-[#7b6b62]',
    productSlug: 'gucci-duffle-bag',
  },
  {
    title: 'RGB liquid CPU Cooler',
    price: 160,
    oldPrice: 170,
    rating: 4,
    reviews: 65,
    icon: Headphones,
    accentClassName: 'text-[#7e57c2]',
    productSlug: 'rgb-liquid-cpu-cooler',
  },
  {
    title: 'Small BookSelf',
    price: 360,
    rating: 5,
    reviews: 65,
    icon: BookOpen,
    accentClassName: 'text-[#c68b55]',
    productSlug: 'small-bookshelf',
  },
  {
    title: 'Breed Dry Dog Food',
    price: 100,
    rating: 3,
    reviews: 35,
    icon: PackageCheck,
    accentClassName: 'text-[#7d5e4c]',
    productSlug: 'breed-dry-dog-food',
  },
  {
    title: 'CANON EOS DSLR Camera',
    price: 360,
    rating: 4,
    reviews: 95,
    icon: Camera,
    accentClassName: 'text-[#454545]',
    productSlug: 'canon-eos-dslr-camera',
  },
  {
    title: 'ASUS FHD Gaming Laptop',
    price: 700,
    rating: 5,
    reviews: 325,
    sale: 35,
    icon: LaptopMinimal,
    accentClassName: 'text-[#0087b3]',
    productSlug: 'asus-fhd-gaming-laptop',
  },
  {
    title: 'Curology Product Set',
    price: 500,
    rating: 4,
    reviews: 145,
    icon: Sparkles,
    accentClassName: 'text-[#7251d0]',
    productSlug: 'curology-product-set',
  },
  {
    title: 'Kids Electric Car',
    price: 960,
    rating: 5,
    reviews: 65,
    sale: 30,
    icon: CarFront,
    accentClassName: 'text-[#db4444]',
    productSlug: 'kids-electric-car',
  },
  {
    title: 'Jr. Zoom Soccer Cleats',
    price: 1160,
    rating: 4,
    reviews: 35,
    icon: Footprints,
    accentClassName: 'text-[#c4cf00]',
    productSlug: 'jr-zoom-soccer-cleats',
  },
  {
    title: 'GP11 Shooter USB Gamepad',
    price: 660,
    rating: 5,
    reviews: 55,
    sale: 20,
    icon: Gamepad2,
    accentClassName: 'text-[#1c1c1c]',
    productSlug: 'gp11-shooter-usb-gamepad',
  },
  {
    title: 'Quilted Satin Jacket',
    price: 660,
    rating: 4,
    reviews: 55,
    sale: 25,
    icon: Shirt,
    accentClassName: 'text-[#47634d]',
    productSlug: 'quilted-satin-jacket',
  },
  {
    title: 'Floral Summer Midi Dress',
    price: 145,
    oldPrice: 190,
    rating: 5,
    reviews: 72,
    sale: 24,
    icon: Gem,
    accentClassName: 'text-[#d84c7f]',
    productSlug: 'floral-summer-midi-dress',
  },
  {
    title: 'Classic Oxford Shirt',
    price: 85,
    oldPrice: 110,
    rating: 4,
    reviews: 58,
    sale: 23,
    icon: Shirt,
    accentClassName: 'text-[#315b7d]',
    productSlug: 'classic-oxford-shirt',
  },
  {
    title: 'Noise Canceling Earbuds',
    price: 220,
    oldPrice: 280,
    rating: 5,
    reviews: 142,
    sale: 21,
    icon: Headphones,
    accentClassName: 'text-[#0f766e]',
    productSlug: 'noise-canceling-earbuds',
  },
  {
    title: 'Ceramic Dinnerware Set',
    price: 130,
    oldPrice: 165,
    rating: 4,
    reviews: 48,
    sale: 21,
    icon: Utensils,
    accentClassName: 'text-[#8b5e34]',
    productSlug: 'ceramic-dinnerware-set',
  },
  {
    title: 'Digital Blood Pressure Monitor',
    price: 75,
    oldPrice: 95,
    rating: 5,
    reviews: 64,
    sale: 21,
    icon: HeartPulse,
    accentClassName: 'text-[#dc2626]',
    productSlug: 'digital-blood-pressure-monitor',
  },
  {
    title: 'Adjustable Dumbbell Pair',
    price: 240,
    oldPrice: 310,
    rating: 5,
    reviews: 83,
    sale: 23,
    icon: Dumbbell,
    accentClassName: 'text-[#334155]',
    productSlug: 'adjustable-dumbbell-pair',
  },
  {
    title: 'Soft Baby Activity Mat',
    price: 68,
    oldPrice: 90,
    rating: 4,
    reviews: 51,
    sale: 24,
    icon: Baby,
    accentClassName: 'text-[#f59e0b]',
    productSlug: 'soft-baby-activity-mat',
  },
  {
    title: 'Organic Pantry Bundle',
    price: 54,
    oldPrice: 70,
    rating: 4,
    reviews: 39,
    sale: 23,
    icon: Leaf,
    accentClassName: 'text-[#3f7d20]',
    productSlug: 'organic-pantry-bundle',
  },
  {
    title: 'Vitamin C Glow Serum',
    price: 42,
    oldPrice: 58,
    rating: 5,
    reviews: 118,
    sale: 28,
    icon: SprayCan,
    accentClassName: 'text-[#e11d48]',
    productSlug: 'vitamin-c-glow-serum',
  },
  {
    title: 'First Aid Essentials Kit',
    price: 36,
    oldPrice: 48,
    rating: 5,
    reviews: 44,
    sale: 25,
    icon: Pill,
    accentClassName: 'text-[#2563eb]',
    productSlug: 'first-aid-essentials-kit',
  },
  {
    title: 'Hydration Running Bottle',
    price: 32,
    oldPrice: 44,
    rating: 4,
    reviews: 67,
    sale: 27,
    icon: Martini,
    accentClassName: 'text-[#0891b2]',
    productSlug: 'hydration-running-bottle',
  },
]

const gallerySets = [
  ['bg-[#f5f5f5]', 'bg-[#fff2f2]', 'bg-[#f2f7ff]', 'bg-[#fef6e7]'],
  ['bg-[#f5f5f5]', 'bg-[#eef8ef]', 'bg-[#f8f2ff]', 'bg-[#fff8ea]'],
  ['bg-[#f5f5f5]', 'bg-[#fff1f1]', 'bg-[#eef7fb]', 'bg-[#f8f7ff]'],
  ['bg-[#f5f5f5]', 'bg-[#f5f0eb]', 'bg-[#eef4f7]', 'bg-[#fbf4ff]'],
]

const colorSets = [
  ['#A0BCE0', '#DB4444'],
  ['#4C8C2B', '#111111'],
  ['#DB4444', '#111111'],
  ['#9D9D9D', '#DB4444'],
]

const imageBySlug = {
  'havit-hv-g92-gamepad':
    'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=700&q=80',
  'ak-900-wired-keyboard':
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
  'ips-lcd-gaming-monitor':
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80',
  's-series-comfort-chair':
    'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=700&q=80',
  'jr-zoom-soccer-boots':
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
  'the-north-coat':
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
  'gucci-duffle-bag':
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80',
  'rgb-liquid-cpu-cooler':
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=700&q=80',
  'small-bookshelf':
    'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=700&q=80',
  'breed-dry-dog-food':
    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=700&q=80',
  'canon-eos-dslr-camera':
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80',
  'asus-fhd-gaming-laptop':
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80',
  'curology-product-set':
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80',
  'kids-electric-car':
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=700&q=80',
  'jr-zoom-soccer-cleats':
    'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=700&q=80',
  'gp11-shooter-usb-gamepad':
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=700&q=80',
  'quilted-satin-jacket':
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
  'floral-summer-midi-dress':
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80',
  'classic-oxford-shirt':
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
  'noise-canceling-earbuds':
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
  'ceramic-dinnerware-set':
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=80',
  'digital-blood-pressure-monitor':
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80',
  'adjustable-dumbbell-pair':
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80',
  'soft-baby-activity-mat':
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80',
  'organic-pantry-bundle':
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80',
  'vitamin-c-glow-serum':
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
  'first-aid-essentials-kit':
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80',
  'hydration-running-bottle':
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=700&q=80',
}

const brandByCategory = {
  Electronics: 'Voltix',
  "Women's Fashion": 'Modea',
  "Men's Fashion": 'TailorCo',
  'Home & Lifestyle': 'Nestory',
  Medicine: 'MediCare',
  'Sports & Outdoor': 'Stride',
  "Baby's & Toys": 'TinyJoy',
  'Groceries & Pets': 'FreshPaw',
  'Health & Beauty': 'GlowLab',
  Storefront: 'RedCart',
}

const detailPresets = {
  'havit-hv-g92-gamepad': {
    category: 'Electronics',
    description:
      'PlayStation 5 controller skin with premium grip and responsive layout for fast reaction time during long sessions.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  'ak-900-wired-keyboard': {
    category: 'Electronics',
    description:
      'Mechanical-feel keyboard built for focused work, stable response, and a durable daily setup.',
    sizes: ['87', '96', '104'],
  },
  'ips-lcd-gaming-monitor': {
    category: 'Electronics',
    description:
      'Sharp IPS panel with a clean desk presence, bright color performance, and smooth gameplay support.',
    sizes: ['24"', '27"', '32"'],
  },
  'gucci-duffle-bag': {
    category: "Women's Fashion",
    description:
      'Luxury weekender bag with bold structure, roomy storage, and a premium carry profile.',
    sizes: ['S', 'M', 'L'],
  },
  'asus-fhd-gaming-laptop': {
    category: 'Electronics',
    description:
      'Performance laptop tuned for modern games, fast multitasking, and a travel-ready form factor.',
    sizes: ['14"', '15"', '16"'],
  },
  's-series-comfort-chair': {
    category: 'Home & Lifestyle',
    description:
      'Ergonomic chair with cushioned support, a clean home-office shape, and daily comfort for long work sessions.',
    sizes: ['Standard', 'Wide'],
  },
  'jr-zoom-soccer-boots': {
    category: 'Sports & Outdoor',
    description:
      'Lightweight soccer boots with grippy traction and a secure fit for training or weekend matches.',
    sizes: ['38', '40', '42', '44'],
  },
  'the-north-coat': {
    category: "Men's Fashion",
    description:
      'Warm structured coat with a clean everyday fit, smooth lining, and reliable cold-weather coverage.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'rgb-liquid-cpu-cooler': {
    category: 'Electronics',
    description:
      'Quiet cooling unit with RGB lighting, stable thermal performance, and a polished desktop build profile.',
    sizes: ['120mm', '240mm', '360mm'],
  },
  'small-bookshelf': {
    category: 'Home & Lifestyle',
    description:
      'Compact bookshelf with a tidy profile for books, decor, and everyday living-room organization.',
    sizes: ['2 tier', '3 tier', '4 tier'],
  },
  'breed-dry-dog-food': {
    category: 'Groceries & Pets',
    description:
      'Balanced dry food blend for daily pet nutrition, easy storage, and dependable mealtime portions.',
    sizes: ['2kg', '5kg', '10kg'],
  },
  'canon-eos-dslr-camera': {
    category: 'Electronics',
    description:
      'Reliable DSLR camera with crisp image capture, beginner-friendly controls, and a durable travel body.',
    sizes: ['Body', '18-55mm kit'],
  },
  'curology-product-set': {
    category: 'Health & Beauty',
    description:
      'Daily skin-care set with cleanser, treatment, and moisturizer for a simple glow-focused routine.',
    sizes: ['Travel', 'Standard'],
  },
  'kids-electric-car': {
    category: "Baby's & Toys",
    description:
      'Rechargeable ride-on car with playful styling, simple controls, and safe indoor-outdoor fun.',
    sizes: ['Toddler', 'Kids'],
  },
  'jr-zoom-soccer-cleats': {
    category: 'Sports & Outdoor',
    description:
      'Junior soccer cleats with firm footing, lightweight support, and a responsive sprint feel.',
    sizes: ['34', '36', '38', '40'],
  },
  'gp11-shooter-usb-gamepad': {
    category: 'Electronics',
    description:
      'USB gamepad with responsive buttons, comfortable grip, and easy plug-in play for PC gaming.',
    sizes: ['Standard'],
  },
  'quilted-satin-jacket': {
    category: "Women's Fashion",
    description:
      'Soft satin jacket with quilted texture, relaxed fit, and a polished layer for day-to-night outfits.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  'floral-summer-midi-dress': {
    category: "Women's Fashion",
    description:
      'Breathable floral midi dress with a flattering waistline, soft drape, and easy warm-weather styling.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  'classic-oxford-shirt': {
    category: "Men's Fashion",
    description:
      'Crisp Oxford shirt with a tailored everyday fit for office days, dinners, and weekend layering.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'noise-canceling-earbuds': {
    category: 'Electronics',
    description:
      'Wireless earbuds with active noise reduction, clear calls, and a compact charging case.',
    sizes: ['Standard'],
  },
  'ceramic-dinnerware-set': {
    category: 'Home & Lifestyle',
    description:
      'Durable ceramic dinnerware set with plates and bowls ready for everyday meals and hosting.',
    sizes: ['12 pcs', '18 pcs', '24 pcs'],
  },
  'digital-blood-pressure-monitor': {
    category: 'Medicine',
    description:
      'Easy-read blood pressure monitor with automatic cuff inflation and memory for daily health tracking.',
    sizes: ['Standard cuff', 'Large cuff'],
  },
  'adjustable-dumbbell-pair': {
    category: 'Sports & Outdoor',
    description:
      'Space-saving adjustable dumbbells for home strength training with quick weight selection.',
    sizes: ['20kg pair', '30kg pair'],
  },
  'soft-baby-activity-mat': {
    category: "Baby's & Toys",
    description:
      'Padded activity mat with soft textures and toy loops for tummy time, crawling, and play.',
    sizes: ['Standard', 'Large'],
  },
  'organic-pantry-bundle': {
    category: 'Groceries & Pets',
    description:
      'Curated grocery bundle with organic pantry staples for quick meals and weekly restocking.',
    sizes: ['Small', 'Family'],
  },
  'vitamin-c-glow-serum': {
    category: 'Health & Beauty',
    description:
      'Brightening vitamin C serum designed for a lightweight morning routine and smoother-looking skin.',
    sizes: ['30ml', '50ml'],
  },
  'first-aid-essentials-kit': {
    category: 'Medicine',
    description:
      'Compact first aid kit with bandages, antiseptic care, and everyday essentials for home or travel.',
    sizes: ['Home', 'Travel'],
  },
  'hydration-running-bottle': {
    category: 'Sports & Outdoor',
    description:
      'Leak-resistant running bottle with a comfortable grip and quick-flow cap for outdoor workouts.',
    sizes: ['500ml', '750ml'],
  },
}

const buildDefaultDescription = (title) =>
  `${title} is part of the connected storefront catalog with a cleaner product detail flow, working cart actions, and purchase-ready controls.`

export const catalogProducts = baseCatalogProducts.map((product, index) => {
  const detailPreset = detailPresets[product.productSlug] ?? {}
  const galleryBackgrounds = detailPreset.galleryBackgrounds ?? gallerySets[index % gallerySets.length]
  const colors = (detailPreset.colors ?? colorSets[index % colorSets.length]).map((value) => ({
    value,
    ringClassName: value === '#111111' ? 'ring-black/80' : 'ring-black/10',
  }))

  return {
    ...product,
    category: detailPreset.category ?? 'Storefront',
    description: detailPreset.description ?? buildDefaultDescription(product.title),
    sizes: detailPreset.sizes ?? ['XS', 'S', 'M', 'L'],
    colors,
    media: [
      {
        id: `${product.productSlug}-image`,
        kind: 'image',
        name: product.title,
        url: imageBySlug[product.productSlug],
      },
    ],
    thumbnailUrl: imageBySlug[product.productSlug],
    brand: detailPreset.brand ?? brandByCategory[detailPreset.category ?? 'Storefront'],
    galleryBackgrounds,
    stockLabel: 'In Stock',
    breadcrumbs: ['Home', detailPreset.category ?? 'Storefront'],
  }
})

const productsBySlug = new Map(catalogProducts.map((product) => [product.productSlug, product]))

export function getProductBySlug(slug = '') {
  return productsBySlug.get(slug) ?? null
}

export function getRelatedProducts(slug = '', limit = 4) {
  return catalogProducts.filter((product) => product.productSlug !== slug).slice(0, limit)
}
