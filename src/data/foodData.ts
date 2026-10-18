export interface DogriFoodItem {
  id: string;
  name: string;
  dogriName: string;
  category: 'street_food' | 'main_course' | 'sweet' | 'traditional_snack';
  tasteProfile: string;
  description: string;
  keyIngredients: string[];
  historicalStory: string;
  approxPrice: string;
  dietary: 'pure_veg' | 'jain_friendly';
  iconicShops: {
    shopName: string;
    location: string;
    landmark: string;
    rating: number;
    recommendedOrder: string;
    mapQuery?: string;
  }[];
  heroImage: string;
}

export const DOGRI_FOOD_ITEMS: DogriFoodItem[] = [
  {
    id: 'kaladi-kulcha',
    name: 'Kaladi Kulcha',
    dogriName: 'कलाड़ी कुल्चा',
    category: 'street_food',
    tasteProfile: 'Crisp outside, molten cheesy center, savory & tangy',
    description: 'Indigenous aged cheese made from cow/buffalo milk by Gujjar-Bakerwal nomads, pan-grilled on a cast-iron skillet until crisp, stuffed inside a fluffy local bread with spicy mint-anardana chutney.',
    keyIngredients: ['Authentic Himalayan Kaladi cheese', 'Local Kashmiri Kulcha / Pav', 'Himalayan red chili', 'Kala Namak', 'Wild mint & anardana chutney'],
    historicalStory: 'Referred to as the "Mozzarella of Kashmir & Jammu", Kaladi has been naturally cured in the Shivalik and Pir Panjal highlands for over 400 years.',
    approxPrice: '₹60 – ₹100 per plate',
    dietary: 'pure_veg',
    heroImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    iconicShops: [
      {
        shopName: "Prem Sweets & Kaladi Point",
        location: 'Old Hospital Road / Gole Market, Gandhi Nagar',
        landmark: 'Opposite Apsara Cinema road',
        rating: 4.8,
        recommendedOrder: 'Double Butter Crispy Kaladi Kulcha with Green Chutney',
      },
      {
        shopName: "Pahalwan's Sweet & Snacks",
        location: 'Gole Market, Gandhi Nagar & Bari Brahmana',
        landmark: 'Near Gole Market Roundabout',
        rating: 4.7,
        recommendedOrder: 'Tawa Roasted Kaladi with Multi-grain Bread',
      },
      {
        shopName: "Billu Di Hatti",
        location: 'Panjtirthi Chowk, Old Jammu',
        landmark: 'Near Raj Bhavan road',
        rating: 4.6,
        recommendedOrder: 'Traditional Spicy Panjtirthi Kaladi',
      },
    ],
  },
  {
    id: 'jammu-rajma-chawal',
    name: 'Bhaderwah Rajma Chawal with Anardana',
    dogriName: 'राजमा चावल कने अनरदाना',
    category: 'main_course',
    tasteProfile: 'Velvety, rich, spiced with ginger and Kashmiri aroma, tangy edge',
    description: 'Small, intensely flavorful red kidney beans harvested in Bhaderwah and Marwah valleys, slow-simmered in desi ghee with dry ginger and sund, served with steamed basmati rice and tangy wild pomegranate chutney.',
    keyIngredients: ['GI Bhaderwah Rajma', 'Desi Ghee', 'Sonth (dry ginger)', 'Degi mirch', 'Wild pomegranate (anardana) seeds', 'Mustard oil', 'Pure Kashmiri basmati'],
    historicalStory: 'A culinary staple of the Dogra kings. Bhaderwah rajma has earned national GI-tag status for its tender skin, creamy melt, and zero need for artificial thickeners.',
    approxPrice: '₹90 – ₹150 per thali',
    dietary: 'pure_veg',
    heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    iconicShops: [
      {
        shopName: 'Rawal Pindi Sweet & Dhabha',
        location: 'Raghunath Bazaar, Old City',
        landmark: 'Near Raghunath Temple entrance',
        rating: 4.9,
        recommendedOrder: 'Special Ghee Rajma Chawal with Anardana & Boondi Raita',
      },
      {
        shopName: 'Pehalwan Food Court',
        location: 'NH-44 Highway, Bari Brahmana',
        landmark: 'Opposite Industrial Estate',
        rating: 4.7,
        recommendedOrder: 'Classic Dogra Rajma Platter with Desi Makkhan',
      },
      {
        shopName: 'Sharma Vaishno Dhaba',
        location: 'Opposite Jammu Tawi Railway Station',
        landmark: 'Platform 1 approach road',
        rating: 4.5,
        recommendedOrder: 'Quick Pilgrim Rajma Chawal Thali',
      },
    ],
  },
  {
    id: 'dogri-ambal',
    name: 'Dogri Ambal',
    dogriName: 'डोगरी अम्बल',
    category: 'main_course',
    tasteProfile: 'Intricate sweet, sour and spiced with jaggery and tamarind',
    description: 'The crowning jewel of the traditional Dogra feast (Dhaam). Yellow pumpkin or sweet gourds simmered in pure mustard oil, flavored with methi dana, red chilies, imli (tamarind), and gur (jaggery).',
    keyIngredients: ['Ripe Pumpkin / Squash', 'Pure Mustard Oil', 'Fenugreek seeds', 'Kashmiri red chilies', 'Jaggery (Gur)', 'Tamarind pulp'],
    historicalStory: 'Cooked strictly in heavy brass deghs by royal community cooks (Botis) for ceremonial royal banquets in Jammu dating back to the 18th century.',
    approxPrice: '₹120 – ₹200 (served in Dhaam sets)',
    dietary: 'pure_veg',
    heroImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    iconicShops: [
      {
        shopName: 'Balgotra Dogra Dhaam Caterers',
        location: 'Pacca Danga, Jammu Old City',
        landmark: 'Near Chowk Chabutra',
        rating: 4.9,
        recommendedOrder: 'Authentic 7-Course Dogra Wedding Dhaam Thali',
      },
      {
        shopName: 'Jammu Heritage Rasoi',
        location: 'Bahu Plaza Complex, South Block',
        landmark: 'Near Railhead Commercial Complex',
        rating: 4.6,
        recommendedOrder: 'Ambal with Puri and Madra',
      },
    ],
  },
  {
    id: 'sund-panjeeri',
    name: 'Sund Panjeeri',
    dogriName: 'सुंड पंजीरी',
    category: 'traditional_snack',
    tasteProfile: 'Nutty, warm ginger aroma, wholesome crunch and energy-rich',
    description: 'Revered Ayurvedic and winter superfood made by roasting whole wheat flour in desi ghee with dry ginger powder (sonth), lotus seeds (phool makhana), gum crystals (kamarkas), almonds, and melon seeds.',
    keyIngredients: ['Pure A2 Desi Ghee', 'Dry Ginger (Sonth)', 'Gond / Kamarkas', 'Phool Makhana', 'Almonds & Magaz seeds', 'Shakar / Jaggery'],
    historicalStory: 'Traditionally gifted to pilgrims traveling over the snowy Pir Panjal passes and given to mothers for bone strength and vitality.',
    approxPrice: '₹350 – ₹600 per 500g box',
    dietary: 'pure_veg',
    heroImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    iconicShops: [
      {
        shopName: "Pahalwan's",
        location: 'Pir Mitha & Gole Market',
        landmark: 'Main market flagship store',
        rating: 4.9,
        recommendedOrder: 'Desi Ghee Roasted Sund Panjeeri in gift tin',
      },
      {
        shopName: 'Bansi Di Hatti',
        location: 'Raghunath Bazaar',
        landmark: 'Shop #42, Main Heritage Corridor',
        rating: 4.8,
        recommendedOrder: 'Traditional Winter Shahi Panjeeri',
      },
    ],
  },
  {
    id: 'kachalu-chaat',
    name: 'Jammu Kachalu Chaat',
    dogriName: 'कचालू चाट',
    category: 'street_food',
    tasteProfile: 'Zesty, tongue-tingling spicy, infused with wild gulgul and mint',
    description: 'Boiled and cubed Colocasia root (taro root) drenched in sour Galgal (citrus lemon from Jammu hills) juice, tamarind, toasted cumin, fresh mint, and fiery red chili flakes.',
    keyIngredients: ['Mountain Taro root (Kachalu)', 'Galgal citrus juice', 'Imli paste', 'Roasted jeera', 'Rock salt', 'Fresh green chilies'],
    historicalStory: 'The quintessential street snack of Jammu university students and pilgrims after visiting Bawe Wali Mata Temple.',
    approxPrice: '₹40 – ₹70 per bowl',
    dietary: 'pure_veg',
    heroImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    iconicShops: [
      {
        shopName: 'Gole Market Chaat Corner',
        location: 'Gol Market Circle, Gandhi Nagar',
        landmark: 'Near Central Park',
        rating: 4.7,
        recommendedOrder: 'Extra Spicy Galgal Kachalu with Crisp Mathi',
      },
      {
        shopName: 'Bahu Fort Mela Chaat Vendors',
        location: 'Approach Road to Bawe Wali Mata',
        landmark: 'Step 45, Fort Entrance',
        rating: 4.6,
        recommendedOrder: 'Fresh Mountain Kachalu Patties',
      },
    ],
  },
  {
    id: 'jammu-chocolate-patisa',
    name: 'Jammu Chocolate Barfi & Flaky Patisa',
    dogriName: 'डोगरी चॉकलेट बर्फी कने पतीसा',
    category: 'sweet',
    tasteProfile: 'Caramelized milk fudge, melt-in-the-mouth flaky gram flour honeyed layers',
    description: 'Despite its modern name, Jammu "Chocolate" is a 100% traditional sweet made from slow-caramelized buffalo milk khoa until it attains a deep mahogany hue, and legendary multi-layered Dogra Patisa.',
    keyIngredients: ['Pure Buffalo Mawa / Khoa', 'Pistachios & Green Cardamom', 'Desi Ghee', 'Gram flour (Besan)', 'Sugar crystal strands'],
    historicalStory: 'Originated in Jammu Old Bazaar in the early 20th century, becoming the top souvenir sweet carried by every traveler leaving Jammu Tawi Station.',
    approxPrice: '₹280 – ₹450 per 500g',
    dietary: 'pure_veg',
    heroImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    iconicShops: [
      {
        shopName: 'Khajuria Sweets & Sons',
        location: 'City Chowk, Old Heritage Market',
        landmark: 'Opposite City Police Station',
        rating: 4.9,
        recommendedOrder: 'Fresh Golden Flaky Dogra Patisa',
      },
      {
        shopName: "Pahalwan's",
        location: 'Gole Market & Railway Road',
        landmark: 'Near Railway Station Outgate',
        rating: 4.8,
        recommendedOrder: 'Signature Dark Roasted Jammu Chocolate Fudge',
      },
      {
        shopName: 'Prem Sweets',
        location: 'Kud & Jammu Highway Outlets',
        landmark: 'National Highway Outpost',
        rating: 4.9,
        recommendedOrder: 'Hot Kud Patisa (Warm & flaky straight from tawa)',
      },
    ],
  },
];
