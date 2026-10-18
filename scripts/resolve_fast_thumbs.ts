import fs from 'fs';

const FILE_MAP: Record<string, string> = {
  attr_raghunath_temple: 'File:Raghunath Temple Jammu.JPG',
  attr_bahu_fort: 'File:Bahu Fort, Jammu.jpg',
  attr_bagh_e_bahu: 'File:BAHU FORT JAMMU & KASHMIR.jpg',
  attr_amar_mahal: 'File:Amar Mahal Museum, Jammu.jpg',
  attr_mubarak_mandi: 'File:Mubarak Mandi Palace Jammu 02.jpg',
  attr_tawi_riverfront: 'File:Tawi Bridges River Jammu Aerial Jul24 A7CR 01909.jpg',
  attr_raghunath_bazaar: 'File:Hari Market Jammu.JPG',
  attr_vaishno_devi: 'File:Vaishno Devi Bhawan 2.jpg',
  attr_mansar_lake: 'File:Beautiful Mansar Lake (ramsar Wetland) Dr. Harleen Kaur.jpg',
  attr_surinsar_lake: 'File:Mansar Lake.jpg',
  attr_purmandal: 'File:Purmandal shiv Temple , Main View.jpg', // from en.wikipedia
  attr_akhnoor_ambaran: 'File:Akhnoor Fort.JPG',
  attr_shiv_khori: 'File:Shiv Khori Temple, Reasi District, Jammu, India.jpg',
  attr_patnitop: 'File:Kashmir Patnitop to Jawahar Tunnel views 171.JPG',
  attr_sanasar: 'File:Sanasar1.jpg',
  attr_bhaderwah: 'File:Bhaderwah Valley 2.jpg',
  attr_jai_valley: 'File:Jai Valley Bhaderwah 1.jpg',
  attr_chinta_valley: 'File:Bhadarwah jahi 20160603 135028.jpg',
  attr_seoj_meadow: 'File:SEOJ DHAR.jpg',
  attr_padri_pass: 'File:Padri.jpg',
  attr_chattergala_pass: 'File:Brahma 1 and 2 peaks,as seen from Natha top.jpg',
  attr_chattegala_pass: 'File:Brahma 1 and 2 peaks,as seen from Natha top.jpg',
  attr_bani_valley: 'File:Dhaggar village view.jpg',
  attr_sarthal_valley: 'File:A Mare and a Foal at the Meadows of Pir Panjal\'s village Salwah.jpg',
  attr_machail_mata: 'File:Machail-Mata-temple.jpg',
  attr_jhiri_shrine: 'File:1-shilpa-farmers-fair-jhiri-mela-pix-shilpa-thakur-jammu-15.jpg',
  attr_basohli_purthu: 'File:Basohli bridge1.jpg',
  attr_nandini_wildlife: 'File:Jaganoo Morh, Udhampur, J&K.jpg',
  attr_jasrota_sanctuary: 'File:Frontgate Jasrota fort Kathua JammuKashmir India.jpg',
  attr_gharana_wetland: 'File:Bar Headed Goose .jpg',
  attr_devak_temple: 'File:Art-print of the Purmandal Mela, by Charles Hardinge.png',
  attr_suchetgarh_border: 'File:Indian Army Jammu.jpg',
  attr_sukrala_mata: 'File:Mata Sukrala Devi.jpg',
  attr_baba_dhansar: 'File:The temple of Baba Dhansar, Reasi, Jammu & Kashmir, India.jpg',
  attr_noori_chamb: 'File:Noori Chamb - Suhail.jpg',
  attr_darhal_valley: 'File:DarhalValley.jpg',
};

async function getFastUrl(title: string): Promise<string> {
  const isEnWiki = title.includes('Purmandal shiv');
  const endpoint = isEnWiki
    ? `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json`
    : `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json`;

  try {
    const res = await fetch(endpoint, {
      headers: { 'User-Agent': 'JammuKhojApp/1.0 (https://github.com/moin08s/JammuKhoj)' }
    });
    const d = await res.json();
    const page = Object.values(d.query.pages)[0] as any;
    if (page && page.imageinfo && page.imageinfo[0]) {
      const info = page.imageinfo[0];
      return info.thumburl ? info.thumburl.split('?')[0] : info.url.split('?')[0];
    }
  } catch (err) {
    console.error(`Error for ${title}:`, err);
  }
  return '';
}

async function run() {
  const fastMap: Record<string, string> = {};
  for (const [id, title] of Object.entries(FILE_MAP)) {
    const url = await getFastUrl(title);
    if (url) {
      fastMap[id] = url;
      console.log(`[OK] ${id} -> ${url}`);
    } else {
      console.log(`[FAIL] ${id}`);
    }
    // small pause to avoid throttling
    await new Promise(r => setTimeout(r, 200));
  }
  fs.writeFileSync('scripts/fast_spot_images.json', JSON.stringify(fastMap, null, 2));
  console.log(`\nSuccessfully resolved ${Object.keys(fastMap).length} fast URLs!`);
}

run();
