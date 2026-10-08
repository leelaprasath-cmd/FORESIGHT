"use client";

import { useState, useCallback } from "react";
import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

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
    (e: any) => {
      if (!geocodingLib || !map) return;
      
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      
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
    <div className="flex h-screen w-full bg-slate-900 text-white font-sans">
      {/* Sidebar for Data */}
      <div className="w-96 bg-slate-800 p-6 shadow-2xl flex flex-col z-10">
        <h1 className="text-2xl font-bold mb-2">FOODGUARD AI</h1>
        <p className="text-slate-400 mb-8 text-sm">El Niño Food System Resilience Platform</p>
        
        {selectedDistrict ? (
          <div className="bg-slate-700 rounded-lg p-5 border border-slate-600 shadow-inner">
            <h2 className="text-xl font-semibold mb-4 text-emerald-400">{selectedDistrict}</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Coordinates</p>
                <p className="font-mono text-sm">{clickCoords?.lat.toFixed(4)}, {clickCoords?.lng.toFixed(4)}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-600">
                <p className="text-sm text-slate-300 italic">
                  Climate and agricultural data for this district will be populated here...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-700/50 rounded-lg p-5 border border-slate-600 border-dashed flex flex-col items-center justify-center h-48 text-center">
            <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
            <p className="text-slate-400 text-sm">Click any district on the map to view data</p>
          </div>
        )}
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <APIProvider apiKey={API_KEY}>
          <MapHandler onDistrictClick={handleDistrictClick} />
        </APIProvider>
      </div>
    </div>
  );
}
