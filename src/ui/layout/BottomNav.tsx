import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, CalendarDays, ShieldAlert, Home, Bus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/explore', label: 'Explore', icon: Compass, end: false },
    { to: '/plan', label: '1-Tap Plan', icon: CalendarDays, end: false, badge: '⚡' },
    { to: '/transport', label: 'Transport', icon: Bus, end: false },
    { to: '/safety', label: 'Safety', icon: ShieldAlert, end: false },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 apple-glass border-t border-border/60 shadow-lg">
      <nav
        className="max-w-md mx-auto flex items-center justify-around h-16 px-3"
        role="navigation"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 apple-press transition-colors ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-stone hover:text-ink font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-primary/25'
                          : 'text-stone'
                      }`}
                    >
                      <Icon size={19} strokeWidth={isActive ? 2.3 : 1.9} />
                    </div>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 text-[9px] bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-1 text-[11px] tracking-tight ${
                      isActive ? 'font-bold text-primary' : 'text-stone'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

