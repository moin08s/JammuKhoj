export interface GIProduct {
  id: string;
  name: {
    en: string;
    hi: string;
    doi?: string;
  };
  giStatus: 'Registered GI Tag' | 'Heritage GI Nominated';
  giApplicationNo?: string;
  registrationYear: string;
  category: 'craft' | 'food' | 'agriculture' | 'handloom';
  district: string;
  originHub: string;
  tagline: string;
  description: string;
  authenticityGuide: string[];
  priceBenchmark: string;
  whereToBuyInJammu: {
    name: string;
    address: string;
    verifiedType: 'Govt Emporium' | 'Heritage Market' | 'Artisan Cluster';
  }[];
  heroImage: string;
  relatedAttractionIds: string[];
}

export const JAMMU_GI_PRODUCTS: GIProduct[] = [
  {
    id: 'gi_basohli_painting',
    name: {
      en: 'Basohli Paintings',
      hi: 'बसोहली चित्रकला',
      doi: 'बसौहली पेंटिंग',
    },
    giStatus: 'Registered GI Tag',
    giApplicationNo: 'GI Application No. 732',
    registrationYear: '2023',
    category: 'craft',
    district: 'Kathua (Basohli)',
    originHub: 'Basohli Town, Kathua District (130 km from Jammu)',
    tagline: 'Jammu Division’s First Independent Craft GI Tag (17th Century Miniature Art)',
    description:
      'Basohli painting is a globally acclaimed school of Pahari miniature art that flourished in the 17th and 18th centuries under Raja Kirpal Pal. Recognized for fiery expressions, deep almond eyes, natural mineral pigments, and glittering beetle-wing elytra inlays depicting Rasamanjari and Gita Govinda.',
    authenticityGuide: [
      'Genuine paintings use handmade Wasli paper and natural stone minerals, never synthetic acrylic paints.',
      'Look for the official Department of Handicrafts & Handloom GI Hologram sticker on the back.',
      'Emerald-green accents in jewelry are traditionally crafted using real iridescent Buprestid beetle wing cases.',
    ],
    priceBenchmark: '₹1,500 to ₹35,000+ depending on canvas scale, detail, and 24K gold foil work.',
    whereToBuyInJammu: [
      {
        name: 'Poshish (J&K Handloom & Handicrafts Emporium)',
        address: 'Veer Marg & Residency Road, Jammu City',
        verifiedType: 'Govt Emporium',
      },
      {
        name: 'Basohli Art Gallery & Artisan Cooperative',
        address: 'Ranjit Sagar Dam Road, Basohli, Kathua',
        verifiedType: 'Artisan Cluster',
      },
      {
        name: 'Kala Kendra Exhibition Gallery',
        address: 'Bikram Chowk, Jammu',
        verifiedType: 'Govt Emporium',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    relatedAttractionIds: ['attr_basohli_purthu', 'attr_amar_mahal'],
  },
  {
    id: 'gi_basohli_pashmina',
    name: {
      en: 'Basohli Pashmina',
      hi: 'बसोहली पश्मीना',
      doi: 'बसौहली पश्मीना',
    },
    giStatus: 'Registered GI Tag',
    giApplicationNo: 'GI Application No. 733',
    registrationYear: '2023',
    category: 'handloom',
    district: 'Kathua (Basohli)',
    originHub: 'Basohli, Bani & Billawar clusters',
    tagline: 'Featherlight Hand-Spun & Handloom Woven Woolen Pashmina',
    description:
      'Unlike machine-woven fabric, Basohli Pashmina is spun entirely by hand on traditional Dogra charkhas by local women artisans, then woven on wood-frame handlooms. It possesses exceptional thermal retention, softness, and natural organic drape.',
    authenticityGuide: [
      'Passes the burn test: Genuine pashmina wool burns with an odor of singed hair and produces powdery ash (not hard plastic beads).',
      'The weave has slight, natural handloom irregularities — machine copies are mechanically uniform.',
      'Check for the official J&K Govt Pashmina Testing Lab GI certification stamp.',
    ],
    priceBenchmark: '₹7,500 for pure handloom stoles; ₹14,000 to ₹45,000 for embroidered shawls.',
    whereToBuyInJammu: [
      {
        name: 'J&K Handicrafts Central Sales Emporium',
        address: 'Residency Road, Old Heritage Zone, Jammu',
        verifiedType: 'Govt Emporium',
      },
      {
        name: 'Poshish Handloom Complex',
        address: 'Bari Brahmana & City Outlets, Jammu',
        verifiedType: 'Govt Emporium',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    relatedAttractionIds: ['attr_basohli_purthu'],
  },
  {
    id: 'gi_bhaderwah_rajmash',
    name: {
      en: 'Bhaderwah Rajmash (Red Kidney Beans)',
      hi: 'भद्रवाह राजमा',
      doi: 'भद्दरवाह दा राजमा',
    },
    giStatus: 'Registered GI Tag',
    giApplicationNo: 'GI Application No. 734',
    registrationYear: '2023',
    category: 'agriculture',
    district: 'Doda (Bhaderwah Valley)',
    originHub: 'Bhaderwah Valley (5,400 ft altitude)',
    tagline: 'World-Renowned Small-Grained Naturally Sweet Kidney Beans',
    description:
      'Grown in the temperate sub-alpine soils of Bhaderwah (often nicknamed Chhota Kashmir), these small-seeded red beans are celebrated across India. When cooked, they do not produce gas, boast a melt-in-mouth creamy texture, and impart a distinctive natural sweetness.',
    authenticityGuide: [
      'Genuinely authentic Bhaderwah Rajmash has noticeably smaller, compact seeds with a deep maroon coat.',
      'Cooks in half the time of regular plains rajma without disintegrating.',
      'Ask for certified packaging sealed under Department of Agriculture J&K GI clearance.',
    ],
    priceBenchmark: '₹190 to ₹260 per kg (in vacuum-sealed authentic packs).',
    whereToBuyInJammu: [
      {
        name: 'Raghunath Heritage Dry Fruits & Grocery Bazaar',
        address: 'Main Raghunath Temple Road, Jammu',
        verifiedType: 'Heritage Market',
      },
      {
        name: 'Dogra Kisan Organic Mart',
        address: 'Railway Station Road & Bus Stand Complex, Jammu',
        verifiedType: 'Govt Emporium',
      },
      {
        name: 'Kisan Market Yard',
        address: 'Narwal Fruit & Vegetable Market, Jammu',
        verifiedType: 'Heritage Market',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    relatedAttractionIds: ['attr_bhaderwah', 'attr_raghunath_temple'],
  },
  {
    id: 'gi_ramban_sulai_honey',
    name: {
      en: 'Ramban Sulai Honey',
      hi: 'रामबन सुलाई शहद',
      doi: 'रामबन दा सुलाई शहद',
    },
    giStatus: 'Registered GI Tag',
    giApplicationNo: 'GI Application No. 735',
    registrationYear: '2023',
    category: 'food',
    district: 'Ramban',
    originHub: 'Ramban, Banihal & Batote highland forest meadows',
    tagline: 'Medicinal Organic White Blossom Mountain Honey',
    description:
      'Harvested from wild Sulai (Plectranthus rugosus) blossoms that carpet the steep slopes of Ramban during late autumn. It is renowned for its crystalline white-to-light-amber color, delicate floral fragrance, and proven therapeutic respiratory benefits.',
    authenticityGuide: [
      'Naturally crystallizes into a creamy, pearl-white butter texture in temperatures below 20°C (this is proof of raw unheated honey!).',
      'Does not dissolve immediately in cold water; forms a gentle thread.',
      'Check for the official Ramban Beekeepers Cooperative Society GI trademark logo.',
    ],
    priceBenchmark: '₹600 to ₹1,100 per 500g glass jar.',
    whereToBuyInJammu: [
      {
        name: 'Raghunath Bazaar Apiary Stores',
        address: 'Chowk Chabutra & Raghunath Chowk, Jammu',
        verifiedType: 'Heritage Market',
      },
      {
        name: 'J&K Khadi & Village Industries Board (KVIB)',
        address: 'Old Secretariat Complex, Jammu',
        verifiedType: 'Govt Emporium',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    relatedAttractionIds: ['attr_raghunath_temple'],
  },
  {
    id: 'gi_ramban_anardana',
    name: {
      en: 'Ramban Anardana (Wild Pomegranate Seeds)',
      hi: 'रामबन अनारदाना',
      doi: 'रामबन दा दारूणी / अनारदाना',
    },
    giStatus: 'Registered GI Tag',
    giApplicationNo: 'GI Application No. 736',
    registrationYear: '2023',
    category: 'agriculture',
    district: 'Ramban',
    originHub: 'Wild hillside pomegranate forests of Ramban & Batote',
    tagline: 'Forest-Gathered Sour Savor for Traditional Dogra & Pahari Cuisine',
    description:
      'Hand-picked from wild, thorny pomegranate trees (Daru) indigenous to the mid-Himalayan hills of Ramban. The seeds are sun-dried using ancestral techniques, giving Dogra cuisine its distinctive tangy bite in dishes like Anardana Chutney, Rajmash, and Khatta Meat.',
    authenticityGuide: [
      'Deep ruby-brown to dark crimson shade; noticeably tarter and more intensely aromatic than hybrid farm pomegranates.',
      'Sold both as whole dried arils and stone-ground spice powder.',
    ],
    priceBenchmark: '₹350 to ₹550 per kg.',
    whereToBuyInJammu: [
      {
        name: 'Old City Spice Traders',
        address: 'Kanak Mandi & Raghunath Bazaar, Jammu',
        verifiedType: 'Heritage Market',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    relatedAttractionIds: ['attr_raghunath_temple'],
  },
  {
    id: 'gi_rajouri_chikri_woodcraft',
    name: {
      en: 'Rajouri Chikri Wood Craft',
      hi: 'राजौरी चिकड़ी काष्ठ कला',
      doi: 'राजौरी दी चिकड़ी लकड़ी',
    },
    giStatus: 'Registered GI Tag',
    giApplicationNo: 'GI Application No. 737',
    registrationYear: '2023',
    category: 'craft',
    district: 'Rajouri',
    originHub: 'Thannamandi & Rajouri Forest Ranges',
    tagline: 'Ivory-Hued Fine Timber Heritage Carvings & Combs',
    description:
      'Chikri (Buxus wallichiana) is a fine-grained, soft, light-amber timber found exclusively in the sub-tropical hill forests of Rajouri and Poonch. Artisans use hand chisels to create delicate royal combs (Kanghi), jewel boxes, paper knives, and keychains without chemical lacquers.',
    authenticityGuide: [
      'Chikri wood is naturally pale cream/yellow with an exceptionally fine, silky grain mimicking ivory.',
      'Emits a subtle natural woody scent and maintains a cool touch.',
      'Verify the artisan stamp and GI registry certificate.',
    ],
    priceBenchmark: '₹250 to ₹4,500 depending on carving complexity.',
    whereToBuyInJammu: [
      {
        name: 'J&K Handicrafts Sales Showroom',
        address: 'Bikram Chowk & Vir Marg, Jammu',
        verifiedType: 'Govt Emporium',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    relatedAttractionIds: ['attr_mubarak_mandi'],
  },
  {
    id: 'gi_kishtwar_saffron',
    name: {
      en: 'Kishtwar Saffron (Kumkum / Kesar)',
      hi: 'किश्तवाड़ केसर (कुंकुम)',
      doi: 'किश्तवाड़ दा केशर',
    },
    giStatus: 'Registered GI Tag',
    giApplicationNo: 'GI Application No. 738',
    registrationYear: '2023',
    category: 'agriculture',
    district: 'Kishtwar',
    originHub: 'Pochhal, Matta & Mandal plateaus (5,500 ft elevation)',
    tagline: 'Highest-Potency Organic Saffron from the High Plateaus',
    description:
      'Cultivated on the sun-drenched plateau highlands of Kishtwar along the Chenab gorge. Blessed with crisp alpine nights and fertile loamy soil, Kishtwar saffron is prized for its thick, blood-red stigmas, unusually high safranal aroma, and intense coloring strength.',
    authenticityGuide: [
      'Water Color Test: Drop 2 strands in warm water or milk — genuine saffron colors liquid slowly to golden-yellow over 10-15 minutes, and the strand stays red (fake dyed threads turn red instantly and turn white).',
      'Smells sweet and grassy, but tastes bitter on the tongue.',
      'Check for tamper-evident hologram seal with batch traceability.',
    ],
    priceBenchmark: '₹280 to ₹380 per gram (Grade A Mogra quality).',
    whereToBuyInJammu: [
      {
        name: 'Raghunath Temple Pilgrimage Dry Fruit Market',
        address: 'Raghunath Temple Complex Gate 1 & 2, Jammu',
        verifiedType: 'Heritage Market',
      },
      {
        name: 'Katra Shrine Board Certified Souvenir Kiosk',
        address: 'Yatri Suvidha Kendra, Katra & Banganga Gate',
        verifiedType: 'Govt Emporium',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    relatedAttractionIds: ['attr_raghunath_temple', 'attr_vaishno_devi'],
  },
  {
    id: 'gi_udhampur_kalari',
    name: {
      en: 'Udhampur Kalari (Dogra Cheese)',
      hi: 'उधमपुर कलाड़ी (डोगरा पनीर)',
      doi: 'उधमपुरे दी कल्हाड़ी',
    },
    giStatus: 'Heritage GI Nominated',
    registrationYear: 'Heritage Protected',
    category: 'food',
    district: 'Udhampur (Ramnagar & Panchari)',
    originHub: 'Ramnagar, Chenani & Udhampur hills',
    tagline: 'The Celebrated "Mozzarella of the Dogras" Pan-Fried Golden Delicacy',
    description:
      'A dense, un-ripened aged cheese prepared by Gujjar-Bakerwal pastoralists from raw cow or buffalo milk coagulated with sour whey. Sun-cured into thick discs, it is traditionally pan-seared with mustard oil, rock salt, and red chili until crisp on the crust and molten stringy inside.',
    authenticityGuide: [
      'Firm circular patty with a pale cream, slightly uneven sun-dried skin and characteristic sour lactic fragrance.',
      'Never requires batter or cornstarch; when heated, releases its own rich milk fat and browns uniformly.',
      'Best enjoyed fresh with Dogra mint-anardana chutney.',
    ],
    priceBenchmark: '₹400 to ₹650 per kg (or ₹60-₹90 per served Kalari Kulcha).',
    whereToBuyInJammu: [
      {
        name: 'Pahalwan di Hatti & Gole Market Street Vendors',
        address: 'Gandhi Nagar Gole Market & Old Heritage City, Jammu',
        verifiedType: 'Heritage Market',
      },
      {
        name: 'Katra Bus Stand Local Dairy Stalls',
        address: 'Main Chowk, Katra (en-route Vaishno Devi)',
        verifiedType: 'Heritage Market',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=800&q=80',
    relatedAttractionIds: ['attr_raghunath_temple', 'attr_bahufort_baghe_bahu'],
  },
];
