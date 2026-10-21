import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Layers,
  Locate,
  List,
  Map as MapIcon,
  Navigation,
  Phone,
  Clock,
  Sparkles,
  X,
  ExternalLink,
  MapPin,
  Search,
  Compass,
  ArrowRight,
  Share2,
  Check,
  Star,
  Info,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  SlidersHorizontal,
  CheckCircle2,
  Bookmark,
  RotateCcw,
  WifiOff,
} from 'lucide-react';
import { db } from '@/data/db';
import type { Attraction, Node, HelpPoint } from '@/data/types';
import { JAMMU_ALL_ATTRACTIONS, JAMMU_REGIONAL_NODES } from '@/data/jammuFullData';
import { getSpotImage } from '@/data/spotImages';
import { SourceBadge } from '@/ui/trust/SourceBadge';
import { useCommandControlStore } from '@/stores/commandControlStore';
import { OfflineCityDisasterMap } from '@/features/map/OfflineCityDisasterMap';

// Jammu Division map center & initial zoom
const JAMMU_CENTER: [number, number] = [74.868, 32.726]; // [lng, lat]
const JAMMU_ZOOM = 11.5;

// Tile Styles with rock-solid, verified HTTPS endpoints
type MapStyleKey = 'osm' | 'voyager' | 'positron' | 'satellite' | 'topo' | 'offline';

