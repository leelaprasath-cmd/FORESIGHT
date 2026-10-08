import urllib.request
import json
import os
import csv
import math

def fetch_noaa_oni():
    url = "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt"
    print(f"Fetching NOAA ONI index from {url}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
        lines = content.strip().split('\n')
        header = lines[0].split()
        data = []
        for line in lines[1:]:
            parts = line.split()
            if len(parts) >= 4:
                season = parts[0]
                yr = int(parts[1])
                total = float(parts[2])
                anom = float(parts[3])
                
                # Determine ENSO Phase and Strength based on standard NOAA CPC thresholds
                # El Nino: ONI >= +0.5 for 5 consecutive overlapping seasons
                # La Nina: ONI <= -0.5
                if anom >= 0.5:
                    phase = "El Nino"
                    if anom >= 2.0:
                        strength = "Very Strong"
                    elif anom >= 1.5:
                        strength = "Strong"
                    elif anom >= 1.0:
                        strength = "Moderate"
                    else:
                        strength = "Weak"
                elif anom <= -0.5:
                    phase = "La Nina"
                    if anom <= -2.0:
                        strength = "Very Strong"
                    elif anom <= -1.5:
                        strength = "Strong"
                    elif anom <= -1.0:
                        strength = "Moderate"
                    else:
                        strength = "Weak"
                else:
                    phase = "Neutral"
                    strength = "Neutral"
                
                data.append({
                    "year": yr,
                    "season_code": season,
                    "oni_index": anom,
                    "total_sst_celsius": total,
                    "enso_phase": phase,
                    "el_nino_strength": strength,
                    "data_type": "OBSERVED_DATA",
                    "source_name": "NOAA Climate Prediction Center",
                    "source_url": "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt",
                    "access_date": "2026-10-08",
                    "confidence": "High"
                })
        df = pd.DataFrame(data)
        print(f"Successfully fetched {len(df)} NOAA ONI records from {df['year'].min()} to {df['year'].max()}.")
        return df
    except Exception as e:
        print(f"Error fetching NOAA ONI: {e}")
        return None

if __name__ == "__main__":
    data = fetch_noaa_oni()
    if data:
        os.makedirs("data", exist_ok=True)
        filepath = "data/enso_el_nino_data.csv"
        fieldnames = list(data[0].keys())
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        print(f"Saved {filepath} with {len(data)} rows.")
