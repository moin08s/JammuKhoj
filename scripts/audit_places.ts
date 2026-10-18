import { JAMMU_ALL_ATTRACTIONS, JAMMU_REGIONAL_NODES } from '../src/data/jammuFullData';
import { JAMMU_SPOT_IMAGES } from '../src/data/spotImages';

console.log('=== ATTRACTION AUDIT REPORT ===');
console.log('Total Attractions:', JAMMU_ALL_ATTRACTIONS.length);
console.log('Total Regional Nodes:', JAMMU_REGIONAL_NODES.length);

JAMMU_ALL_ATTRACTIONS.forEach((a, i) => {
  const node = JAMMU_REGIONAL_NODES.find(n => n.id === a.nodeId);
  const img = JAMMU_SPOT_IMAGES[a.id];
  console.log(
    `${i + 1}. [${a.id}] ${a.name.en} (${a.name.hi})\n` +
    `   Coordinates: ${node ? `${node.lat}, ${node.lng}` : 'MISSING NODE!'}\n` +
    `   Image: ${img ? img : 'FALLBACK DEFAULT'}\n` +
    `   Timings: ${a.opening[0] ? `${a.opening[0].open} - ${a.opening[0].close}` : 'N/A'}\n` +
    `   Fee: ${a.entryFee ? `INR ${a.entryFee.amountInr} (${a.entryFee.note})` : 'N/A'}`
  );
});
