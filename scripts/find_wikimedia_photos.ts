import fs from 'fs';

interface SearchQuery {
  id: string;
  queries: string[];
}

const SPOTS: SearchQuery[] = [
  { id: 'attr_raghunath_temple', queries: ['Raghunath Temple Jammu', 'Raghunath Temple'] },
  { id: 'attr_bahu_fort', queries: ['Bahu Fort Jammu', 'Bahu Fort'] },
  { id: 'attr_bagh_e_bahu', queries: ['Bagh-e-Bahu Jammu', 'Bagh e Bahu', 'Bahu Fort garden'] },
  { id: 'attr_amar_mahal', queries: ['Amar Mahal Palace Jammu', 'Amar Mahal Museum'] },
  { id: 'attr_mubarak_mandi', queries: ['Mubarak Mandi Palace', 'Mubarak Mandi Jammu'] },
  { id: 'attr_ranbireshwar', queries: ['Ranbireshwar Temple Jammu', 'Ranbireshwar'] },
  { id: 'attr_peer_kho', queries: ['Peer Kho Cave Jammu', 'Peer Kho Temple', 'Jamwant Cave Jammu'] },
  { id: 'attr_maha_maya', queries: ['Mahamaya Temple Jammu', 'Maha Maya Temple'] },
  { id: 'attr_tawi_riverfront', queries: ['Tawi River Jammu', 'Tawi Bridge Jammu', 'Jammu Tawi river'] },
  { id: 'attr_raghunath_bazaar', queries: ['Raghunath Bazaar Jammu', 'Jammu bazaar street'] },
  { id: 'attr_vaishno_devi', queries: ['Vaishno Devi Bhawan', 'Vaishno Devi Katra', 'Mata Vaishno Devi'] },
  { id: 'attr_mansar_lake', queries: ['Mansar Lake Jammu', 'Mansar Lake'] },
  { id: 'attr_surinsar_lake', queries: ['Surinsar Lake Jammu', 'Surinsar Lake'] },
  { id: 'attr_purmandal', queries: ['Purmandal Jammu', 'Purmandal temple'] },
  { id: 'attr_akhnoor_ambaran', queries: ['Akhnoor Fort', 'Ambaran Akhnoor', 'Akhnoor Chenab'] },
  { id: 'attr_shiv_khori', queries: ['Shiv Khori Cave', 'Shiv Khori Reasi', 'Shiv Khori'] },
  { id: 'attr_patnitop', queries: ['Patnitop Jammu', 'Patnitop meadow', 'Patnitop'] },
  { id: 'attr_sanasar', queries: ['Sanasar Lake', 'Sanasar meadow', 'Sanasar Jammu'] },
  { id: 'attr_bhaderwah', queries: ['Bhaderwah valley', 'Bhaderwah town', 'Bhaderwah'] },
  { id: 'attr_jai_valley', queries: ['Jai Valley Bhaderwah', 'Jai Valley'] },
  { id: 'attr_chinta_valley', queries: ['Chinta Valley Bhaderwah', 'Chinta Valley'] },
  { id: 'attr_seoj_meadow', queries: ['Seoj Dhar Bhaderwah', 'Seoj meadow', 'Kailash Kund Bhaderwah'] },
  { id: 'attr_padri_pass', queries: ['Padri Pass Bhaderwah', 'Padri Pass'] },
  { id: 'attr_chattergala_pass', queries: ['Chattergala Pass', 'Chattergalla Pass', 'Chattragala Pass'] },
  { id: 'attr_chattegala_pass', queries: ['Chattergala Pass', 'Chattergalla Pass'] },
  { id: 'attr_bani_valley', queries: ['Bani Kathua', 'Bani Valley Jammu', 'Bani J&K'] },
  { id: 'attr_sarthal_valley', queries: ['Sarthal Kathua', 'Sarthal meadow', 'Sarthal Bani'] },
  { id: 'attr_machail_mata', queries: ['Machail Mata Kishtwar', 'Machail Yatra', 'Paddar Kishtwar'] },
  { id: 'attr_jhiri_shrine', queries: ['Jhiri Mela Jammu', 'Baba Jitto Jammu', 'Jhiri shrine'] },
  { id: 'attr_basohli_purthu', queries: ['Purthu Basohli', 'Basohli Atal Setu', 'Basohli painting Jammu', 'Ranjit Sagar Dam Basohli'] },
  { id: 'attr_nandini_wildlife', queries: ['Nandini Wildlife Sanctuary Jammu', 'Nandini Jammu'] },
  { id: 'attr_jasrota_sanctuary', queries: ['Jasrota Fort Kathua', 'Jasrota temple', 'Jasrota'] },
  { id: 'attr_gharana_wetland', queries: ['Gharana Wetland Jammu', 'Gharana Wetland', 'Gharana bird sanctuary'] },
  { id: 'attr_devak_temple', queries: ['Devika river Purmandal', 'Devak Jammu', 'Purmandal Devika'] },
  { id: 'attr_suchetgarh_border', queries: ['Suchetgarh Border Jammu', 'Suchetgarh border', 'Octroi Post Suchetgarh'] },
  { id: 'attr_sukrala_mata', queries: ['Sukrala Mata Billawar', 'Sukrala Devi temple'] },
  { id: 'attr_baba_dhansar', queries: ['Baba Dhansar Reasi', 'Baba Dhansar waterfall', 'Baba Dhansar'] },
  { id: 'attr_noori_chamb', queries: ['Noori Chamb Poonch', 'Noori Chamb waterfall', 'Mughal Road waterfall'] },
  { id: 'attr_darhal_valley', queries: ['Darhal Rajouri', 'Budhal Rajouri', 'Darhal Malkan', 'Rajouri valley'] },
];

