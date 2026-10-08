"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { APIProvider, Map, useMap, useMapsLibrary, MapMouseEvent } from "@vis.gl/react-google-maps";

// Make sure to securely load this in production
const MAP_API_KEY = "AIzaSyB0bvqkB-Q46jHPxMs7YyJ-SM94MfYJ4tY";
const GEOCODING_API_KEY = "AIzaSyDDwl-RtO39lHejjpUh3G1SlmCLa1u2LKI";

// Center of India
const defaultCenter = { lat: 20.5937, lng: 78.9629 };
const defaultZoom = 5;

function MapHandler({ onDistrictClick }: { onDistrictClick: (district: string, lat: number, lng: number, pincode?: string) => void }) {
  const map = useMap();

  // Handle map clicks
  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      if (!map || !e.detail.latLng) return;
      
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      
      // Immediately give UI feedback
      onDistrictClick("Loading district data...", lat, lng);
      
      // Use Free OpenStreetMap Nominatim API to bypass Google Billing restrictions!
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
        headers: {
          'Accept-Language': 'en'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            // Nominatim returns district usually as state_district or county
            const district = data.address.state_district || data.address.county || data.address.city || data.address.region || "Unknown District";
            const state = data.address.state || "Unknown State";
            const pincode = data.address.postcode || "Unknown";
            
            onDistrictClick(`${district}, ${state}`, lat, lng, pincode);
          } else {
            console.error("Geocoding failed:", data);
            onDistrictClick(`Error: Location not found`, lat, lng);
          }
        })
        .catch(err => {
          console.error("Geocoding network error:", err);
          onDistrictClick("Error: Network failure", lat, lng);
        });
    },
    [map, onDistrictClick]
  );

  return (
    <Map
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      onClick={handleClick}
      mapId="DEMO_MAP_ID" // Required for modern map features
    />
  );
}

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [clickCoords, setClickCoords] = useState<{lat: number, lng: number} | null>(null);
  const [clickPincode, setClickPincode] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [weather, setWeather] = useState<{temp: number, desc: string, humidity: number} | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleDistrictClick = async (districtName: string, lat: number, lng: number, pincode?: string) => {
    setSelectedDistrict(districtName);
    setClickCoords({ lat, lng });
    if (pincode !== undefined) setClickPincode(pincode);
    setIsSidebarOpen(true);
    setWeather(null);
    setAiSummary(null);
    setIsAiLoading(true);

    let temp = 0;
    let humidity = 0;
    let desc = "Unknown";

    // Fetch Weather Data from OpenWeatherMap
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=8c85517b8391d50ff56ff492a726e1e9&units=metric`);
      const data = await res.json();
      
      if (data && data.main) {
        temp = Math.round(data.main.temp);
        humidity = data.main.humidity;
        desc = data.weather?.[0]?.description || "Clear";
        setWeather({ temp, humidity, desc });
      }
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }

    // Fetch AI Summary from secure Next.js Backend Route
    try {
      const groqRes = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          districtName,
          pincode,
          temp,
          humidity,
          desc
        })
      });
      
      const groqData = await groqRes.json();
      if (groqRes.ok && groqData.summary) {
        setAiSummary(groqData.summary);
      } else {
        setAiSummary(groqData.error || "AI analysis unavailable at this moment.");
      }
    } catch (err) {
      console.error("Failed to fetch AI:", err);
      setAiSummary("Error generating AI analysis due to network issues.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Floating Logo over the map */}
      <div className="absolute top-2 left-2 z-20 pointer-events-none drop-shadow-lg">
        <Image src="/logo.png" alt="FORESIGHT Logo" width={140} height={50} className="object-contain" />
      </div>

      {/* Main Map Area */}
      <div className="absolute inset-0 z-0">
        <APIProvider apiKey={MAP_API_KEY}>
          <MapHandler onDistrictClick={handleDistrictClick} />
        </APIProvider>
      </div>

      {/* Sidebar for Data (Sliding from right) */}
      <div 
        className={`absolute right-0 top-0 h-full w-96 bg-white p-6 shadow-2xl flex flex-col z-10 border-l border-slate-200 transition-transform duration-500 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 w-10 h-16 bg-white flex items-center justify-center rounded-l-lg shadow-[-4px_0_10px_rgba(0,0,0,0.1)] border-y border-l border-slate-200 text-slate-500 hover:text-blue-600 focus:outline-none transition-colors cursor-pointer"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          )}
        </button>

        <h2 className="text-xl font-black mb-1 tracking-tight text-slate-800">COMMAND CENTER</h2>
        <p className="text-slate-500 mb-8 text-sm font-medium tracking-wide">El Niño Food System Resilience Platform</p>
        
        {selectedDistrict ? (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 text-blue-800">{selectedDistrict}</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Coordinates</p>
                  <p className="font-mono text-sm text-slate-700 bg-white p-2 rounded border border-slate-100">{clickCoords?.lat.toFixed(4)}, {clickCoords?.lng.toFixed(4)}</p>
                </div>
                {clickPincode && clickPincode !== "Unknown" && (
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pincode</p>
                    <p className="font-mono text-sm text-slate-700 bg-white p-2 rounded border border-slate-100">{clickPincode}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Live Climate Data</p>
                {weather ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                      <p className="text-xs text-slate-400 mb-1 font-medium">Temperature</p>
                      <p className="text-xl font-bold text-slate-700">{weather.temp}°C</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                      <p className="text-xs text-slate-400 mb-1 font-medium">Humidity</p>
                      <p className="text-xl font-bold text-slate-700">{weather.humidity}%</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm col-span-2">
                      <p className="text-xs text-slate-400 mb-1 font-medium">Conditions</p>
                      <p className="text-sm font-bold text-slate-700 capitalize">{weather.desc}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">Fetching real-time weather...</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Insight</p>
                </div>
                {isAiLoading ? (
                  <div className="bg-slate-100 animate-pulse rounded p-4 h-20 w-full"></div>
                ) : aiSummary ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 shadow-inner">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {aiSummary}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 rounded-xl p-5 border-2 border-slate-200 border-dashed flex flex-col items-center justify-center h-48 text-center transition-all duration-300">
            <svg className="w-10 h-10 text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
            <p className="text-slate-500 text-sm font-medium">Click any district on the map to view analytics</p>
          </div>
        )}
      </div>
    </div>
  );
}
