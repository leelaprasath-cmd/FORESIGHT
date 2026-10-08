"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { APIProvider, Map, useMap, AdvancedMarker, Pin, MapMouseEvent } from "@vis.gl/react-google-maps";

const MAP_API_KEY = "AIzaSyB0bvqkB-Q46jHPxMs7YyJ-SM94MfYJ4tY";

const defaultCenter = { lat: 20.5937, lng: 78.9629 };
const defaultZoom = 5;

export interface DistrictProfile {
  district_name: string;
  state_name: string;
  latitude: number;
  longitude: number;
  crop_type: string;
  area_sown_ha: number;
  production_tonnes: number;
  yield_t_ha: number;
  swc_capacity_tonnes: number;
  fci_capacity_tonnes: number;
  cold_storage_capacity_tonnes: number;
  total_storage_capacity_tonnes: number;
  current_stock: string;
  rainfall_deficit_pct: number;
  temp_anomaly_c: number;
  reservoir_level_pct: number;
  population: number;
  demand_30d_tonnes: number;
  vulnerable_population: number;
  retail_price_rs: number;
  risk_score: number;
  risk_category: string;
  status_color: string;
  primary_driver: string;
  recommended_action: string;
  pincode?: string;
}

function MapHandler({
  districts,
  onSelectDistrict
}: {
  districts: DistrictProfile[];
  onSelectDistrict: (d: DistrictProfile) => void;
}) {
  const map = useMap();

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (!map || !e.detail.latLng) return;
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;

      // Find nearest district profile from dataset by GPS distance
      let closest: DistrictProfile | null = null;
      let minDistance = Infinity;

      for (const d of districts) {
        const dist = Math.hypot(d.latitude - lat, d.longitude - lng);
        if (dist < minDistance) {
          minDistance = dist;
          closest = d;
        }
      }

      if (closest && minDistance < 1.5) {
        onSelectDistrict(closest);
      } else {
        // Fallback OpenStreetMap Nominatim reverse geocoder
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
          headers: { 'Accept-Language': 'en' }
        })
          .then(res => res.json())
          .then(data => {
            if (data && data.address) {
              const name = data.address.state_district || data.address.county || data.address.city || data.address.region || "Unknown";
              const pincode = data.address.postcode || "";

              const found = districts.find(d => d.district_name.toLowerCase().includes(name.toLowerCase()));
              if (found) {
                onSelectDistrict({ ...found, pincode });
              } else if (closest) {
                onSelectDistrict({ ...closest, pincode });
              }
            }
          })
          .catch(console.error);
      }
    },
    [map, districts, onSelectDistrict]
  );

  return (
    <Map
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      onClick={handleMapClick}
      mapId="DEMO_MAP_ID"
    >
      {districts.map((d) => (
        <AdvancedMarker
          key={`${d.district_name}-${d.state_name}`}
          position={{ lat: d.latitude, lng: d.longitude }}
          onClick={() => onSelectDistrict(d)}
          title={`${d.district_name}, ${d.state_name} (${d.risk_category})`}
        >
          <Pin
            background={d.status_color}
            borderColor={"#ffffff"}
            glyphColor={"#ffffff"}
            scale={d.risk_score > 60 ? 1.2 : 0.9}
          />
        </AdvancedMarker>
      ))}
    </Map>
  );
}

