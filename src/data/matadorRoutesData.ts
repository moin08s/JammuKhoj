export interface MatadorRoute {
  routeNumber: string;
  routeName: string;
  origin: string;
  destination: string;
  frequencyMinutes: string;
  firstBus: string;
  lastBus: string;
  fareRange: string;
  viaStops: string[];
  vehicleType: 'Matador Mini-Bus' | 'Smart City E-Bus' | 'Auto-Rickshaw Cluster';
  touristUtility: string;
}

export const MATADOR_ROUTES: MatadorRoute[] = [
  {
    routeNumber: 'Route 1',
    routeName: 'Old Heritage & Tawi River Circuit',
    origin: 'Jammu Tawi Railway Station',
    destination: 'Panjtirthi / Mubarak Mandi Complex',
    frequencyMinutes: 'Every 3–5 mins',
    firstBus: '06:00 AM',
    lastBus: '09:30 PM',
    fareRange: '₹10 – ₹15',
    viaStops: ['Vikram Chowk', 'Dogra Chowk', 'Jewel Chowk', 'Indira Chowk', 'Shalamar Road', 'City Chowk', 'Pacca Danga'],
    vehicleType: 'Matador Mini-Bus',
    touristUtility: 'Direct connection from Railway Station to ancient Mubarak Mandi royal palace and Raghunath Bazaar corridor.',
  },
  {
    routeNumber: 'Route 2',
    routeName: 'South Jammu Shopping Corridor',
    origin: 'Panjtirthi (Old City)',
    destination: 'Shastri Nagar / Gandhi Nagar',
    frequencyMinutes: 'Every 4–6 mins',
    firstBus: '06:30 AM',
    lastBus: '10:00 PM',
    fareRange: '₹12 – ₹20',
    viaStops: ['Kachi Chawni', 'Jewel Chowk', 'Bikram Chowk', 'Asia Crossing', 'Apsara Road', 'Gole Market', 'Dudhadhari Temple'],
    vehicleType: 'Matador Mini-Bus',
    touristUtility: 'Connects historical city to famous Gole Market street food, Prem Sweets, and modern boutiques.',
  },
  {
    routeNumber: 'Route 3',
    routeName: 'Canal Road & University Line',
    origin: 'Jammu Tawi Railway Station',
    destination: 'Talab Tillo / Bohri',
    frequencyMinutes: 'Every 5 mins',
    firstBus: '06:15 AM',
    lastBus: '09:15 PM',
    fareRange: '₹10 – ₹15',
    viaStops: ['Railway Crossing', 'University Campus Gate', 'Bikram Chowk', 'Jewel Chowk', 'Canal Road (Ranbir Canal)'],
    vehicleType: 'Matador Mini-Bus',
    touristUtility: 'Travel along the scenic, shaded Ranbir Canal waterways and Jammu University botanical gardens.',
  },
  {
    routeNumber: 'Route 4',
    routeName: 'Northern Suburban Line',
    origin: 'City Chowk / Kachi Chawni',
    destination: 'Bantalab & Keran',
    frequencyMinutes: 'Every 7–10 mins',
    firstBus: '06:30 AM',
    lastBus: '08:45 PM',
    fareRange: '₹15 – ₹25',
    viaStops: ['Ambphalla', 'Janipur Main Market', 'High Court Complex', 'Paloura', 'Roop Nagar', 'Chinore'],
    vehicleType: 'Matador Mini-Bus',
    touristUtility: 'Passes Jammu & Kashmir High Court and residential foothills of Shivalik.',
  },
  {
    routeNumber: 'Route 6',
    routeName: 'Commercial Hub & Express Colony',
    origin: 'General Bus Stand (Indira Chowk)',
    destination: 'Channi Himmat & Sainik Colony',
    frequencyMinutes: 'Every 5–8 mins',
    firstBus: '06:30 AM',
    lastBus: '09:30 PM',
    fareRange: '₹15 – ₹25',
    viaStops: ['Dogra Chowk', 'Tawi Bridge', 'Bahu Plaza Commercial Complex', 'Railway Station Bypass', 'Channi Himmat Market'],
    vehicleType: 'Matador Mini-Bus',
    touristUtility: 'Fastest way to reach Bahu Plaza financial complex, cafes, and upscale hotels.',
  },
  {
    routeNumber: 'Route 7',
    routeName: 'East Tawi Pilgrim & Fort Link',
    origin: 'Indira Chowk Bus Stand',
    destination: 'Bahu Fort & Mahamaya Forest Temple',
    frequencyMinutes: 'Every 6–8 mins',
    firstBus: '06:00 AM',
    lastBus: '08:30 PM',
    fareRange: '₹10 – ₹15',
    viaStops: ['Dogra Chowk', 'Gujjar Nagar Tawi Bridge', 'Bagh-e-Bahu Garden Gate', 'Bawe Wali Mata Shrine', 'Fish Aquarium'],
    vehicleType: 'Matador Mini-Bus',
    touristUtility: 'The essential pilgrim ride to Bawe Wali Mata Temple and Bagh-e-Bahu underwater aquarium.',
  },
  {
    routeNumber: 'Route 9',
    routeName: 'Airport & Military Cantonment Corridor',
    origin: 'General Bus Stand (Indira Chowk)',
    destination: 'Jammu Airport / Miran Sahib',
    frequencyMinutes: 'Every 10 mins',
    firstBus: '06:45 AM',
    lastBus: '08:30 PM',
    fareRange: '₹15 – ₹25',
    viaStops: ['Jewel Chowk', 'Satwari Chowk', 'Jammu Airport Civil Enclave Gate', 'R.S. Pura Road'],
    vehicleType: 'Matador Mini-Bus',
    touristUtility: 'Cost-effective public transit to Jammu Civil Airport at just ₹15 instead of ₹400 taxi fare.',
  },
  {
    routeNumber: 'E-Bus 101',
    routeName: 'Jammu Smart City AC Express',
    origin: 'Jammu Tawi Railway Station',
    destination: 'Shri Mata Vaishno Devi Shrine Base, Katra',
    frequencyMinutes: 'Every 20–30 mins',
    firstBus: '05:30 AM',
    lastBus: '09:00 PM',
    fareRange: '₹80 – ₹110',
    viaStops: ['Railway Platform 1', 'Bikram Chowk', 'General Bus Stand', 'Nagrota Toll', 'Domel Crossing', 'Katra Bus Stand'],
    vehicleType: 'Smart City E-Bus',
    touristUtility: 'Air-conditioned zero-emission electric bus direct to Katra pilgrim reception center.',
  },
];

