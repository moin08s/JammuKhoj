export interface SpiritualShrineGuide {
  id: string;
  name: string;
  deity: string;
  location: string;
  significance: string;
  dressCode: {
    recommended: string;
    prohibited: string;
  };
  photographyRule: 'strictly_prohibited' | 'outside_only' | 'allowed_without_flash';
  photographyNote: string;
  footwearLocker: {
    available: boolean;
    cost: string;
    location: string;
    advice: string;
  };
  electronicsCloakroom: {
    mandatoryDeposit: boolean;
    details: string;
  };
  darshanTimings: {
    morning: string;
    evening: string;
    specialAarti: string;
  };
  offeringsPolicy: string;
  accessibility: string;
  peakDays: string[];
}

export const SPIRITUAL_SHRINES_GUIDE: SpiritualShrineGuide[] = [
  {
    id: 'raghunath-temple',
    name: 'Shri Raghunath Temple Complex',
    deity: 'Lord Rama (Raghunath Ji) with 33 Crore Divine Inscriptions',
    location: 'Raghunath Bazaar, Old Heritage Jammu City',
    significance: 'One of the largest temple complexes in Northern India, commissioned by Maharaja Gulab Singh in 1835. Houses a massive gold-sheeted sanctum sanctorum and ancient Sanskrit manuscript library.',
    dressCode: {
      recommended: 'Traditional modest attire (Kurta-pyjama, saree, salwar-kameez, trousers covering knees).',
      prohibited: 'Shorts, sleeveless tops, miniskirts, or clothing with offensive graphics.',
    },
    photographyRule: 'strictly_prohibited',
    photographyNote: 'All mobile phones, smartwatches, and cameras must be deposited in the secure police-manned cloakroom at Gate 1.',
    footwearLocker: {
      available: true,
      cost: 'Free token service',
      location: 'Immediately right of the outer security scanning corridor',
      advice: 'Keep token safe; marble floors get warm in summer afternoons, carpet pathways are laid.',
    },
    electronicsCloakroom: {
      mandatoryDeposit: true,
      details: 'Strict electronic scan. Leather belts and wallets are allowed inside, but all electronic devices and lighters are prohibited.',
    },
    darshanTimings: {
      morning: '06:00 AM – 12:30 PM',
      evening: '04:00 PM – 09:00 PM',
      specialAarti: 'Morning Aarti: 07:00 AM | Evening Sandhya Aarti: 07:30 PM',
    },
    offeringsPolicy: 'Pure dry fruit prasad, flower marigolds, and sacred patashas available at registered trust counters. No outside unpackaged milk sweets allowed inside inner sanctum.',
    accessibility: 'Wheelchair access ramp available via Gate 2 (VIP/Senior Citizen gate). Staff provide assistance upon request.',
    peakDays: ['Sundays', 'Ram Navami', 'Janmashtami', 'Diwali'],
  },
  {
    id: 'bawe-wali-mata',
    name: 'Bawe Wali Mata Temple (Bahu Fort)',
    deity: 'Maha Kali (Presiding Goddess of Jammu)',
    location: 'Inside ancient Bahu Fort complex, Left bank of River Tawi',
    significance: 'Built on the 3,000-year-old Bahu Fort rock promontory by Raja Bahu Lochan. Devotees believe Maa Kali protects the city of Jammu from all natural calamities.',
    dressCode: {
      recommended: 'Modest traditional dress covering shoulders and knees. Head covering with a handkerchief, dupatta, or scarf is customary.',
      prohibited: 'Revealing attire, leather accessories in close proximity to the pindis.',
    },
    photographyRule: 'outside_only',
    photographyNote: 'Photography allowed in outer fortress ramparts and Bagh-e-Bahu gardens. Strictly prohibited inside the inner temple cave sanctum.',
    footwearLocker: {
      available: true,
      cost: 'Nominal ₹5 or free volunteer stall',
      location: 'At the bottom of the fortress stone stairway',
      advice: 'Climb 45 steps to the main temple. Monkeys (langurs) are present; keep prasad securely wrapped in bags.',
    },
    electronicsCloakroom: {
      mandatoryDeposit: false,
      details: 'Mobiles allowed on silent mode; no photography allowed inside inner enclosure.',
    },
    darshanTimings: {
      morning: '05:30 AM – 01:00 PM',
      evening: '03:30 PM – 09:30 PM',
      specialAarti: 'Bahu Aarti: 06:15 AM & 07:15 PM',
    },
    offeringsPolicy: 'Red Chunri (scarf), dry coconut (nariyal), puffed batashas, and marigold garlands. Animal sacrifice has been completely banned by law.',
    accessibility: 'Stairway access; elderly pilgrims may request battery-cart assistance up to the fort base courtyard.',
    peakDays: ['Tuesdays (massive crowd)', 'Sundays', 'Chaitra & Ashwin Navratra Mela'],
  },
  {
    id: 'kol-kandoli-temple',
    name: 'Kol Kandoli Temple',
    deity: 'Mata Kol Kandoli (Pratham Darshan of Vaishno Devi)',
    location: 'Nagrota, 14 km North of Jammu on NH-44',
    significance: 'Tradition dictates that pilgrims heading to Shri Mata Vaishno Devi must first pay homage at Kol Kandoli, where the Goddess manifested as a young girl playing with earthen bowls (kol).',
    dressCode: {
      recommended: 'Decent pilgrimage attire with covered shoulders and knees.',
      prohibited: 'Casual beachwear or sports gym wear.',
    },
    photographyRule: 'allowed_without_flash',
    photographyNote: 'Courtyard photography permitted. No flash photography pointed towards the sanctum.',
    footwearLocker: {
      available: true,
      cost: 'Free',
      location: 'Outside temple parikrama entrance',
      advice: 'Clean washrooms and drinking water available on temple grounds.',
    },
    electronicsCloakroom: {
      mandatoryDeposit: false,
      details: 'Keep mobile on silent during prayers.',
    },
    darshanTimings: {
      morning: '05:00 AM – 12:00 PM',
      evening: '04:00 PM – 10:00 PM (24 hours open during Navratras)',
      specialAarti: 'Morning Aarti: 06:00 AM | Evening Aarti: 07:00 PM',
    },
    offeringsPolicy: 'Mustard oil for continuous Akhand Jyoti lamps, dry coconut, sweet batasha, and fresh flowers.',
    accessibility: 'Ground level flat courtyard, fully accessible for wheelchairs and senior citizens.',
    peakDays: ['Navratras', 'Tuesdays', 'Full Moon (Purnima)'],
  },
  {
    id: 'peer-kho-cave',
    name: 'Peer Kho Cave Temple (Jamwant Cave)',
    deity: 'Lord Shiva (Swayambhu Lingam)',
    location: 'Circular Road, nestled in acacia woods overlooking River Tawi',
    significance: 'Dating back to the Treta Yuga, this subterranean limestone cave is revered as the meditation cavern of Sage Jamwant (the bear-king from the Ramayana). Connected through underground passages to ancient pilgrimage sites.',
    dressCode: {
      recommended: 'Comfortable cottons or woolens allowing stooping and walking through cave passages.',
      prohibited: 'High heels, tight restrictive garments.',
    },
    photographyRule: 'outside_only',
    photographyNote: 'Photography outside in the Tawi viewing deck and garden is allowed. No photography inside the dark cave sanctum.',
    footwearLocker: {
      available: true,
      cost: 'Free volunteer stall',
      location: 'Near cave mouth archway',
      advice: 'Limestone rocks can be damp; walk slowly on the stone floor.',
    },
    electronicsCloakroom: {
      mandatoryDeposit: false,
      details: 'Keep phones in pocket; avoid using bright flashlights that disturb the peaceful meditation ambiance.',
    },
    darshanTimings: {
      morning: '05:00 AM – 12:30 PM',
      evening: '04:00 PM – 09:30 PM',
      specialAarti: 'Bhasma/Jal Aarti: 06:30 AM | Sandhya Aarti: 07:00 PM',
    },
    offeringsPolicy: 'Milk, sacred Gangajal, bilva leaves (Bel Patra), and dhatura flowers for Lord Shiva.',
    accessibility: 'Steps descend into the cave; requires physical stooping to reach the inner sanctum. Not suitable for standard wheelchairs inside cave.',
    peakDays: ['Maha Shivratri (huge fair)', 'Mondays (all year)'],
  },
  {
    id: 'ranbireshwar-temple',
    name: 'Shri Ranbireshwar Shiva Temple',
    deity: 'Lord Shiva (Central 7.5 ft crystal-black lingam + 12 crystal Bana Lingams)',
    location: 'Shalamar Road, opposite Civil Secretariat, Jammu',
    significance: 'Constructed in 1883 by Maharaja Ranbir Singh. Holds the distinction of possessing one of the tallest central Shiva lingams in India, flanked by 12 crystal lingams brought from the holy Narmada River.',
    dressCode: {
      recommended: 'Modest attire. Avoid leather shoes/belts near the stone Jalhari.',
      prohibited: 'Short pants or revealing shirts.',
    },
    photographyRule: 'outside_only',
    photographyNote: 'Allowed in the spacious courtyard and historic arches, not in the inner Jalhari sanctum.',
    footwearLocker: {
      available: true,
      cost: 'Free token service',
      location: 'Portico entrance near marble stairs',
      advice: 'Large marble parikrama area is kept clean and shaded.',
    },
    electronicsCloakroom: {
      mandatoryDeposit: false,
      details: 'Mobiles allowed on silent mode.',
    },
    darshanTimings: {
      morning: '05:30 AM – 01:00 PM',
      evening: '04:00 PM – 09:30 PM',
      specialAarti: 'Maha Aarti: 07:00 AM & 07:30 PM',
    },
    offeringsPolicy: 'Pure cow milk, bel patra, chandan (sandalwood paste), and water poured directly on the holy lingam during morning darshan.',
    accessibility: 'Gentle ramp available from the west garden gate for wheelchair users.',
    peakDays: ['Shravan Maas Mondays', 'Maha Shivratri'],
  },
];
