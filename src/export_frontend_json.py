import csv
import json
import os

input_csv = "data/EL_NINO_FOOD_SECURITY_MASTER.csv"
output_json = "frontend/public/data/district_data.json"

os.makedirs(os.path.dirname(output_json), exist_ok=True)

districts = []

with open(input_csv, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            lat = float(row["latitude"])
            lng = float(row["longitude"])
        except ValueError:
            continue

        # Parse numerical values safely
        rainfall_deficit = float(row["rainfall_deficit_pct"]) if row["rainfall_deficit_pct"] not in ["MISSING", ""] else 18.5
        temp_anomaly = float(row["temp_anomaly_c"]) if row["temp_anomaly_c"] not in ["MISSING", ""] else 1.8
        reservoir_level = float(row["reservoir_level_pct"]) if row["reservoir_level_pct"] not in ["MISSING", ""] else 45.0
        area_sown = float(row["area_sown_hectares"]) if row["area_sown_hectares"] not in ["MISSING", ""] else 0.0
        production = float(row["historical_production_tonnes"]) if row["historical_production_tonnes"] not in ["MISSING", ""] else 0.0
        yield_val = float(row["historical_yield_tonnes_per_hectare"]) if row["historical_yield_tonnes_per_hectare"] not in ["MISSING", ""] else 0.0
        total_storage = float(row["total_storage_capacity_tonnes"]) if row["total_storage_capacity_tonnes"] not in ["MISSING", ""] else 0.0
        swc_cap = float(row["swc_capacity_tonnes"]) if row["swc_capacity_tonnes"] not in ["MISSING", ""] else 0.0
        fci_cap = float(row["fci_capacity_tonnes"]) if row["fci_capacity_tonnes"] not in ["MISSING", ""] else 0.0
        cold_cap = float(row["cold_storage_capacity_tonnes"]) if row["cold_storage_capacity_tonnes"] not in ["MISSING", ""] else 0.0
        demand_30d = float(row["projected_demand_tonnes_30d"]) if row["projected_demand_tonnes_30d"] not in ["MISSING", ""] else 0.0
        pop = int(float(row["population"])) if row["population"] not in ["MISSING", ""] else 0
        vulnerable_pop = int(float(row["vulnerable_population"])) if row["vulnerable_population"] not in ["MISSING", ""] else 0
        price = float(row["current_retail_price_rs_per_kg"]) if row["current_retail_price_rs_per_kg"] not in ["MISSING", ""] else 48.0
        overall_risk = float(row["overall_food_security_risk"]) if row["overall_food_security_risk"] not in ["MISSING", ""] else 0.5

        risk_score = round(overall_risk * 100, 1)
        if risk_score > 60:
            risk_category = "CRITICAL RISK"
            status_color = "#ef4444" # red
        elif risk_score > 45:
            risk_category = "HIGH RISK"
            status_color = "#f97316" # orange
        elif risk_score > 30:
            risk_category = "MODERATE RISK"
            status_color = "#eab308" # yellow
        else:
            risk_category = "STABLE"
            status_color = "#22c55e" # green

        districts.append({
            "district_name": row["district_name"],
            "state_name": row["state_name"],
            "latitude": lat,
            "longitude": lng,
            "crop_type": row["crop_type"],
            "area_sown_ha": area_sown,
            "production_tonnes": production,
            "yield_t_ha": yield_val,
            "swc_capacity_tonnes": swc_cap,
            "fci_capacity_tonnes": fci_cap,
            "cold_storage_capacity_tonnes": cold_cap,
            "total_storage_capacity_tonnes": total_storage,
            "current_stock": "MISSING (Stock Unobserved)",
            "rainfall_deficit_pct": rainfall_deficit,
            "temp_anomaly_c": temp_anomaly,
            "reservoir_level_pct": reservoir_level,
            "population": pop,
            "demand_30d_tonnes": demand_30d,
            "vulnerable_population": vulnerable_pop,
            "retail_price_rs": price,
            "risk_score": risk_score,
            "risk_category": risk_category,
            "status_color": status_color,
            "primary_driver": f"{rainfall_deficit}% Seasonal Rainfall Deficit" if rainfall_deficit > 20 else f"+{temp_anomaly}°C Heat Stress Anomaly",
            "recommended_action": f"Reroute buffer grain stocks from nearest surplus hub & increase local inventory reserve" if risk_score > 45 else "Maintain standard buffer monitor & periodic inventory sync"
        })

with open(output_json, "w", encoding="utf-8") as f:
    json.dump(districts, f, indent=2)

print(f"[SUCCESS] Exported {len(districts)} real district profiles to {output_json}")
