import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Compass,
  Maximize2,
  MapPin,
  ArrowRight,
  Layers,
  Star,
  X,
  RotateCcw,
} from 'lucide-react';
import { JAMMU_ALL_ATTRACTIONS, JAMMU_REGIONAL_NODES } from '@/data/jammuFullData';
import { JAMMU_SPOT_IMAGES } from '@/data/spotImages';
import type { Attraction } from '@/data/types';

const JAMMU_CENTER: [number, number] = [74.868, 32.726];
const INITIAL_ZOOM = 11.2;

export const InteractiveMapPreview: React.FC = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'religious' | 'heritage' | 'valley'>('all');
  const [selectedSpot, setSelectedSpot] = useState<Attraction | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: JAMMU_CENTER,
        zoom: INITIAL_ZOOM,
        attributionControl: false,
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

      map.on('load', () => {
        map.resize();
      });

      const timer = setTimeout(() => {
        map.resize();
      }, 300);

      mapRef.current = map;

      return () => {
        clearTimeout(timer);
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.warn('MapLibre WebGL initialization fallback:', err);
      setMapError(true);
    }
  }, []);

  // Update markers on filter or spot change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const nodeMap = new Map(JAMMU_REGIONAL_NODES.map((n) => [n.id, n]));

    const filtered = JAMMU_ALL_ATTRACTIONS.filter((attr) => {
      if (activeCategory === 'all') return true;
      if (activeCategory === 'religious') return attr.type === 'religious';
      if (activeCategory === 'heritage') return attr.type === 'heritage' || attr.type === 'museum';
      if (activeCategory === 'valley') return attr.type === 'valley' || attr.zone === 'offbeat_valley';
      return true;
    });

    filtered.forEach((attr) => {
      const node = nodeMap.get(attr.nodeId);
      if (!node) return;

      const isSelected = selectedSpot?.id === attr.id;
      const el = document.createElement('div');
      el.className = `cursor-pointer transition-transform duration-150 select-none ${
        isSelected ? 'scale-125 z-40' : 'hover:scale-110'
      }`;

      const iconEmoji =
        attr.type === 'religious'
          ? '🛕'
          : attr.type === 'heritage' || attr.type === 'museum'
          ? '🏰'
          : attr.type === 'valley'
          ? '🌲'
          : '📍';

      el.innerHTML = `
        <div class="px-2 py-1 rounded-xl ${
          isSelected
            ? 'bg-[#174D3C] text-white ring-2 ring-[#F3C969] shadow-lg font-bold'
            : 'bg-white/95 dark:bg-[#152721] text-[#1C2923] dark:text-white border border-[#E3E7E4] shadow-md font-semibold'
        } text-[11px] flex items-center gap-1">
          <span>${iconEmoji}</span>
          <span class="max-w-[85px] truncate">${attr.name.en.split(' ')[0]}</span>
        </div>
      `;

      el.onclick = (e) => {
        e.stopPropagation();
        setSelectedSpot(attr);
        map.flyTo({ center: [node.lng, node.lat], zoom: 13.5, duration: 800 });
      };

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([node.lng, node.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [activeCategory, selectedSpot]);

  const handleRecenter = () => {
    setSelectedSpot(null);
    mapRef.current?.flyTo({ center: JAMMU_CENTER, zoom: INITIAL_ZOOM, duration: 700 });
  };

  return (
    <div className="space-y-2.5">
      {/* Section Header with Direct Open Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-base text-ink leading-tight flex items-center gap-2">
            <span>Interactive Map Preview</span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </h2>
          <p className="text-xs text-stone mt-0.5">
            Real vector tiles & verified coordinates for 35+ Jammu destinations
          </p>
        </div>
        <button
          onClick={() => navigate('/map')}
          className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all flex items-center gap-1.5 shadow-xs apple-press"
          aria-label="Open full map screen"
        >
          <Maximize2 size={13} />
          <span>Open Full Map</span>
        </button>
      </div>

      {/* Map Card Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-border shadow-xs bg-card">
        {mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-surface">
            <Compass size={36} className="text-stone" />
            <h3 className="font-heading font-bold text-sm text-ink">Interactive Map Ready</h3>
            <p className="text-xs text-stone max-w-sm">
              Vector tiles for Jammu Division are cached. Click below to launch the dedicated Map experience.
            </p>
            <button
              onClick={() => navigate('/map')}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs apple-press"
            >
              Launch Jammu Map
            </button>
          </div>
        ) : (
          <>
            {/* The actual MapLibre Canvas */}
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

            {/* Top Category Filter Chips Bar */}
            <div className="absolute top-2.5 left-2.5 right-14 z-20 flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto">
              {[
                { id: 'all' as const, label: 'All (36)' },
                { id: 'religious' as const, label: '🛕 Temples' },
                { id: 'heritage' as const, label: '🏰 Heritage' },
                { id: 'valley' as const, label: '🌲 Alpine Valleys' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setActiveCategory(chip.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shadow-xs border transition-all apple-press ${
                    activeCategory === chip.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'apple-glass text-ink border-border/80 hover:bg-card'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Floating Recenter Button */}
            <button
              onClick={handleRecenter}
              className="absolute bottom-3 right-3 z-20 p-2.5 rounded-xl apple-glass border border-border text-stone hover:text-ink shadow-md apple-press transition-colors"
              title="Reset view to Jammu Division"
              aria-label="Recenter map"
            >
              <RotateCcw size={15} />
            </button>

            {/* Selected Spot Floating Card Overlay */}
            {selectedSpot && (
              <div className="absolute bottom-3 left-3 right-14 z-20 apple-glass border border-border rounded-2xl p-2.5 shadow-xl max-w-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start gap-2.5">
                  <img
                    src={JAMMU_SPOT_IMAGES[selectedSpot.id] || 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=160&q=80'}
                    alt={selectedSpot.name.en}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=160&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-xs text-ink truncate">
                        {selectedSpot.name.en}
                      </h4>
                      <button
                        onClick={() => setSelectedSpot(null)}
                        className="text-stone hover:text-ink p-0.5"
                        aria-label="Close spot card"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <p className="text-[10px] text-stone truncate mt-0.5">
                      {selectedSpot.summary.en}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => navigate(`/explore/${selectedSpot.id}`)}
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ArrowRight size={10} />
                      </button>
                      <button
                        onClick={() => navigate('/map', { state: { targetNode: selectedSpot.nodeId } })}
                        className="text-[10px] font-bold text-stone hover:text-ink"
                      >
                        Direct Map →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
