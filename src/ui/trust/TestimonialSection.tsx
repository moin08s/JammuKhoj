import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Heart } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  text: string;
  rating: number;
  highlight: string;
  date: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Smt. Rama Devi (64 yrs)',
    role: 'Senior Pilgrim',
    location: 'Varanasi, UP',
    text: 'Traveling to Vaishno Devi with knee pain was daunting, but the 1-Tap Senior mode and battery car guidelines in this app made our entire darshan comfortable. The return train buffer gave my family complete peace of mind.',
    rating: 5,
    highlight: 'Senior Mode & Battery Car Guide',
    date: 'October 2026'
  },
  {
    id: 't2',
    name: 'Rajesh Verma',
    role: 'Transit Passenger',
    location: 'New Delhi',
    text: 'Had an 8-hour layover between Vande Bharat and my onward flight. The Express Itinerary took me straight to Raghunath Bazaar, Bawe Wali Mata, and back with 1.5 hours to spare. Best offline travel companion in J&K!',
    rating: 5,
    highlight: 'Safe Station Return Buffer',
    date: 'September 2026'
  },
  {
    id: 't3',
    name: 'Dr. Ananya Sharma',
    role: 'Dogra Heritage Researcher',
    location: 'Jammu (Old City)',
    text: 'Finally an app that accurately documents authentic Dogri culinary traditions like Kaladi Kulcha and GI-certified Basohli paintings without tourist commercialization or fake shops. Highly recommended.',
    rating: 5,
    highlight: 'Authentic GI & Cultural Heritage',
    date: 'October 2026'
  },
  {
    id: 't4',
    name: 'Harpreet Singh & Family',
    role: 'Family Holiday',
    location: 'Amritsar, Punjab',
    text: 'The Matador mini-bus route numbers and verified auto fare chart saved us from paying triple the price outside Jammu Tawi station. Everything worked offline without a SIM internet connection.',
    rating: 5,
    highlight: 'Verified Local Fares Matrix',
    date: 'August 2026'
  }
];

export const TestimonialSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const item = TESTIMONIALS[currentIndex];

  return (
    <section className={`bg-gradient-to-br from-amber-50/70 via-white to-primary-soft/30 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-850 rounded-2xl p-5 border border-amber-200/60 dark:border-stone-800 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary text-white">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-ink text-base">Traveler Experiences & Trust</h3>
            <p className="text-xs text-stone">Loved by pilgrims, transit travelers & locals</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-surface active:scale-95 transition-all text-stone hover:text-ink"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-surface active:scale-95 transition-all text-stone hover:text-ink"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-card backdrop-blur-xs rounded-xl p-4 border border-border shadow-xs relative">
        <Quote className="w-8 h-8 text-amber-500/20 absolute top-3 right-3 pointer-events-none" />
        
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          ))}
          <span className="text-xs font-semibold text-ink ml-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
            {item.highlight}
          </span>
        </div>

        <p className="text-sm text-ink leading-relaxed italic mb-3">
          "{item.text}"
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
          <div>
            <div className="font-semibold text-ink">{item.name}</div>
            <div className="text-stone">{item.role} • {item.location}</div>
          </div>
          <div className="text-[11px] text-stone">{item.date}</div>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-stone-300 dark:bg-stone-700'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
