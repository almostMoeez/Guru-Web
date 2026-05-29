import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // APPETIZERS
  {
    id: 'a1',
    name: 'Truffle Scallops',
    description: 'Pan-seared sea scallops, parsnip purée, black truffle shavings, micro basil.',
    price: 24,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1532636875304-0c8fe119ca21?q=80&w=800&auto=format&fit=crop',
    calories: 220,
  },
  {
    id: 'a2',
    name: 'Heirloom Burrata',
    description: 'Creamy artisan burrata, blistered heirloom cherry tomatoes, wild arugula, extra virgin olive oil, toasted crostini.',
    price: 20,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=800&auto=format&fit=crop',
    calories: 340,
  },
  {
    id: 'a3',
    name: 'Wagyu Beef Tartare',
    description: 'Hand-cut A5 Wagyu, capers, shallots, Dijon, cured egg yolk, served with bone marrow toast.',
    price: 32,
    category: 'appetizers',
    badge: 'SIGNATURE',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    calories: 410,
  },
  {
    id: 'a4',
    name: 'Crispy Calamari Fritti',
    description: 'Tender calamari rings dusted in seasoned potato flour, flash-fried and served with charred lemon and saffron citrus aioli.',
    price: 18,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop',
    calories: 290,
  },

  // MAINS
  {
    id: 'm1',
    name: 'Dry-Aged Tomahawk Steak',
    description: '45-day dry-aged premium beef cut, flame-kissed over hickory charcoal, glazed with bone marrow butter and flaked sea salt.',
    price: 85,
    category: 'mains',
    badge: 'PREMIUM',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    calories: 890,
    customizable: true,
    customizationOptions: [
      {
        name: 'Preparation Temp',
        required: true,
        choices: [
          { name: 'Medium Rare' },
          { name: 'Medium' },
          { name: 'Medium Well' },
          { name: 'Rare' }
        ]
      },
      {
        name: 'Artisan Sauces',
        required: false,
        choices: [
          { name: 'Bone Marrow Butter', extraPrice: 0 },
          { name: 'Charred Chimichurri', extraPrice: 2 },
          { name: 'Truffle Red Wine Glaze', extraPrice: 5 }
        ]
      }
    ]
  },
  {
    id: 'm2',
    name: 'Pan-Roasted Atlantic Salmon',
    description: 'Crispy skin salmon filet, organic charred asparagus, saffron velouté, and fingerling heritage potatoes.',
    price: 38,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1485921325814-1541884f14e2?q=80&w=800&auto=format&fit=crop',
    calories: 550,
  },
  {
    id: 'm3',
    name: 'Wild Mushroom Risotto',
    description: 'Acquerello carnaroli rice slow-cooked with organic porcini broth, fresh chanterelles, shaved pecorino, and black truffle oil.',
    price: 29,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop',
    calories: 480,
  },

  // DESSERTS
  {
    id: 'd1',
    name: 'The "Brewed" Strawberry Nest',
    description: 'Crispy golden nest of spun angel hair pastry, layered with delicate white chocolate cardamom mousse, fresh ripe strawberry and organic mint.',
    price: 16,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
    badge: 'ICONIC',
    calories: 310,
  },
  {
    id: 'd2',
    name: 'Molten Belgian Chocolate Lava',
    description: 'Dark Belgian chocolate cake with a rich fluid core of roasted pistachio cream, served with Madagascar vanilla gelato.',
    price: 14,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    calories: 450,
  },
  {
    id: 'd3',
    name: 'Saffron Rose Milk Tres Leches',
    description: 'A decadent light sponge cake soaked in saffron infused three-milk mixture, topped with cardamom chantilly cream and dried rose petals.',
    price: 15,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
    calories: 380,
  },

  // DRINKS
  {
    id: 'dr1',
    name: 'Signature Gold Brew Mocha',
    description: 'Double espresso pulled with high-altitude Arabica beans, combined with micro-foamed milk, a hint of toasted hazelnut, and real gold leaf garnish.',
    price: 9,
    category: 'drinks',
    badge: 'SIGNATURE',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
    calories: 180,
    customizable: true,
    customizationOptions: [
      {
        name: 'Milk Choice',
        required: true,
        choices: [
          { name: 'Oat Milk', extraPrice: 1 },
          { name: 'Whole Milk', extraPrice: 0 },
          { name: 'Almond Milk', extraPrice: 1 }
        ]
      },
      {
        name: 'Size Option',
        required: true,
        choices: [
          { name: 'Regular' },
          { name: 'Large', extraPrice: 2 }
        ]
      }
    ]
  },
  {
    id: 'dr2',
    name: 'Guru Mint Citrus Cooler',
    description: 'Muddled fresh lime, wild spearmint, sparkling spring water and a secret touch of organic cane sugar bloom.',
    price: 8,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    calories: 45,
  },
  {
    id: 'dr3',
    name: 'Lavender Cold Drip Infusion',
    description: '12-hour slow-dripped single origin black coffee, aerated with premium nitrogen and lightly sweetened with organic lavender essence.',
    price: 10,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop',
    calories: 60,
    customizable: true,
    customizationOptions: [
      {
        name: 'Sweetener Level',
        required: true,
        choices: [
          { name: 'Regular Sweet' },
          { name: 'Half Sweet' },
          { name: 'Unsweetened' }
        ]
      }
    ]
  }
];
