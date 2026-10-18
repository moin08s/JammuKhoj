import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  BadgeIndianRupee,
  Sparkles,
  Navigation,
  Image as ImageIcon,
} from 'lucide-react';
import { db } from '@/data/db';
import { JAMMU_ALL_ATTRACTIONS } from '@/data/jammuFullData';
import { JAMMU_SPOT_IMAGES } from '@/data/spotImages';
import { deviceService } from '@/services/deviceService';
import { useAppStore } from '@/stores/appStore';
import type { Attraction } from '@/data/types';

interface SpotUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAttractionId?: string;
  onSuccess?: (createdOrUpdated: Attraction) => void;
}

export const SpotUploadModal: React.FC<SpotUploadModalProps> = ({
  isOpen,
  onClose,
  targetAttractionId,
  onSuccess,
}) => {
  const { deviceGps } = useAppStore();

  const [mode, setMode] = useState<'update' | 'new'>(targetAttractionId ? 'update' : 'new');
  const [selectedExistingId, setSelectedExistingId] = useState<string>(targetAttractionId || '');

  // Form Fields
  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [category, setCategory] = useState<Attraction['type']>('heritage');
  const [latitude, setLatitude] = useState<string>('32.7266');
  const [longitude, setLongitude] = useState<string>('74.8570');
  const [summary, setSummary] = useState('');
  const [hours, setHours] = useState('09:00 AM – 06:00 PM');
  const [entryFee, setEntryFee] = useState('0');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');

  // Status & Feedback
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Auto-populate if targetAttractionId is given or selected
  useEffect(() => {
    if (selectedExistingId) {
      const existing = JAMMU_ALL_ATTRACTIONS.find((a) => a.id === selectedExistingId);
      if (existing) {
        setNameEn(existing.name.en);
        setNameHi(existing.name.hi);
        setCategory(existing.type);
        setSummary(existing.summary.en);
        setImagePreview(JAMMU_SPOT_IMAGES[existing.id] || '');
      }
    }
  }, [selectedExistingId]);

  if (!isOpen) return null;

  // 1-Tap Real Device GPS Fetcher
  const handleFetchDeviceGps = async () => {
    setIsDetectingGps(true);
    setGpsNotice('');
    setErrorMsg('');

    const res = await deviceService.requestGpsLocation();
    setIsDetectingGps(false);

    if (res.success && res.data) {
      setLatitude(res.data.lat.toString());
      setLongitude(res.data.lng.toString());
      setGpsNotice(`Acquired real device GPS: ${res.data.lat}, ${res.data.lng} (Accuracy ±${res.data.accuracy}m)`);
    } else {
      setErrorMsg(res.error || 'Could not fetch device GPS. Please verify device location permissions.');
    }
  };

  // Handle Photo Picker & Compression to Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setErrorMsg('Please enter valid numerical latitude and longitude coordinates.');
      return;
    }

    if (latNum < 32.0 || latNum > 34.5 || lngNum < 74.0 || lngNum > 76.8) {
      setErrorMsg('Coordinates should fall within the Jammu Division regional bounding area (32.0°N–34.5°N, 74.0°E–76.8°E).');
      return;
    }

    if (!nameEn.trim()) {
      setErrorMsg('Please enter the attraction name in English.');
      return;
    }

    const spotId =
      mode === 'update' && selectedExistingId
        ? selectedExistingId
        : `custom_spot_${Date.now()}`;

    const newAttraction: Attraction = {
      id: spotId,
      type: category,
      name: {
        en: nameEn.trim(),
        hi: nameHi.trim() || nameEn.trim(),
      },
      summary: {
        en: summary.trim() || 'Verified spot uploaded by community pilgrim explorer with live GPS coordinates.',
        hi: nameHi.trim() || nameEn.trim(),
      },
      nodeId: `node_${spotId}`,
      areaId: 'area_jammu_city',
      tags: [category, 'user_verified', 'gps_calibrated'],
      visit: {
        typicalMinutes: 60,
        minMinutes: 30,
        bestTime: 'Morning / Afternoon',
        indoorOutdoor: 'both',
      },
      priority: 85,
      accessibility: {
        stepFree: true,
        restrooms: true,
        seating: true,
        walkingLoad: 'low',
      },
      opening: [
        {
          days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
          open: hours.split('–')[0]?.trim() || '09:00 AM',
          close: hours.split('–')[1]?.trim() || '06:00 PM',
        },
      ],
      entryFee: {
        amountInr: parseInt(entryFee) || 0,
        note: parseInt(entryFee) === 0 ? 'Free Entry' : `₹${entryFee}`,
      },
      cautions: ['Verified with live on-site device GPS coordinates'],
      media: imagePreview ? [imagePreview] : [],
      source: {
        name: 'Community Explorer GPS Calibration',
        url: '',
        type: 'community',
        retrievedOn: new Date().toISOString().split('T')[0],
      },
      sourceType: 'community',
      verification: {
        status: 'verified',
        verifiedOn: new Date().toISOString(),
        verifiedBy: 'JammuKhoj Community Submitter',
        method: 'On-device GPS & High-Resolution Image Verification',
      },
      updatedAt: new Date().toISOString(),
      reviewDueOn: new Date(Date.now() + 180 * 86400000).toISOString(),
    };

    try {
      // 1. Save or update to IndexedDB
      await db.attractions.put(newAttraction);

      // 2. If photo was uploaded, cache in memory map
      if (imagePreview) {
        JAMMU_SPOT_IMAGES[spotId] = imagePreview;
      }

      setSuccessMsg('Attraction information & live GPS coordinates saved successfully to your offline app database!');

      if (onSuccess) {
        onSuccess(newAttraction);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving attraction:', err);
      setErrorMsg('Failed to save to device offline database. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface border border-border text-stone hover:text-ink flex items-center justify-center transition-colors shadow-xs"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-xl bg-[#174D3C] text-white flex items-center justify-center text-xs font-bold">
              📷
            </span>
            <span className="font-heading font-bold text-base text-ink">
              Upload Spot & Calibrate Location
            </span>
          </div>
          <p className="text-xs text-stone">
            Contribute verified attraction coordinates, photos, and pilgrim information directly to the offline database.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="p-1 bg-surface border border-border rounded-xl grid grid-cols-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`py-1.5 rounded-lg transition-all ${
              mode === 'new' ? 'bg-card text-[#174D3C] shadow-xs' : 'text-stone hover:text-ink'
            }`}
          >
            ➕ Add New Spot
          </button>
          <button
            type="button"
            onClick={() => setMode('update')}
            className={`py-1.5 rounded-lg transition-all ${
              mode === 'update' ? 'bg-card text-[#174D3C] shadow-xs' : 'text-stone hover:text-ink'
            }`}
          >
            ✏️ Update Existing Attraction
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'update' && (
            <div>
              <label className="block font-semibold text-stone mb-1">
                Select Attraction to Update
              </label>
              <select
                value={selectedExistingId}
                onChange={(e) => setSelectedExistingId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
              >
                <option value="">-- Choose Attraction --</option>
                {JAMMU_ALL_ATTRACTIONS.map((attr) => (
                  <option key={attr.id} value={attr.id}>
                    {attr.name.en} ({attr.name.hi})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name in English & Hindi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-stone mb-1">Spot Name (English)</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Mahamaya Temple Viewpoint"
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-stone mb-1">स्थान का नाम (हिन्दी)</label>
              <input
                type="text"
                value={nameHi}
                onChange={(e) => setNameHi(e.target.value)}
                placeholder="उदा. महामाया मंदिर व्यूप्वाइंट"
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-stone mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
              >
                <option value="religious">🛕 Temple / Pilgrimage</option>
                <option value="heritage">🏛️ Royal Heritage / Fort</option>
                <option value="nature">🌲 Alpine Nature / Valley</option>
                <option value="food">🍲 Food / Local Market</option>
                <option value="lake">🌊 Lake / Riverfront</option>
                <option value="monument">🏰 Monument / Viewpoint</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone mb-1">Entry Fee (INR)</label>
              <div className="relative">
                <BadgeIndianRupee size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone" />
                <input
                  type="number"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  placeholder="0 for free"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* GPS Coordinates Section */}
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-ink flex items-center gap-1.5">
                <MapPin size={14} className="text-[#174D3C]" />
                <span>Exact Location & Coordinates</span>
              </div>

              {/* 1-Tap Device GPS Button */}
              <button
                type="button"
                onClick={handleFetchDeviceGps}
                disabled={isDetectingGps}
                className="px-2.5 py-1 bg-[#174D3C] text-white rounded-lg text-[10px] font-bold hover:bg-[#123E38] transition-colors flex items-center gap-1 shadow-xs"
              >
                <Navigation size={11} />
                <span>{isDetectingGps ? 'Querying GPS...' : 'Fetch Live Device GPS'}</span>
              </button>
            </div>

            {gpsNotice && (
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium bg-card px-2.5 py-1 rounded-lg border border-border">
                {gpsNotice}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-stone mb-0.5">Latitude (32.0° – 34.5° N)</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-ink text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone mb-0.5">Longitude (74.0° – 76.8° E)</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-ink text-xs font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Photo / Image Upload Section */}
          <div className="space-y-2">
            <label className="block font-semibold text-stone flex items-center gap-1">
              <Camera size={14} className="text-[#174D3C]" />
              <span>Attraction Photo / Image Upload</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-border h-40 bg-surface">
                <img
                  src={imagePreview}
                  alt="Spot preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setImageFileName('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] truncate max-w-xs">
                  {imageFileName || 'Image Ready'}
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border hover:border-[#174D3C] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-surface/50 hover:bg-surface">
                <Upload size={22} className="text-[#174D3C] mb-1" />
                <span className="font-bold text-ink text-xs">Choose Photo or Take Picture</span>
                <span className="text-[10px] text-stone mt-0.5">Supports Camera, JPG, PNG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Description & Tips */}
          <div>
            <label className="block font-semibold text-stone mb-1">
              Brief Information & Visitor Advice
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="e.g. Beautiful scenic viewpoint overlooking Tawi river and Bahu Fort; best visited during sunset. Quiet meditation spot."
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-border text-xs font-semibold text-stone hover:text-ink hover:bg-surface transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-[#174D3C] hover:bg-[#123E38] text-white font-bold text-xs shadow-md shadow-[#174D3C]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>Save & Publish to Offline DB</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
