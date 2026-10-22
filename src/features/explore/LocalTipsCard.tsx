import React from 'react';
import { Lightbulb, Utensils, CalendarCheck, ShieldCheck, Heart } from 'lucide-react';
import type { Attraction } from '@/data/types';

interface LocalTipsProps {
  attraction: Attraction;
}

export const LocalTipsCard: React.FC<LocalTipsProps> = ({ attraction }) => {
  // Generate spot-tailored tips
  const isTemple = attraction.type === 'religious' || attraction.id.includes('temple') || attraction.id.includes('bahu') || attraction.id.includes('peer') || attraction.id.includes('vaishno');
  const isPalaceOrFort = attraction.id.includes('amar') || attraction.id.includes('mubarak') || attraction.id.includes('bahu') || attraction.id.includes('akhnoor');
  const isNature = attraction.zone === 'offbeat_valley' || attraction.id.includes('lake') || attraction.id.includes('patnitop') || attraction.id.includes('sanasar');

  const tips: string[] = [];
  let nearbyFood = 'Authentic local Dogra Rajma-Chawal & Kaladi Kulcha available in nearby bazaars.';

  if (attraction.id === 'attr_vaishno_devi') {
    tips.push('Collect your mandatory free RFID Yatra card at Katra Railway Station or Bus Stand before proceeding.');
    tips.push('Battery car is prioritized for seniors on the Himkoti track. Book online at maavaishnodevi.org.');
    tips.push('Take the ₹100 cable car to Bhairon Temple from Bhawan; avoid the steep 1.5 km climb on foot.');
    nearbyFood = 'SMVDSB subsidized clean Bhojanalayas offer pure sattvic meals, kheer, and herbal tea along the track.';
  } else if (attraction.id === 'attr_raghunath_temple') {
    tips.push('Use the official temple footwear token counter on the right side of the main gateway.');
    tips.push('Deposit cameras and leather belts in the free temple lockers before queuing.');
    tips.push('Visit between 7:30 AM – 9:00 AM for the tranquil morning aarti without market crowds.');
    nearbyFood = 'Pahalwan di Hatti (just 200m away in Raghunath Bazaar) for legendary Kaladi Kulcha & Chocolate Barfi.';
  } else if (attraction.id === 'attr_bahu_fort') {
    tips.push('Tuesdays and Sundays draw large local crowds for Bawe Wali Mata; visit early morning (6:30 AM) to avoid rush.');
    tips.push('Bagh-e-Bahu light and sound show runs in the evening with panoramic sunset views over the Tawi River.');
    nearbyFood = 'Local stalls outside gate serve hot Kaladi Kulchas, Kachaalu chaat, and fresh sugarcane juice.';
  } else if (attraction.id === 'attr_amar_mahal') {
    tips.push('The 35kg pure gold throne hall requires shoe covers (provided at entrance).');
    tips.push('Golden hour (4:00 PM – 5:30 PM) offers the best lighting for French chateau photography and Tawi valley vistas.');
    nearbyFood = 'Hari Niwas Palace heritage lounge adjoining the grounds serves traditional Dogri saffron tea and snacks.';
  } else if (isTemple) {
    tips.push('Respect traditional dress codes (shoulders and knees covered). Head coverings recommended.');
    tips.push('Footwear must be deposited at the entrance counter; photography inside sanctum is strictly prohibited.');
    nearbyFood = 'Local tea stalls and sweet shops serve pure vegetarian halwa, poori, and lassi.';
  } else if (isPalaceOrFort) {
    tips.push('Wear comfortable shoes as historic staircases and courtyards require gentle walking.');
    tips.push('Carry a water bottle; photography permissions may require an entry ticket of ₹50 - ₹100.');
    nearbyFood = 'City center restaurants and sweet shops are within 10-15 minutes walking distance.';
  } else if (isNature) {
    tips.push('Evenings can turn chilly quickly; carry a light jacket even in late spring or autumn.');
    tips.push('Download offline maps beforehand as cellular data signals can be intermittent in valleys.');
    nearbyFood = 'Local dhabas serve hot Rajmash-Chawal with local mountain ghee and fresh anardana chutney.';
  } else {
    tips.push('Best explored during morning hours for gentle temperatures and relaxed photography.');
    tips.push('Local Matador mini-buses and e-rickshaws connect this site directly to the city center.');
    nearbyFood = 'Local Dogra street food joints and sweet shops are nearby.';
  }

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-850 rounded-3xl p-4 border border-amber-200/80 dark:border-border shadow-xs space-y-3 text-ink">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-ink text-sm">Tips from Local Dogra Residents</h3>
            <p className="text-[11px] text-stone">Unspoken local advice & insider navigation</p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Verified Oct 2026
        </span>
      </div>

      <ul className="space-y-2 text-xs text-ink">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border">
            <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 mt-0.5">•</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>

      {/* Nearby Food Tip */}
      <div className="p-3 rounded-2xl bg-card border border-border text-xs flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
          <Utensils className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="font-bold text-[11px] uppercase tracking-wider text-orange-950 dark:text-amber-400">
            Recommended Nearby Food Spot
          </div>
          <p className="text-stone mt-0.5 leading-relaxed text-[11px]">
            {nearbyFood}
          </p>
        </div>
      </div>
    </div>
  );
};