async function searchWikimedia(query: string): Promise<Array<{ title: string; url: string; width: number; height: number }>> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|size&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'JammuKhojAudit/1.0 (moin@jammukhoj.local)' } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.query || !data.query.pages) return [];
    const results: Array<{ title: string; url: string; width: number; height: number }> = [];
    for (const page of Object.values(data.query.pages) as any[]) {
      if (page.imageinfo && page.imageinfo[0]) {
        const info = page.imageinfo[0];
        // filter out SVGs, audio, video
        const cleanUrl = info.url.split('?')[0];
        if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.JPG') || cleanUrl.endsWith('.jpeg') || cleanUrl.endsWith('.png') || cleanUrl.endsWith('.webp')) {
          results.push({
            title: page.title,
            url: cleanUrl,
            width: info.width,
            height: info.height,
          });
        }
      }
    }
    return results;
  } catch (err) {
    return [];
  }
}

async function run() {
  const finalMap: Record<string, { title: string; url: string; query: string }> = {};

  for (const item of SPOTS) {
    let found = false;
    for (const q of item.queries) {
      const results = await searchWikimedia(q);
      if (results.length > 0) {
        // prefer landscape and decent size
        const best = results.sort((a, b) => {
          const aAspect = a.width / (a.height || 1);
          const bAspect = b.width / (b.height || 1);
          const aScore = (aAspect >= 1.2 ? 1000 : 0) + Math.min(a.width, 2000);
          const bScore = (bAspect >= 1.2 ? 1000 : 0) + Math.min(b.width, 2000);
          return bScore - aScore;
        })[0];

        finalMap[item.id] = {
          title: best.title,
          url: best.url,
          query: q,
        };
        console.log(`[FOUND] ${item.id} -> ${best.title} (${best.url})`);
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`[NOT FOUND] ${item.id}`);
    }
  }

  fs.writeFileSync('scripts/wikimedia_found.json', JSON.stringify(finalMap, null, 2));
  console.log(`\nCompleted! Found images for ${Object.keys(finalMap).length} / ${SPOTS.length} spots.`);
}

run();