const MAP_STYLES: Record<MapStyleKey, { label: string; url: string; attribution: string }> = {
  osm: {
    label: 'Standard OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  voyager: {
    label: 'Modern Streets (Carto)',
    url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors, © CARTO',
  },
  positron: {
    label: 'Clean Light',
    url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors, © CARTO',
  },
  satellite: {
    label: 'Satellite Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, Maxar, Earthstar Geographics',
  },
  topo: {
    label: 'Mountain Topo',
    url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
  },
  offline: {
    label: 'Tactical Offline GIS Map',
    url: '',
    attribution: '© JammuKhoj Offline GIS Vector Engine',
  },
};

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [nodes, setNodes] = useState<Node[]>(JAMMU_REGIONAL_NODES);
  const [attractions, setAttractions] = useState<Attraction[]>(JAMMU_ALL_ATTRACTIONS);
  const [helpPoints, setHelpPoints] = useState<HelpPoint[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['attr_amar_mahal', 'attr_raghunath_temple', 'attr_bhaderwah']);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Map settings
  const [currentStyle, setCurrentStyle] = useState<MapStyleKey>('osm');
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [forceOfflineMap, setForceOfflineMap] = useState<boolean>(() => {
    const s = routeLocation.state as any;
    return Boolean(s?.offlineMode || !navigator.onLine);
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setForceOfflineMap(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filters & State - Full categories
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'temples' | 'heritage' | 'valleys' | 'lakes' | 'border' | 'transit'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [selectedPoi, setSelectedPoi] = useState<any | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Directions Polyline state
  const [routeInfo, setRouteInfo] = useState<{
    destinationName: string;
    distanceKm: number;
    durationMins: number;
    fareEstimate: string;
  } | null>(null);

  // Command & Control Store Integration for Disaster Hazard & Safe Haven Markers
  const { activeAlerts, locations: crowdLocations, triggerEmergencyModal, isRouteBlocked } = useCommandControlStore();

  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Ensure database has full dataset and set state
  useEffect(() => {
    async function initData() {
      try {
        const [allNodes, allAttrs, allHps] = await Promise.all([
          db.nodes.toArray(),
          db.attractions.toArray(),
          db.helpPoints.toArray(),
        ]);

        // If Dexie has full set, use it; otherwise fallback to complete seed and re-populate
        if (allAttrs.length >= 25 && allNodes.length >= 10) {
          setNodes(allNodes);
          setAttractions(allAttrs);
        } else {
          setNodes(JAMMU_REGIONAL_NODES);
          setAttractions(JAMMU_ALL_ATTRACTIONS);
          // Auto sync to Dexie
          db.attractions.bulkPut(JAMMU_ALL_ATTRACTIONS).catch(() => {});
          db.nodes.bulkPut(JAMMU_REGIONAL_NODES).catch(() => {});
        }
        setHelpPoints(allHps);
      } catch (e) {
        setNodes(JAMMU_REGIONAL_NODES);
        setAttractions(JAMMU_ALL_ATTRACTIONS);
      }
    }
    initData();
  }, []);

  // Initialize MapLibre with resize handlers
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'base-tiles': {
            type: 'raster',
            tiles: [MAP_STYLES[currentStyle].url],
            tileSize: 256,
            attribution: MAP_STYLES[currentStyle].attribution,
          },
        },
        layers: [
          {
            id: 'base-tiles-layer',
            type: 'raster',
            source: 'base-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: JAMMU_CENTER,
      zoom: JAMMU_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

    // Crucial for container sizing
    map.on('load', () => {
      map.resize();
    });

    const timer1 = setTimeout(() => map.resize(), 150);
    const timer2 = setTimeout(() => map.resize(), 500);

    const handleResize = () => map.resize();
    window.addEventListener('resize', handleResize);

    mapRef.current = map;

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Switch map tile layers
  const switchMapStyle = (styleKey: MapStyleKey) => {
    setCurrentStyle(styleKey);
    setShowStyleMenu(false);

    if (styleKey === 'offline') {
      setForceOfflineMap(true);
      showToast('Switched to Tactical Offline GIS Map (Zero Data Needed)');
      return;
    }

    setForceOfflineMap(false);
    const map = mapRef.current;
    if (!map) return;

    map.setStyle({
      version: 8,
      sources: {
        'base-tiles': {
          type: 'raster',
          tiles: [MAP_STYLES[styleKey].url],
          tileSize: 256,
          attribution: MAP_STYLES[styleKey].attribution,
        },
      },
      layers: [
        {
          id: 'base-tiles-layer',
          type: 'raster',
          source: 'base-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    });

    setTimeout(() => map.resize(), 200);
  };

  // Filtered attractions based on category and search
  const filteredAttractions = useMemo(() => {
    return attractions.filter((a) => {
      if (activeFilter === 'temples' && a.type !== 'religious') return false;
      if (activeFilter === 'heritage' && a.type !== 'heritage' && a.type !== 'museum') return false;
      if (activeFilter === 'valleys' && a.zone !== 'offbeat_valley' && a.type !== 'valley') return false;
      if (activeFilter === 'lakes' && a.type !== 'lake' && a.type !== 'waterfall') return false;
      if (activeFilter === 'border' && a.zone !== 'border_nature' && !a.tags.includes('border') && !a.tags.includes('wildlife')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = a.name.en.toLowerCase().includes(q) || a.name.hi.toLowerCase().includes(q);
        const matchesTags = a.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTags) return false;
      }

      return true;
    });
  }, [attractions, activeFilter, searchQuery]);

  // Update Markers whenever filtered attractions or active filter change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // 1. Attractions Pins across all categories
    if (activeFilter !== 'transit') {
      filteredAttractions.forEach((attr) => {
        const node = nodeMap.get(attr.nodeId);
        if (!node) return;

        const isSelected = selectedPoi?.data?.id === attr.id;
        const isOffbeat = !!attr.isOffbeat;
        const isTemple = attr.type === 'religious';
        const isValley = attr.zone === 'offbeat_valley' || attr.type === 'valley';
        const isLake = attr.type === 'lake' || attr.type === 'waterfall';
        const isFort = attr.type === 'heritage' || attr.type === 'museum';

        const pinColor = isTemple
          ? '#D97706' // Saffron / Gold
          : isValley
          ? '#059669' // Emerald
          : isLake
          ? '#0284C7' // Cyan/Blue
          : isFort
          ? '#0F6B73' // Regal Teal
          : isOffbeat
          ? '#8B5CF6' // Purple
          : '#E11D48'; // Rose

        const iconSymbol = isTemple
          ? '🛕'
          : isValley
          ? '🌲'
          : isLake
          ? '🚣'
          : isFort
          ? '🏰'
          : isOffbeat
          ? '✨'
          : '🏛️';

        const el = document.createElement('div');
        el.className = `group relative cursor-pointer transition-transform duration-200 select-none ${
          isSelected ? 'scale-125 z-40' : 'hover:scale-115 hover:z-30'
        }`;

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            ${
              isSelected
                ? `<span class="absolute w-10 h-10 rounded-full bg-primary/30 animate-ping"></span>`
                : ''
            }
            <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold transition-all" style="background-color: ${pinColor}; color: #fff;">
              <span>${iconSymbol}</span>
            </div>
            <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b border-white" style="background-color: ${pinColor};"></div>
          </div>
          <div class="absolute left-1/2 -translate-x-1/2 -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap pointer-events-none shadow-md">
            ${attr.name.en}
          </div>
        `;

        el.onclick = () => {
          setSelectedPoi({ type: 'attraction', data: attr, node });
          map.flyTo({ center: [node.lng, node.lat], zoom: Math.max(map.getZoom(), 13), essential: true });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([node.lng, node.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 2. Departure Transit Hubs
    if (activeFilter === 'all' || activeFilter === 'transit') {
      nodes
        .filter((n) => n.kind === 'departure')
        .forEach((hub) => {
          const isSelected = selectedPoi?.data?.id === hub.id;
          const el = document.createElement('div');
          el.className = `cursor-pointer transition-transform select-none ${
            isSelected ? 'scale-125 z-40' : 'hover:scale-115'
          }`;
          const isStation = hub.id.includes('station');
          const isAirport = hub.id.includes('airport');

          el.innerHTML = `
            <div class="w-8 h-8 rounded-xl bg-slate-900 text-white border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold">
              ${isStation ? '🚆' : isAirport ? '✈️' : '🚌'}
            </div>
          `;

          el.title = hub.name.en;
          el.onclick = () => {
            setSelectedPoi({ type: 'departure', data: hub, node: hub });
            map.flyTo({ center: [hub.lng, hub.lat], zoom: 14 });
          };

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([hub.lng, hub.lat])
            .addTo(map);

          markersRef.current.push(marker);
        });
    }

    // 3. Emergency & Help Points
    helpPoints.forEach((hp) => {
      const node = nodeMap.get(hp.nodeId);
      if (!node) return;

      const el = document.createElement('div');
      el.className =
        'w-7 h-7 rounded-full bg-rose-600 text-white border-2 border-white shadow-md flex items-center justify-center cursor-pointer hover:scale-115 text-[11px]';
      el.innerHTML = hp.kind === 'hospital' ? '🏥' : '👮';
      el.title = hp.name.en;
      el.onclick = () => setSelectedPoi({ type: 'help', data: hp, node });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([node.lng, node.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 4. Disaster Hazard Markers (Landslides, Road Blocks, Overcrowding)
    activeAlerts.forEach((hazard) => {
      const el = document.createElement('div');
      el.className = 'group relative cursor-pointer select-none transition-transform hover:scale-125 z-40';
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-10 h-10 rounded-full bg-red-600/40 animate-ping"></span>
          <div class="w-9 h-9 rounded-full bg-danger text-white border-2 border-white shadow-xl flex items-center justify-center text-sm font-bold">
            ${hazard.incidentType === 'landslide' ? '⚠️' : '🚨'}
          </div>
          <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b border-white bg-danger"></div>
        </div>
        <div class="absolute left-1/2 -translate-x-1/2 -top-8 bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none uppercase">
          ${hazard.incidentType.toUpperCase()} ALERT
        </div>
      `;

      el.onclick = () => {
        triggerEmergencyModal(hazard);
        map.flyTo({ center: hazard.coordinates, zoom: 13, essential: true });
      };

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(hazard.coordinates)
        .addTo(map);
      markersRef.current.push(marker);

      // Also render Safe Holding Concourse pin
      if (hazard.safeHoldingArea) {
        const safeEl = document.createElement('div');
        safeEl.className = 'group relative cursor-pointer select-none transition-transform hover:scale-120 z-35';
        safeEl.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-pulse"></span>
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold">
              🛡️
            </div>
          </div>
          <div class="absolute left-1/2 -translate-x-1/2 -top-7 bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
            SAFE HAVEN: ${hazard.safeHoldingArea.name}
          </div>
        `;

        safeEl.onclick = () => {
          map.flyTo({ center: hazard.safeHoldingArea.coordinates, zoom: 14.5, essential: true });
          showToast(`Safe Holding Haven: ${hazard.safeHoldingArea.name}`);
        };

        const safeMarker = new maplibregl.Marker({ element: safeEl })
          .setLngLat(hazard.safeHoldingArea.coordinates)
          .addTo(map);
        markersRef.current.push(safeMarker);
      }
    });

    // Target node focus check (if navigated with state targetNode, target, or focusSafeSpot)
    const state = routeLocation.state as any;
    if (state?.focusSafeSpot) {
      map.flyTo({ center: state.focusSafeSpot, zoom: 14.5, essential: true });
      showToast(`Navigated to Safe Evacuation Haven: ${state.safeSpotName || 'Designated Haven'}`);
    } else if (state?.hazardCoords) {
      map.flyTo({ center: state.hazardCoords, zoom: 13.5, essential: true });
    }
    const targetId = state?.targetNode || state?.target;
    if (targetId) {
      const target = nodeMap.get(targetId);
      if (target) {
        map.flyTo({ center: [target.lng, target.lat], zoom: 14.5 });
        const attr = attractions.find((a) => a.nodeId === target.id);
        if (attr) {
          setSelectedPoi({ type: 'attraction', data: attr, node: target });
        } else if (target.kind === 'departure') {
          setSelectedPoi({ type: 'departure', data: target, node: target });
        }
      }
    }
  }, [nodes, filteredAttractions, helpPoints, activeFilter, selectedPoi?.data?.id, routeLocation.state]);

  // Handle GPS location
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    setGpsActive(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        setUserLocation([longitude, latitude]);
        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 15 });

        const el = document.createElement('div');
        el.className =
          'w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl ring-4 ring-blue-500/30 animate-pulse';
        new maplibregl.Marker({ element: el }).setLngLat([longitude, latitude]).addTo(mapRef.current!);
      },
      (err) => {
        setGpsActive(false);
        showToast('Location permission unavailable. Centered on Jammu Division.');
        mapRef.current?.flyTo({ center: JAMMU_CENTER, zoom: JAMMU_ZOOM });
      },
      { timeout: 7000 }
    );
  };

  // Draw directions polyline from station/user to destination
  const handleDrawDirections = (destinationNode: Node, destName: string) => {
    const map = mapRef.current;
    if (!map) return;

    const startCoords: [number, number] = userLocation || [74.8789, 32.7058]; // User GPS or Jammu Tawi Station
    const endCoords: [number, number] = [destinationNode.lng, destinationNode.lat];

    // DISASTER CHECK: Inspect if chosen route intercepts any active landslide or hazard
    const blockedHazard = isRouteBlocked(startCoords, endCoords);

    if (blockedHazard) {
      triggerEmergencyModal(blockedHazard);
      showToast(`⚠️ ROUTE BLOCKED: ${blockedHazard.incidentType.toUpperCase()} on this axis! Diverting to safe haven.`);
    }

    // Compute rough distance in km using Haversine
    const dLat = (endCoords[1] - startCoords[1]) * (Math.PI / 180);
    const dLng = (endCoords[0] - startCoords[0]) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(startCoords[1] * (Math.PI / 180)) *
        Math.cos(endCoords[1] * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(6371 * c * 10) / 10;
    const durationMins = Math.max(15, Math.round(distanceKm * 2.8));
    const fareEstimate = distanceKm <= 5 ? '₹60–₹90' : distanceKm <= 20 ? '₹150–₹250' : '₹500–₹900';

    setRouteInfo({
      destinationName: destName,
      distanceKm,
      durationMins,
      fareEstimate,
    });

    const routeGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          startCoords,
          [(startCoords[0] + endCoords[0]) / 2 + 0.005, (startCoords[1] + endCoords[1]) / 2 + 0.003],
          endCoords,
        ],
      },
    };

    if (map.getSource('route-line')) {
      (map.getSource('route-line') as maplibregl.GeoJSONSource).setData(routeGeoJson);
    } else {
      map.addSource('route-line', {
        type: 'geojson',
        data: routeGeoJson,
      });

      map.addLayer({
        id: 'route-line-layer',
        type: 'line',
        source: 'route-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0F6B73',
          'line-width': 5,
          'line-dasharray': [1, 1.2],
        },
      });
    }

    const bounds = new maplibregl.LngLatBounds();
    bounds.extend(startCoords);
    bounds.extend(endCoords);
    map.fitBounds(bounds, { padding: 80, maxZoom: 15 });
  };

  const handleShareLocation = (name: string, lat: number, lng: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    navigator.clipboard.writeText(`${name} (Jammu): ${url}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] bg-surface overflow-hidden select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-ink text-surface px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MapLibre GL Canvas Container (Single instance, always mounted) */}
      <div
        ref={mapContainerRef}
        className={`absolute inset-0 w-full h-full ${forceOfflineMap ? 'invisible' : 'visible'}`}
      />

      {/* Offline Tactical Vector Map (Active when offline or toggled) */}
      {forceOfflineMap && (
        <div className="absolute inset-0 w-full h-full z-10 pt-28 pb-14">
          <OfflineCityDisasterMap
            selectedAlert={activeAlerts[0]}
            focusTarget={(routeLocation.state as any)?.focusSafeSpot || (routeLocation.state as any)?.hazardCoords}
          />
        </div>
      )}

      {/* Floating Modern Header */}
      <div className="absolute top-2 left-2 right-2 z-30 pointer-events-none space-y-1.5 max-w-lg mx-auto">
        {/* Top Brand Bar */}
        <div className="pointer-events-auto apple-glass rounded-2xl shadow-md border border-border px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-xl text-ink hover:bg-surface apple-press"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg overflow-hidden bg-forest-900 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/icons/icon-emblem.svg"
                  alt="JammuKhoj Emblem"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icons/icon-192.png';
                  }}
                />
              </div>
              <div>
                <span className="font-heading font-extrabold text-sm text-ink block leading-none">
                  JammuKhoj Map
                </span>
                <span className="text-[9px] text-stone font-semibold">
                  Vector Map Pack Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !forceOfflineMap;
                setForceOfflineMap(next);
                if (next) {
                  showToast('Tactical Offline GIS Map Active');
                } else {
                  showToast('Switched to Online Map Tiles');
                  setTimeout(() => mapRef.current?.resize(), 150);
                }
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border transition-all apple-press ${
                forceOfflineMap
                  ? 'bg-emerald-700 text-white border-emerald-500 shadow-sm'
                  : 'bg-emerald-100 dark:bg-emerald-950/40 text-success border-emerald-200 dark:border-emerald-800'
              }`}
              title="Toggle between Tactical Offline Map and Online Tiles"
            >
              <WifiOff size={11} className={forceOfflineMap ? 'text-white' : 'text-success'} />
              <span>{forceOfflineMap ? 'Offline GIS Active' : 'Offline Ready'}</span>
            </button>

            <button
              onClick={() => setShowStyleMenu(!showStyleMenu)}
              className="w-8 h-8 rounded-xl bg-card border border-border text-ink flex items-center justify-center apple-press shadow-xs"
              title="Change Map Layers"
              aria-label="Map layers"
            >
              <Layers size={14} className="text-primary" />
            </button>

            {showStyleMenu && (
              <div className="absolute right-3 top-14 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 min-w-[180px] space-y-1 animate-in fade-in">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone px-2 py-1">
                  Map View Layer
                </div>
                {(Object.keys(MAP_STYLES) as MapStyleKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      switchMapStyle(key);
                      setShowStyleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between apple-press ${
                      currentStyle === key
                        ? 'bg-primary text-white font-bold'
                        : 'text-stone hover:text-ink hover:bg-surface'
                    }`}
                  >
                    <span>{MAP_STYLES[key].label}</span>
                    {currentStyle === key && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="pointer-events-auto bg-white rounded-full shadow-md border border-[#E7E5E4] px-3 py-2 flex items-center justify-between text-xs text-[#78716C]">
          <div className="flex items-center gap-2 flex-1">
            <Search size={15} className="text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              placeholder="Search map (35+ spots offline)"
              className="w-full bg-transparent outline-none text-xs text-[#1C1917] placeholder:text-[#78716C]"
            />
          </div>

          <button
            onClick={() => setIsListView(!isListView)}
            className="w-7 h-7 rounded-full bg-[#F5F5F4] flex items-center justify-center text-[#78716C] hover:text-[#9E4A0C]"
            title={isListView ? 'Switch to Map' : 'Switch to List'}
          >
            <SlidersHorizontal size={13} />
          </button>
        </div>

        {/* Search Autocomplete Dropdown */}
        {showSearchDropdown && searchQuery && (
          <div className="pointer-events-auto bg-card border border-border rounded-2xl shadow-2xl max-h-56 overflow-y-auto p-2 space-y-1 animate-in fade-in">
            {filteredAttractions.slice(0, 6).map((a) => (
              <div
                key={a.id}
                onClick={() => {
                  const node = nodes.find((n) => n.id === a.nodeId);
                  if (node && mapRef.current) {
                    mapRef.current.flyTo({ center: [node.lng, node.lat], zoom: 14.5 });
                    setSelectedPoi({ type: 'attraction', data: a, node });
                  }
                  setShowSearchDropdown(false);
                }}
                className="p-2 rounded-xl hover:bg-surface cursor-pointer flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-ink truncate">{a.name.en}</div>
                  <div className="text-[10px] text-stone capitalize">
                    {a.zone?.replace('_', ' ')} · ~{a.visit.typicalMinutes}m visit
                  </div>
                </div>
                <span className="text-primary font-semibold text-[11px] shrink-0">Jump ↗</span>
              </div>
            ))}
          </div>
        )}

        {/* Scrollable Category Filter Chips - ALL 7 TRAVEL CATEGORIES */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all' as const, label: `🌟 All (${attractions.length})` },
            { id: 'temples' as const, label: '🛕 Temples & Shrines' },
            { id: 'heritage' as const, label: '🏰 Forts & Palaces' },
            { id: 'valleys' as const, label: '🌲 Alpine Valleys' },
            { id: 'lakes' as const, label: '🚣 Lakes & Waterfalls' },
            { id: 'border' as const, label: '🦅 Border & Wildlife' },
            { id: 'transit' as const, label: '🚆 Transit Hubs' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap shadow-sm border transition-all text-xs shrink-0 ${
                activeFilter === chip.id
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-card/90 backdrop-blur-md text-stone border-border hover:text-ink'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Offline Disaster Navigation Advisory Banner */}
        {forceOfflineMap && (
          <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-emerald-300 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-[11px] flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">
                <strong>Offline Tactical GIS:</strong> Safe havens, road closures, & Katra corridors active.
              </span>
            </div>
            <button
              onClick={() => {
                setForceOfflineMap(false);
                setTimeout(() => mapRef.current?.resize(), 150);
              }}
              className="text-[10px] font-bold text-white underline hover:text-emerald-200 shrink-0 ml-2"
            >
              Tiles View
            </button>
          </div>
        )}
      </div>

      {/* Floating Right Map Utility Controls */}
      <div className="absolute right-3 bottom-24 z-30 flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          className={`p-3 rounded-2xl bg-card border border-border shadow-xl text-ink hover:bg-surface transition-all active:scale-95 ${
            gpsActive ? 'text-primary ring-2 ring-primary/40' : 'text-stone'
          }`}
          aria-label="Locate me"
          title="Zoom to my GPS location"
        >
          <Locate size={18} />
        </button>

        <button
          onClick={() => {
            setSelectedPoi(null);
            mapRef.current?.flyTo({ center: JAMMU_CENTER, zoom: JAMMU_ZOOM, duration: 800 });
            showToast('Reset map to Jammu Division bounds');
          }}
          className="p-3 rounded-2xl bg-card border border-border shadow-xl text-stone hover:text-ink hover:bg-surface transition-all active:scale-95 apple-press"
          title="Reset to Jammu Division bounds"
          aria-label="Reset to map area"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Active Route Bar Banner */}
      {routeInfo && (
        <div className="absolute top-28 left-3 right-3 z-30 bg-primary text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top-4 max-w-lg mx-auto">
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
              Trip Route to {routeInfo.destinationName}
            </div>
            <div className="font-heading font-bold text-sm truncate flex items-center gap-2">
              <span>{routeInfo.distanceKm} km</span>
              <span>•</span>
              <span>~{routeInfo.durationMins} mins drive</span>
              <span>•</span>
              <span>Fare: {routeInfo.fareEstimate}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setRouteInfo(null);
              if (mapRef.current?.getLayer('route-line-layer')) {
                mapRef.current.removeLayer('route-line-layer');
                mapRef.current.removeSource('route-line');
              }
            }}
            className="p-1 rounded-full hover:bg-white/20 text-white shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Accessible List View (toggled via slider button) */}
      {isListView && (
        <div className="absolute inset-0 bg-surface p-4 overflow-y-auto space-y-3 z-30 pt-28 pb-24 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone font-semibold">
              Showing {filteredAttractions.length} destinations:
            </span>
            <button
              onClick={() => {
                setIsListView(false);
                setTimeout(() => mapRef.current?.resize(), 100);
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Back to Map View
            </button>
          </div>

          <div className="space-y-3">
            {filteredAttractions.map((attr) => (
              <div
                key={attr.id}
                onClick={() => {
                  const node = nodes.find((n) => n.id === attr.nodeId);
                  setSelectedPoi({ type: 'attraction', data: attr, node });
                  setIsListView(false);
                  setTimeout(() => {
                    if (node && mapRef.current) {
                      mapRef.current.flyTo({ center: [node.lng, node.lat], zoom: 14.5 });
                    }
                  }, 150);
                }}
                className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 cursor-pointer shadow-sm transition-all group"
              >
                {/* Spot Photographic Image */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                  <img
                    src={getSpotImage(attr.id, attr.type)}
                    alt={attr.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Bahu_Fort%2C_Jammu.jpg/960px-Bahu_Fort%2C_Jammu.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {attr.isOffbeat ? '✨ Hidden Gem' : '🏛️ Popular'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/90 text-white capitalize">
                      {attr.type}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <h4 className="font-heading font-bold text-base truncate drop-shadow">{attr.name.en}</h4>
                    <p className="text-[11px] text-white/80 truncate">{attr.name.hi}</p>
                  </div>
                </div>

                <div className="p-3.5 space-y-2">
                  <p className="text-xs text-stone line-clamp-2 leading-relaxed">{attr.summary.en}</p>
                  <div className="flex items-center justify-between text-[11px] text-stone pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={11} fill="currentColor" />
                        <span>4.8</span>
                      </span>
                      <span>•</span>
                      <span>⏱ ~{attr.visit.typicalMinutes}m</span>
                      <span>•</span>
                      <span>{attr.visit.bestTime.split('/')[0]}</span>
                    </div>
                    <span className="text-primary font-bold">View on Map ↗</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Bottom Sheet (Matching Stitch Screen 3) */}
      {selectedPoi && (
        <div className="absolute bottom-16 left-2 right-2 z-40 bg-white/95 backdrop-blur-md border border-[#E7E5E4] rounded-3xl p-3.5 shadow-2xl animate-in slide-in-from-bottom-6 max-w-lg mx-auto space-y-2.5">
          {/* Drag Handle */}
          <div className="w-10 h-1 bg-[#D6D3D1] rounded-full mx-auto mb-1" />

          {selectedPoi.type === 'attraction' ? (
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                {/* Left Thumbnail with photo badge */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-[#F5F5F4]">
                  <img
                    src={getSpotImage(selectedPoi.data.id, selectedPoi.data.type)}
                    alt={selectedPoi.data.name?.en}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Bahu_Fort%2C_Jammu.jpg/960px-Bahu_Fort%2C_Jammu.jpg';
                    }}
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    <span>📷</span>
                    <span>12</span>
                  </span>
                </div>

                {/* Right Details */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.2 rounded-full bg-[#FFF1F2] text-[#B91C1C] text-[9px] font-bold uppercase tracking-wider">
                      Dogra Heritage • 1860 AD
                    </span>
                    <span className="text-[11px] font-bold text-[#1C1917] flex items-center gap-0.5">
                      <Star size={11} className="text-amber-500 fill-amber-500" />
                      <span>4.8 (2.4k)</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-[#1C1917] truncate leading-tight">
                    {selectedPoi.data.name?.en}
                  </h3>
                  <div className="text-[11px] text-[#78716C] truncate">
                    {selectedPoi.data.name?.hi} • Heart of Jammu Old City
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#44403C] font-semibold pt-0.5">
                    <span className="flex items-center gap-1 text-[#9E4A0C]">
                      <Navigation size={11} />
                      <span>1.8 km (approx 7 min)</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-[#059669] font-bold flex items-center gap-1">
                    <Clock size={11} />
                    <span>Open • Closes 9:00 PM</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPoi(null)}
                  className="w-7 h-7 rounded-full bg-[#F5F5F4] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Free Entry Check Tag */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#15803D] bg-[#F0FDF4] p-2 rounded-xl border border-[#DCFCE7]">
                <CheckCircle2 size={13} className="shrink-0" />
                <span className="truncate">Free Entry • Shoe Locker & Pilgrim Counter available</span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={() => {
                    if (selectedPoi.node) {
                      handleDrawDirections(selectedPoi.node, selectedPoi.data.name.en);
                    }
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#9E4A0C] text-white text-xs font-bold hover:bg-[#853E0A] flex items-center justify-center gap-1.5 shadow-md shadow-[#9E4A0C]/20 transition-all active:scale-98"
                >
                  <Navigation size={14} />
                  <span>Start Offline Route</span>
                </button>

                <button
                  onClick={() => navigate(`/explore/${selectedPoi.data.id}`)}
                  className="py-2.5 px-3.5 rounded-xl border border-[#E7E5E4] text-[#1C1917] text-xs font-bold hover:bg-[#F5F5F4] flex items-center gap-1.5 transition-colors"
                >
                  <span>🎧 Audio</span>
                </button>

                <button
                  onClick={() => {
                    toggleFavorite(selectedPoi.data.id);
                  }}
                  className="w-10 h-10 rounded-xl bg-[#F5F5F4] border border-[#E7E5E4] text-[#44403C] hover:text-[#9E4A0C] flex items-center justify-center transition-colors shrink-0"
                  title="Bookmark"
                >
                  <Bookmark
                    size={16}
                    className={favorites.includes(selectedPoi.data.id) ? 'fill-[#9E4A0C] text-[#9E4A0C]' : ''}
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3 border-b border-[#F0F0F0] pb-2">
                <div>
                  <h4 className="font-heading font-bold text-base text-[#1C1917]">
                    {selectedPoi.data.name?.en || selectedPoi.data.name}
                  </h4>
                  <div className="text-xs text-[#78716C] capitalize">
                    {selectedPoi.type === 'departure' ? '🚆 Transit Departure Hub' : '🏥 Emergency Point'}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPoi(null)}
                  className="p-1.5 rounded-full bg-[#F5F5F4] text-[#78716C] hover:text-[#1C1917]"
                >
                  <X size={15} />
                </button>
              </div>
              {selectedPoi.node && (
                <button
                  onClick={() => handleDrawDirections(selectedPoi.node, selectedPoi.data.name.en || selectedPoi.data.name)}
                  className="w-full py-2.5 rounded-xl bg-[#9E4A0C] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Navigation size={14} />
                  <span>Get Directions Here</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
