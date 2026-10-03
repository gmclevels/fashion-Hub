import { CategoryType } from '../types';

export interface CategoryDefinition {
  name: CategoryType;
  description: string;
  subcategories: string[];
  iconName: string;
  imageTag: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    name: 'Fashion Materials',
    description: 'Authentic Ankara wax prints, rich Swiss lace, Senator fabrics, cashmere, and high-grade tailoring textiles.',
    iconName: 'Scissors',
    imageTag: 'fabrics',
    subcategories: [
      'Ankara',
      'Lace',
      'Senator materials',
      'Suit materials',
      'Cotton',
      'Linen',
      'Denim',
      'Silk',
      "Children's fabrics",
      'T-shirt materials',
      'Other fabrics'
    ]
  },
  {
    name: 'Clothing',
    description: "Bespoke Native wear, agbada, kaftans, modern dresses, formal shirts, suits, and children's ready-to-wear.",
    iconName: 'Shirt',
    imageTag: 'clothing',
    subcategories: [
      "Men's clothing",
      "Women's clothing",
      "Boys' clothing",
      "Girls' clothing",
      "Babies' clothing",
      'T-shirts',
      'Trousers',
      'Shirts',
      'Dresses',
      'Native wear',
      'Suits',
      'Jackets',
      "Children's wear"
    ]
  },
  {
    name: 'Shoes',
    description: 'Bespoke Nigerian handcrafted leather shoes, loafers, sneakers, ceremonial sandals, and everyday footwear.',
    iconName: 'Footprints',
    imageTag: 'shoes',
    subcategories: [
      "Men's shoes",
      "Women's shoes",
      "Boys' shoes",
      "Girls' shoes",
      "Children's shoes",
      'Sneakers',
      'Sandals',
      'Slippers',
      'Formal shoes',
      'Boots'
    ]
  },
  {
    name: 'Bags',
    description: 'Designer leather totes, school bags, executive laptop carriers, travel duffels, and everyday backpacks.',
    iconName: 'Briefcase',
    imageTag: 'bags',
    subcategories: [
      'Handbags',
      'School bags',
      'Backpacks',
      'Laptop bags',
      'Travel bags',
      "Men's bags",
      "Children's bags",
      'Fashion bags'
    ]
  },
  {
    name: 'Accessories',
    description: 'Traditional coral beads, hand-stitched leather belts, luxury watches, caps, fila, and fashion sunglasses.',
    iconName: 'Sparkles',
    imageTag: 'accessories',
    subcategories: [
      'Belts',
      'Caps',
      'Hats',
      'Jewelry',
      'Watches',
      'Sunglasses',
      'Scarves',
      'Other accessories'
    ]
  }
];

export const ALL_CATEGORY_NAMES: CategoryType[] = CATEGORIES.map(c => c.name);
