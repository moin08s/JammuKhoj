import React, { useState } from 'react';
import {
  Users,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Info,
  MapPin,
  Flame,
  X,
} from 'lucide-react';

export interface TempleCrowdInfo {
  id: string;
  name: string;
  hindiName: string;
  location: string;
  aartiTimings: {
    morning: string;
    evening: string;
  };
  peakDays: string[];
  seniorTips: string;
  darshanWaitEstimate: {
    low: string;
    moderate: string;
    peak: string;
  };
  bestVisitingWindow: string;
  specialRules: string[];
}

export const TEMPLE_CROWD_DATA: TempleCrowdInfo[] = [
  {
    id: 'vaishno_devi',
    name: 'Shri Mata Vaishno Devi Bhawan',
    hindiName: 'श्री माता वैष्णो देवी भवन',
    location: 'Katra, Reasi (5,200 ft)',
    aartiTimings: {
      morning: '6:00 AM – 8:00 AM (Live Divya Aarti)',
      evening: '7:00 PM – 9:00 PM (Live Divya Aarti)',
    },
    peakDays: ['Saturday', 'Sunday', 'Navratri', 'New Year'],
    seniorTips: 'RFID card is mandatory at Banganga. Avail battery cars from Ardhkuwari to Bhawan (priority for 60+ yrs & medical patients). Free wheelchairs available at Bhawan dispensary.',
    darshanWaitEstimate: {
      low: '45 mins – 1.5 hrs (Weekdays 12 PM - 4 PM)',
      moderate: '2 – 3.5 hrs (Regular evenings & mornings)',
      peak: '5 – 8 hrs (Navratras, long weekends & Diwali)',
    },
    bestVisitingWindow: '1:00 PM – 4:30 PM (Post-morning rush, before evening aarti)',
    specialRules: [
      'Electronic devices, leather belts, and bags must be deposited in free Bhawan lockers.',
      'Mandatory free RFID yatra card from Katra counters before commencing trek.',
      'Cable ropeway available from Bhawan to Bhairon Ghati (₹100 round trip).',
    ],
  },
  {
    id: 'raghunath_mandir',
    name: 'Raghunath Mandir',
    hindiName: 'रघुनाथ मंदिर',
    location: 'Raghunath Bazaar, Old Jammu City',
    aartiTimings: {
      morning: '6:30 AM – 7:30 AM',
      evening: '7:30 PM – 8:30 PM',
    },
    peakDays: ['Sunday', 'Ram Navami', 'Janmashtami', 'Diwali'],
    seniorTips: 'Complete step-free entry from inner chowk courtyard. Ample benches available in shaded corridors for rest.',
    darshanWaitEstimate: {
      low: '10 – 15 mins (Weekdays afternoon 12 PM - 3 PM)',
      moderate: '25 – 45 mins (Evening Aarti & Sundays)',
      peak: '1.5 – 2.5 hrs (Ram Navami festive procession)',
    },
    bestVisitingWindow: '10:30 AM – 1:00 PM and 3:30 PM – 5:30 PM',
    specialRules: [
      'Mobile phones and cameras strictly prohibited inside sanctum sanctorum.',
      'Footwear counters available at main bazaar gate.',
    ],
  },
  {
    id: 'bawe_wali_mata',
    name: 'Bawe Wali Mata (Mahakali Mandir)',
    hindiName: 'बावे वाली माता मंदिर (बाहु किला)',
    location: 'Bahu Fort, Tawi Hilltop, Jammu',
    aartiTimings: {
      morning: '5:30 AM – 6:30 AM',
      evening: '7:00 PM – 8:00 PM',
    },
    peakDays: ['Tuesday', 'Sunday', 'Chaitra & Sharad Navratri'],
    seniorTips: 'Climbing ~40 wide steps required from parking to sanctum. Senior pilgrims can request vehicle drop-off at VIP gate near Bagh-e-Bahu.',
    darshanWaitEstimate: {
      low: '10 – 20 mins (Mon, Wed, Thu afternoons)',
      moderate: '45 – 90 mins (Sundays)',
      peak: '2 – 4 hrs (Tuesdays & Navratri Mela)',
    },
    bestVisitingWindow: 'Wednesday & Thursday between 11:00 AM and 3:00 PM',
    specialRules: [
      'Tuesdays see massive local rush of thousands carrying halwa-puri prasad.',
      'Monkeys frequent the outer fort ramparts; keep bags and prasad zipped.',
    ],
  },
  {
    id: 'shiv_khori',
    name: 'Shiv Khori Holy Cave Shrine',
    hindiName: 'शिव खोड़ी पवित्र गुफा',
    location: 'Ransoo, Pouni, Reasi (80 km from Katra)',
    aartiTimings: {
      morning: '7:00 AM – 8:00 AM',
      evening: '6:30 PM – 7:30 PM',
    },
    peakDays: ['Monday', 'Maha Shivratri', 'Shravan month'],
    seniorTips: 'Cave entrance is narrow and natural. 3 km trek from Ransoo base; ponies and battery carts available on the newly paved stretch.',
    darshanWaitEstimate: {
      low: '15 – 30 mins (Weekdays)',
      moderate: '1 – 2 hrs (Weekends & Shravan Mondays)',
      peak: '4 – 7 hrs (Maha Shivratri 3-day Mela)',
    },
    bestVisitingWindow: '8:30 AM – 12:00 PM on non-Mondays',
    specialRules: [
      'Cave naturally exudes natural limestone moisture; wear non-slip socks.',
      'Oxygen levels can be slightly lower inside deep narrow natural fissure.',
    ],
  },
  {
    id: 'kol_kandoli',
    name: 'Kol Kandoli Mandir (First Darshan)',
    hindiName: 'कोल कंडोली मंदिर (प्रथम दर्शन)',
    location: 'Nagrota (14 km from Jammu City)',
    aartiTimings: {
      morning: '6:00 AM – 7:00 AM',
      evening: '7:00 PM – 8:00 PM',
    },
    peakDays: ['Sunday', 'Navratri start'],
    seniorTips: 'Ground level temple complex with zero stairs. Very easy access for pilgrims traveling on Jammu-Srinagar Highway.',
    darshanWaitEstimate: {
      low: '5 – 10 mins (Daily)',
      moderate: '20 – 35 mins (Evening aarti)',
      peak: '1 – 1.5 hrs (First day of Navratri)',
    },
    bestVisitingWindow: 'Open throughout day 5:00 AM to 9:30 PM',
    specialRules: [
      'Traditionally visited by yatris before proceeding to Katra as the first prayer station.',
    ],
  },
  {
    id: 'ranbireshwar_mandir',
    name: 'Ranbireshwar Mandir (Shivalinga Complex)',
    hindiName: 'रणवीरेश्वर मंदिर',
    location: 'Shalimar Road, Old Jammu City',
    aartiTimings: {
      morning: '6:00 AM – 7:00 AM',
      evening: '7:00 PM – 8:00 PM',
    },
    peakDays: ['Monday', 'Maha Shivratri', 'Shravan'],
    seniorTips: 'Spacious flat courtyard with shade. Houses 12 natural crystal Shivalingas and one of North India’s largest single-stone Lingams.',
    darshanWaitEstimate: {
      low: '5 – 15 mins',
      moderate: '30 – 45 mins (Mondays)',
      peak: '2 – 3 hrs (Maha Shivratri)',
    },
    bestVisitingWindow: '9:00 AM – 12:30 PM and 4:00 PM – 6:30 PM',
    specialRules: [
      'Dharmarth Trust manages facilities; water and Bilva leaves available outside.',
    ],
  },
];

