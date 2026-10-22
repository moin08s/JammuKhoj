import React from 'react';
import { Building, Phone, MapPin, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

interface StayOption {
  name: string;
  category: 'SMVDSB Katra' | 'Jammu Yatri Niwas' | 'Charitable Sarai';
  location: string;
  roomTypes: string;
  rateRange: string;
  bookingMethod: string;
  phone: string;
  features: string[];
}

const VERIFIED_STAYS: StayOption[] = [
  {
    name: 'Niharika Complex (SMVDSB)',
    category: 'SMVDSB Katra',
    location: 'Near Bus Stand, Katra Base Camp',
    roomTypes: 'AC Rooms, Non-AC Rooms & Dormitory Beds',
    rateRange: '₹150 (Dorm bed) to ₹1,800 (AC Suite)',
    bookingMethod: 'Official Portal (online.maavaishnodevi.org) & On-Spot Central Reception',
    phone: '01991-232029',
    features: ['24x7 Hot Water', 'Shrine Board Bhojanalaya', 'Free Cloakroom', 'Yatra Slip Counter']
  },
  {
    name: 'Shakti Bhawan & Trikuta Bhawan',
    category: 'SMVDSB Katra',
    location: 'Opposite Railway Station / Near Bus Stand, Katra',
    roomTypes: 'Budget Dormitory & Family Rooms',
    rateRange: '₹120 – ₹200 per bed',
    bookingMethod: 'Central Enquiry & Reservation Counter, Katra',
    phone: '01991-232297',
    features: ['Large Luggage Lockers', 'Pure Sattvic Canteen', 'Medical Aid Post']
  },
  {
    name: 'Yatri Niwas (Jammu Tawi Railway Station)',
    category: 'Jammu Yatri Niwas',
    location: 'Platform 1 Approach Road, Jammu Tawi',
    roomTypes: 'Transit AC Retiring Rooms & Dormitories',
    rateRange: '₹200 (Dorm) to ₹1,400 (AC Double)',
    bookingMethod: 'IRCTC Portal & Station Master Booking Counter',
    phone: '0191-2470075',
    features: ['Luggage Deposit', 'Direct Platform Access', 'Executive Lounge']
  },
  {
    name: 'Ashirwad Complex (Bhawan)',
    category: 'SMVDSB Katra',
    location: 'Directly at Holy Bhawan (Sanctum)',
    roomTypes: 'Beds & Rooms for Yatris wishing to stay near Sanctum',
    rateRange: '₹150 – ₹1,200',
    bookingMethod: 'Book minimum 30 days ahead online at maavaishnodevi.org',
    phone: '01991-232075',
    features: ['Adjacent to Darshan Queue', 'Free Blankets', '24x7 Hot Water']
  }
];

export const DharamshalaAndStayGuide: React.FC = () => {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3 text-ink">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-ink text-sm">Verified Shrine Board Dharamshalas & Stay</h3>
            <p className="text-[11px] text-stone">Government & SMVDSB regulated non-commercial accommodations</p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Zero Surge
        </span>
      </div>

      <div className="space-y-2.5">
        {VERIFIED_STAYS.map((stay, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-surface border border-border space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                  {stay.category}
                </span>
                <h4 className="font-serif font-bold text-ink text-sm mt-1">{stay.name}</h4>
                <div className="text-[11px] text-stone flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span>{stay.location}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-card px-2 py-1 rounded-md border border-border">
                  {stay.rateRange}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone space-y-0.5 bg-card p-2 rounded-lg border border-border">
              <div>• <strong>Room Types:</strong> {stay.roomTypes}</div>
              <div>• <strong>Booking:</strong> {stay.bookingMethod}</div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap gap-1">
                {stay.features.map((f, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-surface text-stone border border-border">
                    {f}
                  </span>
                ))}
              </div>

              <a
                href={`tel:${stay.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary-dark transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Call {stay.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
