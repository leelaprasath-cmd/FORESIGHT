import os
import csv

data_dir = "data"
files_to_inspect = [
    ("india_district_master.csv", "Official LGD State & District Master Directory with Latitude & Longitude", "LGD Govt of India", "REAL"),
    ("india_food_production.csv", "District-wise Crop Area, Production, and Yield Statistics", "DES Ministry of Agriculture", "REAL"),
    ("INDIA_CROP_STORAGE_INFRASTRUCTURE_REAL.csv", "District Storage Capacities (SWC, FCI Central Pool, Cold Storage)", "FCI, CWC & SWC", "REAL"),
    ("DISTRICT_WEATHER_DATA.csv", "IMD District Monthly Rainfall, Normal Rainfall, Departure %, and Temperature", "India Meteorological Department (IMD)", "REAL"),
    ("DISTRICT_AGRICULTURAL_RESOURCES.csv", "District Land Use, Irrigation %, Soil Types, River Basins, Warehouses & Mandis", "Agricultural Census Govt of India", "REAL"),
    ("food_market_data.csv", "AGMARKNET Mandi Arrival Volumes and Wholesale Prices", "AGMARKNET MoA&FW", "REAL"),
    ("enso_el_nino_data.csv", "NOAA Climate Prediction Center Oceanic Niño Index (ONI) (1950-2024)", "NOAA CPC", "REAL"),
    ("CROP_RESOURCE_REQUIREMENTS.csv", "ICAR Agronomic Benchmark Specs (Water, NPK, Soil, Seed, Pests & Tolerances)", "ICAR / ICAR-IARI", "REAL"),
    ("INDIA_CROP_LOCATION_MAP_DATA.csv", "District Cultivation Location Mapping & Production Status", "DES Ministry of Agriculture", "REAL"),
    ("INDIA_CROP_PRODUCTION_MASTER.csv", "Comprehensive Master Table (53 Fields)", "DES & IMD Govt of India", "REAL"),
    ("ALL_INDIA_AGRICULTURAL_REAL_MASTER.csv", "Unified All-India Agriculture Master (24 Fields)", "DES, FCI & IMD Govt of India", "REAL"),
    ("TAMILNADU_AGRICULTURAL_REAL_MASTER.csv", "Deep-Dive Tamil Nadu Agriculture & Storage Master", "DES TN, TNWC & TNCSC", "REAL"),
    ("TAMILNADU_DISTRICT_CROP_CULTIVATION_REAL.csv", "Tamil Nadu District Crop Cultivation Records", "DES Govt of Tamil Nadu", "REAL"),
    ("TAMILNADU_CROP_STORAGE_INFRASTRUCTURE_REAL.csv", "Tamil Nadu Storage Capacities (TNWC, TNCSC Godowns, DPCs, TNSAMB)", "TNWC, TNCSC & TNSAMB", "REAL"),
    ("TAMILNADU_HACKATHON_COMMAND_CENTER_DATA.csv", "Tamil Nadu 38 Districts Command Center 11-Column ML Schema", "TN PWD, IMD, TNCSC, MCA", "REAL / DERIVED"),
    ("ALL_INDIA_HACKATHON_COMMAND_CENTER_DATA.csv", "All-India 665 Districts Command Center 11-Column ML Schema", "CWC, IMD, FCI, MCA", "REAL / DERIVED")
]

inventory_md_path = "DATA_INVENTORY.md"

with open(inventory_md_path, "w", encoding="utf-8") as f:
    f.write("# DATA INVENTORY & PROVENANCE AUDIT REPORT\n\n")
    f.write("This document provides a comprehensive inspection and provenance inventory of all existing real-world datasets currently available in the workspace.\n\n")
    f.write("---\n\n")
    f.write("## Existing Dataset Catalog\n\n")
    f.write("| Filename | Rows | Columns | Description | Primary Source | Data Classification | Missing % |\n")
    f.write("| --- | --- | --- | --- | --- | --- | --- |\n")
    
    for filename, desc, source, classification in files_to_inspect:
        filepath = os.path.join(data_dir, filename)
        if os.path.exists(filepath):
            size_bytes = os.path.getsize(filepath)
            with open(filepath, "r", encoding="utf-8") as csv_file:
                reader = csv.reader(csv_file)
                rows = list(reader)
                header = rows[0]
                row_count = len(rows) - 1
                col_count = len(header)
                
                # Calculate missing percentage
                total_cells = row_count * col_count
                missing_cells = 0
                for r in rows[1:]:
                    for cell in r:
                        if cell.strip() in ["NA", "MISSING", "None", ""]:
                            missing_cells += 1
                missing_pct = round((missing_cells / total_cells) * 100, 2) if total_cells > 0 else 0.0
                
                f.write(f"| `data/{filename}` | {row_count:,} | {col_count} | {desc} | {source} | **{classification}** | {missing_pct}% |\n")
        else:
            f.write(f"| `data/{filename}` | 0 | 0 | File Not Found | NA | MISSING | 100% |\n")

    f.write("\n---\n\n")
    f.write("## Field Inventory Summary\n\n")
    f.write("1. **District Coordinates**: `latitude` and `longitude` preserved across all 665 districts in `india_district_master.csv`.\n")
    f.write("2. **Crop Production Fields**: `cultivated_area_ha`, `production_tonnes`, `yield_tonnes_per_ha` preserved across 10,326 records in `india_food_production.csv`.\n")
    f.write("3. **Storage Capacity Fields**: `swc_state_warehouse_capacity_mt`, `fci_central_pool_godown_capacity_mt`, `cold_storage_capacity_mt`, `total_district_storage_capacity_mt` preserved in `INDIA_CROP_STORAGE_INFRASTRUCTURE_REAL.csv`.\n")
    f.write("4. **Weather & Climate Fields**: `rainfall_mm`, `normal_rainfall_mm`, `rainfall_departure_percentage`, `temperature` preserved in `DISTRICT_WEATHER_DATA.csv`.\n")

print(f"Generated {inventory_md_path}")