// Calculate estimated real-time crowd level based on day and hour
export const getDynamicCrowdLevel = (temple: TempleCrowdInfo): {
  level: 'Low' | 'Moderate' | 'High' | 'Peak';
  color: string;
  badgeBg: string;
  waitText: string;
} => {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const hour = now.getHours();

  const isPeakDay = temple.peakDays.includes(dayName);
  const isAartiHour = (hour >= 6 && hour <= 8) || (hour >= 18 && hour <= 20);
  const isMiddayLull = hour >= 12 && hour <= 15;

  if (isPeakDay && isAartiHour) {
    return {
      level: 'Peak',
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/15 border-rose-500/30',
      waitText: temple.darshanWaitEstimate.peak,
    };
  }

  if (isPeakDay || isAartiHour) {
    return {
      level: 'High',
      color: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/15 border-amber-500/30',
      waitText: temple.darshanWaitEstimate.moderate,
    };
  }

  if (isMiddayLull) {
    return {
      level: 'Low',
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30',
      waitText: temple.darshanWaitEstimate.low,
    };
  }

  return {
    level: 'Moderate',
    color: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-500/15 border-blue-500/30',
    waitText: temple.darshanWaitEstimate.moderate,
  };
};

interface TempleCrowdGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TempleCrowdGuide: React.FC<TempleCrowdGuideProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTemple, setSelectedTemple] = useState<TempleCrowdInfo>(TEMPLE_CROWD_DATA[0]);

  if (!isOpen) return null;

  const currentCrowd = getDynamicCrowdLevel(selectedTemple);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95 relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">
                Temple Crowd & Aarti Timings
              </h2>
              <p className="text-[11px] text-stone">
                Real-Time Estimated Wait & Senior Citizen Darshan Advice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface border border-border text-stone hover:text-ink flex items-center justify-center transition-colors apple-press"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Temple Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {TEMPLE_CROWD_DATA.map((temple) => (
            <button
              key={temple.id}
              onClick={() => setSelectedTemple(temple)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTemple.id === temple.id
                  ? 'bg-primary text-white shadow-xs font-bold'
                  : 'bg-surface border border-border text-stone hover:text-ink'
              }`}
            >
              {temple.name.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Selected Temple Active Card */}
        <div className="p-4 rounded-3xl bg-surface border border-border space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
                <span>{selectedTemple.name}</span>
              </h3>
              <div className="text-xs text-primary font-medium">{selectedTemple.hindiName}</div>
              <div className="text-[11px] text-stone flex items-center gap-1 mt-0.5">
                <MapPin size={11} />
                <span>{selectedTemple.location}</span>
              </div>
            </div>

            {/* Dynamic Status Pill */}
            <div className={`p-2.5 rounded-2xl border ${currentCrowd.badgeBg} text-right shrink-0`}>
              <div className="text-[10px] font-bold text-stone uppercase tracking-wider">
                Current Estimated Queue
              </div>
              <div className={`text-xs font-black flex items-center gap-1 justify-end ${currentCrowd.color}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span>{currentCrowd.level} Crowd</span>
              </div>
              <div className="text-[10px] text-stone font-medium mt-0.5">
                ~{currentCrowd.waitText.split('(')[0].trim()}
              </div>
            </div>
          </div>

          {/* Aarti Timings */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-card border border-border space-y-1">
              <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Flame size={12} />
                <span>Mangala Morning Aarti</span>
              </div>
              <div className="font-bold text-ink text-[11px]">
                {selectedTemple.aartiTimings.morning}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border space-y-1">
              <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} />
                <span>Sandhya Evening Aarti</span>
              </div>
              <div className="font-bold text-ink text-[11px]">
                {selectedTemple.aartiTimings.evening}
              </div>
            </div>
          </div>

          {/* Best Visiting Window */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
            <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} />
              <span>Recommended Low-Rush Window</span>
            </div>
            <div className="font-bold text-ink text-xs">
              {selectedTemple.bestVisitingWindow}
            </div>
            <div className="text-[10px] text-stone">
              Peak days to avoid long queues: {selectedTemple.peakDays.join(', ')}
            </div>
          </div>

          {/* Senior & Accessibility Tips */}
          <div className="p-3 rounded-2xl bg-card border border-border space-y-1.5 text-xs">
            <div className="font-bold text-ink text-xs flex items-center gap-1.5">
              <span>🧓 Elder & Senior Pilgrim Advice</span>
            </div>
            <p className="text-[11px] text-stone leading-relaxed">
              {selectedTemple.seniorTips}
            </p>
          </div>

          {/* Special Guidelines */}
          <div className="space-y-1 text-xs">
            <div className="text-[11px] font-bold text-stone uppercase tracking-wider">
              Essential Rules & Locker Notice
            </div>
            <ul className="space-y-1 text-[11px] text-stone">
              {selectedTemple.specialRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-border text-[10px] text-stone">
          <span>Official Trust Timings Verified Oct 2026</span>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
