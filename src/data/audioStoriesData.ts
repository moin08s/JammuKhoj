export interface AudioTourSpot {
  id: string;
  spotName: string;
  title: string;
  dogriTitle: string;
  durationSeconds: number;
  heroImage: string;
  transcripts: {
    en: string;
    hi: string;
    doi: string;
  };
}

export const AUDIO_TOUR_SPOTS: AudioTourSpot[] = [
  {
    id: 'audio-bahu-fort',
    spotName: 'Bahu Fort & Mahakali Temple',
    title: 'The 3,000-Year-Old Citadel of Raja Bahu Lochan',
    dogriTitle: 'बावे आली माता कने बाहू किला',
    durationSeconds: 150,
    heroImage: 'https://images.unsplash.com/photo-1599818817743-f61b78347895?auto=format&fit=crop&w=600&q=80',
    transcripts: {
      en: 'Welcome to Bahu Fort, the ancient bedrock of Jammu civilization. Over three thousand years ago, Raja Bahu Lochan, brother of the city’s founder Jambu Lochan, erected this commanding sandstone fortress upon a cliff overlooking the sacred Tawi river. Inside its thick octagonal ramparts lies the sanctum of Bawe Wali Mata, the fierce and compassionate incarnation of Goddess Kali. As you ascend the stone staircase, witness the terraced gardens of Bagh-e-Bahu cascading towards the riverbank below.',
      hi: 'बहू किले में आपका स्वागत है, जो जम्मू सभ्यता की तीन हज़ार वर्ष पुरानी ऐतिहासिक धरोहर है। राजा जंबू लोचन के भाई, राजा बहू लोचन ने तवी नदी के तट पर इस अभेद्य बलुआ पत्थर के किले का निर्माण करवाया था। इसके अष्टकोणीय परकोटों के भीतर विराजमान हैं बावे वाली माता—मां काली का भव्य रूप। मान्यता है कि मां काली जम्मू की हर आपदा से रक्षा करती हैं।',
      doi: 'बावे आले किले च तुंदा स्वागत ऐ। त्रै हज़ार ब’रे पुराने इस ऐतिहासिक किले गी राजा बहू लोचने तवी दे कंडे बनाया हा। इस किले दे अंदर बावे आली महाकाली दा पवित्र मंदिर ऐ जि’ड़ा जम्मू दे सारे लोकें दा रक्षक मन्नेआ जंदा ऐ।',
    },
  },
  {
    id: 'audio-mubarak-mandi',
    spotName: 'Mubarak Mandi Palace Complex',
    title: 'Echoes of the Dogra Dynasty & Royal Darbars',
    dogriTitle: 'मुबारक मंडी शाही महल',
    durationSeconds: 180,
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
    transcripts: {
      en: 'You stand before Mubarak Mandi, the grand royal seat of the Dogra rulers until 1925. This sprawling palace complex is a breathtaking architectural synthesis of Rajasthani arches, Mughal jali screens, and European Baroque courtyards. Walk through the Pink Hall, now the Dogra Art Museum, which preserves rare miniature Pahari paintings from Basohli and Kangra, along with the gold-painted bow and arrows of Mughal Emperor Shah Jahan.',
      hi: 'आप मुबारक मंडी के भव्य परिसर के सामने खड़े हैं, जो 1925 तक डोगरा शासकों का राजमहल था। यह महल राजस्थानी, मुग़ल और यूरोपीय वास्तुकला का एक दुर्लभ संगम है। इसके गुलाबी हॉल में स्थित डोगरा कला संग्रहालय में बसोहली शैली के विश्वप्रसिद्ध लघु चित्र और सम्राट शाहजहां का स्वर्ण जड़ित धनुष सुरक्षित हैं।',
      doi: 'मुबारक मंडी डोगरा राजवंश दा ऐतिहासिक शाही महल ऐ। एह् महल राजस्थानी, मुग़ल कने यूरोपीय स्थापत्य कला दा अद्भुत नमूना ऐ। इसदे अंदर बसोहली शैली दे अनमोल चित्र सुरक्षित रक्खे गेदे न।',
    },
  },
  {
    id: 'audio-raghunath-temple',
    spotName: 'Shri Raghunath Temple',
    title: 'The Sacred Gold Spires & 33 Crore Divine Inscriptions',
    dogriTitle: 'श्री रघुनाथ जी दा मंदिर',
    durationSeconds: 165,
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    transcripts: {
      en: 'Welcome to Shri Raghunath Temple, commissioned in 1835 by Maharaja Gulab Singh and consecrated by Maharaja Ranbir Singh. This sacred sanctuary is dedicated to Lord Rama. The walls of its inner parikrama corridors are lined with hundreds of thousands of sacred Saligrams brought from Nepal, representing all 33 crore divine entities of ancient Vedic cosmology. Look up at the gold leaf gilding covering the main sanctum spire, shining brightly against the Jammu sky.',
      hi: 'श्री रघुनाथ मंदिर में आपका स्वागत है। महाराजा गुलाब सिंह द्वारा 1835 में आरंभ और महाराजा रणबीर सिंह द्वारा 1860 में पूर्ण किया गया यह मंदिर भगवान श्री राम को समर्पित है। मंदिर के प्रदक्षिणा पथ में नेपाल की गंडकी नदी से लाए गए अनगिनत शालीग्राम स्थापित हैं। मुख्य गर्भगृह के स्वर्ण शिखर की आभा दूर से ही दृष्टिगोचर होती है।',
      doi: 'श्री रघुनाथ जी दा मंदिर उत्तर भारत दे सबनें शा बड्डे तीर्थें च गिन्नेआ जंदा ऐ। महाराजा गुलाब सिंहे इसदी नींव रक्खी ही। इसदे अंदर शालीग्रामें दे माध्यम कन्नै तेती करोड़ देवतें दी पूजा कीती जंदी ऐ।',
    },
  },
  {
    id: 'audio-amar-mahal',
    spotName: 'Amar Mahal Palace Museum',
    title: 'French Chateaux on the Shivalik Cliffs & 120kg Golden Throne',
    dogriTitle: 'अमर महल कने सोने दा सिंहासन',
    durationSeconds: 140,
    heroImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
    transcripts: {
      en: 'Perched high above a bend of the river Tawi stands Amar Mahal Palace, commissioned by Raja Amar Singh in the late 19th century. Designed by a French architect in the style of a European chateau, it features sloping red roofs, tall gables, and turrets. Inside, behold the historic 120-kilogram pure gold throne of the Dogra monarchs, intricately carved with tiger heads, and the renowned Nala-Damayanti miniature paintings.',
      hi: 'तवी नदी के मनोरम तट पर स्थित अमर महल 19वीं सदी का अद्वितीय फ्रांसीसी शैली का महल है। राजा अमर सिंह द्वारा निर्मित इस महल में ढलवां लाल छतें और यूरोपीय बुर्ज बने हैं। यहां डोगरा राजाओं का 120 किलो शुद्ध सोने से बना राजसिंहासन और नल-दमयंती की पौराणिक कथा पर आधारित सुंदर चित्र मौजूद हैं।',
      doi: 'अमर महल इक फ्रांसीसी वास्तुकार कन्नै बनाया गेआ अनोखा महल ऐ। इसदे अंदर डोगरा राजाएं दा एक सौ बीह किलो वजनी सोने दा सिंहासन रक्खेआ गेआ ऐ।',
    },
  },
];
