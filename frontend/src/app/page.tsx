"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { APIProvider, Map, useMap, useMapsLibrary, MapMouseEvent } from "@vis.gl/react-google-maps";

// Make sure to securely load this in production (e.g., process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
const API_KEY = "AIzaSyB0bvqkB-Q46jHPxMs7YyJ-SM94MfYJ4tY";

// Center of India
const defaultCenter = { lat: 20.5937, lng: 78.9629 };
const defaultZoom = 5;

function MapHandler({ onDistrictClick }: { onDistrictClick: (district: string, lat: number, lng: number) => void }) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");

  // Handle map clicks
  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      if (!geocodingLib || !map || !e.detail.latLng) return;
      
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      
      // Immediately give UI feedback
      onDistrictClick("Loading district data...", lat, lng);
      
      const geocoder = new geocodingLib.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          // Find the district (administrative_area_level_2 or level_3)
          let district = "Unknown District";
          let state = "Unknown State";
          
          for (const result of results) {
            for (const component of result.address_components) {
              if (component.types.includes("administrative_area_level_2") || component.types.includes("administrative_area_level_3")) {
                district = component.long_name;
              }
              if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
            }
          }
          
          onDistrictClick(`${district}, ${state}`, lat, lng);
        } else {
          // If Geocoding API is not enabled on this API key, it will hit this
          console.error("Geocoding failed:", status);
          onDistrictClick(`Error: Geocoding API (${status})`, lat, lng);
        }
      });
    },
    [geocodingLib, map, onDistrictClick]
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

  const handleDistrictClick = (districtName: string, lat: number, lng: number) => {
    setSelectedDistrict(districtName);
    setClickCoords({ lat, lng });
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Floating Logo over the map */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none drop-shadow-lg">
        <Image src="/logo.png" alt="FORESIGHT Logo" width={220} height={80} className="object-contain" />
      </div>

      {/* Main Map Area (Now on the left) */}
      <div className="flex-1 relative z-0">
        <APIProvider apiKey={API_KEY}>
          <MapHandler onDistrictClick={handleDistrictClick} />
        </APIProvider>
      </div>

      {/* Sidebar for Data (Now on the right) */}
      <div className="w-96 bg-white p-6 shadow-2xl flex flex-col z-10 border-l border-slate-200">
        <h2 className="text-xl font-black mb-1 tracking-tight text-slate-800">COMMAND CENTER</h2>
        <p className="text-slate-500 mb-8 text-sm font-medium tracking-wide">El Niño Food System Resilience Platform</p>
        
        {selectedDistrict ? (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 text-blue-800">{selectedDistrict}</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Coordinates</p>
                <p className="font-mono text-sm text-slate-700 bg-white p-2 rounded border border-slate-100">{clickCoords?.lat.toFixed(4)}, {clickCoords?.lng.toFixed(4)}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500 italic">
                  Climate and agricultural data for this district will be populated here...
                </p>
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