export default function Home() {
  const [districts, setDistricts] = useState<DistrictProfile[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [weather, setWeather] = useState<{ temp: number; desc: string; humidity: number } | null>(null);
  const [apiUrl, setApiUrl] = useState("https://your-localtunnel-url.loca.lt");
  const [aiPrediction, setAiPrediction] = useState<{ predicted_risk: number } | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    fetch("/data/district_data.json")
      .then((res) => res.json())
      .then((data: DistrictProfile[]) => {
        setDistricts(data);
        if (data.length > 0) {
          const defaultSelect = data.find((d) => d.district_name === "Thanjavur") || data[0];
          handleSelectDistrict(defaultSelect);
        }
      })
      .catch((err) => console.error("Error loading district profiles:", err));
  }, []);

  const handleSelectDistrict = async (d: DistrictProfile) => {
    setSelectedDistrict(d);
    setIsSidebarOpen(true);
    setWeather(null);
    setAiPrediction(null);

    // Fetch Live Weather Data from OpenWeatherMap
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${d.latitude}&lon=${d.longitude}&appid=8c85517b8391d50ff56ff492a726e1e9&units=metric`
      );
      const data = await res.json();
      if (data && data.main) {
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          desc: data.weather?.[0]?.description || "Clear"
        });
      }
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }
  };

  const runAiPrediction = async () => {
    if (!selectedDistrict) return;
    setIsPredicting(true);
    try {
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "bypass-tunnel-reminder": "true" },
        body: JSON.stringify({
           rainfall_deficit_pct: selectedDistrict.rainfall_deficit_pct,
           temp_anomaly_c: selectedDistrict.temp_anomaly_c,
           area_sown_ha: selectedDistrict.area_sown_ha,
           reservoir_level_pct: selectedDistrict.reservoir_level_pct,
           yield_t_ha: selectedDistrict.yield_t_ha
        })
      });
      const data = await res.json();
      setAiPrediction(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to AI Model. Check if your Colab API is running and the URL is correct.");
    } finally {
      setIsPredicting(false);
    }
  };

  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesSearch =
        d.district_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.state_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.crop_type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "ALL" || d.risk_category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [districts, searchQuery, filterCategory]);

  return (
    <div className="relative flex h-screen w-full bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Floating Header & Controls over the map */}
      <div className="absolute top-3 left-4 z-20 flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 shadow-2xl">
        <Image src="/logo.png" alt="FORESIGHT Logo" width={130} height={42} className="object-contain" />
        <span className="h-5 w-px bg-slate-700"></span>
        <input
          type="text"
          placeholder="Search district, state or crop..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56 border border-slate-700"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-slate-200 border border-slate-700 focus:outline-none"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="CRITICAL RISK">Critical Risk (🔴)</option>
          <option value="HIGH RISK">High Risk (🟠)</option>
          <option value="MODERATE RISK">Moderate Risk (🟡)</option>
          <option value="STABLE">Stable (🟢)</option>
        </select>
      </div>

      {/* Main Interactive Map */}
      <div className="absolute inset-0 z-0">
        <APIProvider apiKey={MAP_API_KEY}>
          <MapHandler districts={filteredDistricts} onSelectDistrict={handleSelectDistrict} />
        </APIProvider>
      </div>

      {/* Sidebar for Analytics & Digital Twin Details */}
      <div
        className={`absolute right-0 top-0 h-full w-[420px] bg-slate-900/95 backdrop-blur-xl p-6 shadow-2xl flex flex-col z-10 border-l border-slate-800 transition-transform duration-500 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 w-10 h-16 bg-slate-900/90 text-slate-300 flex items-center justify-center rounded-l-xl shadow-xl border-y border-l border-slate-700 hover:text-blue-400 transition-colors cursor-pointer"
        >
          {isSidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          )}
        </button>

        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-100 uppercase">Command Center MVP</h2>
            <p className="text-slate-400 text-xs">Real-World El Niño Food Resilience Platform</p>
          </div>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
            665 Districts
          </span>
        </div>

        {selectedDistrict ? (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-700">
            {/* Header Status Card */}
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{selectedDistrict.district_name}</h3>
                  <p className="text-slate-400 text-xs">{selectedDistrict.state_name}</p>
                </div>
                <div className="text-right">
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: selectedDistrict.status_color }}
                  >
                    {selectedDistrict.risk_category}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Score: <span className="font-bold text-slate-200">{selectedDistrict.risk_score} / 100</span></p>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700/50">
                <span>📍 GPS: <strong className="font-mono text-blue-400">{selectedDistrict.latitude.toFixed(4)}, {selectedDistrict.longitude.toFixed(4)}</strong></span>
                {selectedDistrict.pincode && <span className="font-mono text-slate-400">PIN: {selectedDistrict.pincode}</span>}
              </div>
            </div>

            {/* Live OpenWeatherMap API Integration */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center justify-between">
                <span>🌤️ Live OpenWeatherMap Feed</span>
                <span className="text-[9px] text-slate-500 font-normal">Real-Time</span>
              </h4>
              {weather ? (
                <div className="grid grid-cols-3 gap-2 text-center text-slate-200">
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-400">Temperature</p>
                    <p className="font-bold text-cyan-300 text-sm">{weather.temp}°C</p>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-400">Humidity</p>
                    <p className="font-bold text-blue-300 text-sm">{weather.humidity}%</p>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-400">Condition</p>
                    <p className="font-bold text-slate-200 text-xs capitalize truncate">{weather.desc}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 p-2.5 rounded text-center text-slate-400 italic">
                  Fetching live weather stream...
                </div>
              )}
            </div>

            {/* Crop & Production Twin */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center">
                🌾 Crop & Agricultural Production
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Cultivated Crop</p>
                  <p className="font-bold text-slate-100">{selectedDistrict.crop_type}</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Area Sown</p>
                  <p className="font-bold text-slate-100">{selectedDistrict.area_sown_ha.toLocaleString()} ha</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Historical Yield</p>
                  <p className="font-bold text-slate-100">{selectedDistrict.yield_t_ha} tonnes / ha</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Total Production</p>
                  <p className="font-bold text-slate-100">{selectedDistrict.production_tonnes.toLocaleString()} tonnes</p>
                </div>
              </div>
            </div>

            {/* Climate & El Niño Indicators */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center">
                🌦️ Historical Climate & Reservoir Level
              </h4>
              <div className="grid grid-cols-3 gap-2 text-slate-300 text-center">
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Rain Deficit</p>
                  <p className="font-bold text-amber-300">-{selectedDistrict.rainfall_deficit_pct}%</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Temp Anomaly</p>
                  <p className="font-bold text-red-400">+{selectedDistrict.temp_anomaly_c}°C</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Reservoir</p>
                  <p className="font-bold text-blue-300">{selectedDistrict.reservoir_level_pct}%</p>
                </div>
              </div>
            </div>

            {/* Storage Infrastructure */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                📦 Storage Infrastructure (Capacity vs Stock)
              </h4>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Total Storage Capacity:</span>
                  <span className="font-bold text-emerald-300">{selectedDistrict.total_storage_capacity_tonnes.toLocaleString()} tonnes</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 text-center">
                  <div className="bg-slate-900/40 p-1.5 rounded">SWC: <span className="text-slate-200 font-semibold">{selectedDistrict.swc_capacity_tonnes.toLocaleString()} t</span></div>
                  <div className="bg-slate-900/40 p-1.5 rounded">FCI: <span className="text-slate-200 font-semibold">{selectedDistrict.fci_capacity_tonnes.toLocaleString()} t</span></div>
                  <div className="bg-slate-900/40 p-1.5 rounded">Cold: <span className="text-slate-200 font-semibold">{selectedDistrict.cold_storage_capacity_tonnes.toLocaleString()} t</span></div>
                </div>
                <div className="flex justify-between bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Physical Stock Level:</span>
                  <span className="font-bold text-amber-400">{selectedDistrict.current_stock}</span>
                </div>
              </div>
            </div>

            {/* Demand & Vulnerable Population */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2">
                💰 Demand & Population Vulnerability
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">30-Day Food Demand</p>
                  <p className="font-bold text-purple-300">{selectedDistrict.demand_30d_tonnes.toLocaleString()} tonnes</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Vulnerable People</p>
                  <p className="font-bold text-purple-300">{selectedDistrict.vulnerable_population.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* AI Decision & SHAP Root Cause */}
            <div className="bg-blue-950/70 rounded-xl p-3.5 border border-blue-800/80 shadow-inner">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-2 flex items-center">
                🤖 Live AI Model Connection (Colab)
              </h4>
              
              <div className="flex flex-col gap-2 mb-3">
                <input 
                  type="text" 
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="bg-slate-900 text-xs px-2 py-1.5 rounded border border-blue-700/50 text-slate-300 w-full"
                  placeholder="Paste localtunnel URL here"
                />
                <button 
                  onClick={runAiPrediction}
                  disabled={isPredicting}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors"
                >
                  {isPredicting ? "Running Live Prediction..." : "Run Real-Time AI Prediction"}
                </button>
              </div>

              {aiPrediction && (
                 <div className="bg-emerald-900/50 p-2.5 rounded border border-emerald-700/50 text-[11px] text-emerald-200 mb-3 shadow-inner">
                   <strong className="text-emerald-300 text-xs">Live Model Output:</strong> <br/>
                   Predicted Risk Score: <span className="font-mono font-bold">{aiPrediction.predicted_risk.toFixed(2)}</span> / 100
                 </div>
              )}

              <p className="text-[11px] text-slate-300 mb-2">
                <strong className="text-amber-300">Baseline Primary Stress Driver:</strong> {selectedDistrict.primary_driver}
              </p>
              <div className="bg-slate-900/80 p-2.5 rounded border border-blue-700/50 text-[11px] text-blue-200">
                💡 <strong>Baseline Recommended Action:</strong> {selectedDistrict.recommended_action}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/40 rounded-xl p-6 border-2 border-slate-700 border-dashed flex flex-col items-center justify-center flex-1 text-center">
            <svg className="w-12 h-12 text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
            <p className="text-slate-300 font-medium">Select any district marker on the interactive map to load real-time MVP analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
