import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Edit3, MapPin, BadgeIndianRupee, Clock } from 'lucide-react';

interface ReportUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotName?: string;
  defaultType?: 'timing' | 'fare' | 'location' | 'general';
}

export const ReportUpdateModal: React.FC<ReportUpdateModalProps> = ({
  isOpen,
  onClose,
  spotName = 'General Jammu Destination',
  defaultType = 'general',
}) => {
  const [reportType, setReportType] = useState(defaultType);
  const [details, setDetails] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    try {
      const reports = JSON.parse(localStorage.getItem('jammukhoj_community_reports') || '[]');
      reports.push({
        spotName,
        reportType,
        details,
        contactEmail,
        date: new Date().toISOString(),
      });
      localStorage.setItem('jammukhoj_community_reports', JSON.stringify(reports));
    } catch (_) {}

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setDetails('');
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 id="report-modal-title" className="font-serif font-bold text-sm text-ink">
                Suggest Correction or Update
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                {spotName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-ink">Thank you, Yatri!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your suggestion has been logged for our local Jammu research team to verify and update in the next offline data bundle.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">What needs an update?</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'fare', label: 'Tariff / Fare', icon: BadgeIndianRupee },
                  { id: 'timing', label: 'Opening Timings', icon: Clock },
                  { id: 'location', label: 'GPS / Route', icon: MapPin },
                  { id: 'general', label: 'General Info', icon: Edit3 },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = reportType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setReportType(type.id as any)}
                      className={`p-2 rounded-xl border flex items-center gap-2 font-medium transition-all ${
                        isSelected
                          ? 'bg-primary-soft text-primary border-primary font-bold shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="report-details" className="font-semibold text-slate-700">
                Correction Details / New Information:
              </label>
              <textarea
                id="report-details"
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. Fare for Katra prepaid auto has changed to ₹120, or temple morning aarti now opens at 6:00 AM..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-ink focus:ring-2 focus:ring-primary/40 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="report-email" className="font-semibold text-slate-700">
                Email / Mobile (Optional, for verification credit):
              </label>
              <input
                id="report-email"
                type="text"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-ink focus:ring-2 focus:ring-primary/40 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-white font-semibold flex items-center gap-1.5 hover:bg-primary-dark transition-colors shadow-xs active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Update</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