export interface TaxiUnionRate {
  id: string;
  route: string;
  oneWaySedan: string;
  oneWayInnova: string;
  roundTrip: string;
  nightSurcharge: string;
  officialTollIncluded: boolean;
  authorizedBooth: string;
  contactNumber: string;
}

export const OFFICIAL_TAXI_RATES: TaxiUnionRate[] = [
  {
    id: 'railway-to-katra',
    route: 'Jammu Tawi Railway Station ⇄ Katra (Vaishno Devi)',
    oneWaySedan: '₹1,800',
    oneWayInnova: '₹2,400',
    roundTrip: '₹3,200',
    nightSurcharge: '15% between 11:00 PM – 05:00 AM',
    officialTollIncluded: true,
    authorizedBooth: 'Police Traffic Prepaid Booth, Platform 1 Exit',
    contactNumber: '0191-2476600',
  },
  {
    id: 'airport-to-katra',
    route: 'Jammu Airport ⇄ Katra (Vaishno Devi Base)',
    oneWaySedan: '₹2,100',
    oneWayInnova: '₹2,700',
    roundTrip: '₹3,600',
    nightSurcharge: '15% between 11:00 PM – 05:00 AM',
    officialTollIncluded: true,
    authorizedBooth: 'Airport Arrival Hall Prepaid Counter',
    contactNumber: '0191-2437800',
  },
  {
    id: 'station-to-old-city',
    route: 'Jammu Station ⇄ Raghunath Bazaar / Mubarak Mandi',
    oneWaySedan: '₹300 – ₹350',
    oneWayInnova: '₹450',
    roundTrip: '₹600',
    nightSurcharge: '₹50 flat',
    officialTollIncluded: true,
    authorizedBooth: 'Station Prepaid Auto & Cab Union Booth',
    contactNumber: '0191-2476600',
  },
  {
    id: 'full-day-city-sightseeing',
    route: 'Full Day Jammu Heritage Tour (8 Hours / 80 KM)',
    oneWaySedan: '₹1,800 – ₹2,200',
    oneWayInnova: '₹2,600 – ₹3,000',
    roundTrip: 'Covers Bahu Fort, Mubarak Mandi, Amar Mahal, Kol Kandoli, Peer Kho',
    nightSurcharge: '₹150/extra hour beyond 8 hrs',
    officialTollIncluded: true,
    authorizedBooth: 'J&K Tourism Development Corporation (JKTDC) Tourist Reception Centre (TRC)',
    contactNumber: '0191-2548172',
  },
  {
    id: 'station-to-patnitop',
    route: 'Jammu Tawi ⇄ Patnitop Hill Resort & Skyview Gondola',
    oneWaySedan: '₹3,200',
    oneWayInnova: '₹4,200',
    roundTrip: '₹4,800 (Same day return)',
    nightSurcharge: 'Included',
    officialTollIncluded: true,
    authorizedBooth: 'TRC Residency Road / Station Booth',
    contactNumber: '0191-2548172',
  },
  {
    id: 'station-to-mansar-lake',
    route: 'Jammu Tawi ⇄ Mansar & Surinsar Twin Lakes',
    oneWaySedan: '₹2,200',
    oneWayInnova: '₹2,800',
    roundTrip: '₹2,900',
    nightSurcharge: 'Included',
    officialTollIncluded: true,
    authorizedBooth: 'Station Prepaid Booth',
    contactNumber: '0191-2476600',
  },
];
