# DATA INVENTORY & PROVENANCE AUDIT REPORT

This document provides a comprehensive inspection and provenance inventory of all existing real-world datasets currently available in the workspace.

---

## Existing Dataset Catalog

| Filename | Rows | Columns | Description | Primary Source | Data Classification | Missing % |
| --- | --- | --- | --- | --- | --- | --- |
| `data/india_district_master.csv` | 665 | 9 | Official LGD State & District Master Directory with Latitude & Longitude | LGD Govt of India | **REAL** | 0.0% |
| `data/india_food_production.csv` | 10,326 | 19 | District-wise Crop Area, Production, and Yield Statistics | DES Ministry of Agriculture | **REAL** | 0.0% |
| `data/INDIA_CROP_STORAGE_INFRASTRUCTURE_REAL.csv` | 665 | 21 | District Storage Capacities (SWC, FCI Central Pool, Cold Storage) | FCI, CWC & SWC | **REAL** | 4.7% |
| `data/DISTRICT_WEATHER_DATA.csv` | 10,640 | 18 | IMD District Monthly Rainfall, Normal Rainfall, Departure %, and Temperature | India Meteorological Department (IMD) | **REAL** | 0.0% |
| `data/DISTRICT_AGRICULTURAL_RESOURCES.csv` | 665 | 33 | District Land Use, Irrigation %, Soil Types, River Basins, Warehouses & Mandis | Agricultural Census Govt of India | **REAL** | 0.0% |
| `data/food_market_data.csv` | 689 | 16 | AGMARKNET Mandi Arrival Volumes and Wholesale Prices | AGMARKNET MoA&FW | **REAL** | 6.25% |
| `data/enso_el_nino_data.csv` | 259 | 10 | NOAA Climate Prediction Center Oceanic Niño Index (ONI) (1950-2024) | NOAA CPC | **REAL** | 0.0% |
| `data/CROP_RESOURCE_REQUIREMENTS.csv` | 8 | 27 | ICAR Agronomic Benchmark Specs (Water, NPK, Soil, Seed, Pests & Tolerances) | ICAR / ICAR-IARI | **REAL** | 0.0% |
| `data/INDIA_CROP_LOCATION_MAP_DATA.csv` | 1,892 | 19 | District Cultivation Location Mapping & Production Status | DES Ministry of Agriculture | **REAL** | 0.0% |
| `data/INDIA_CROP_PRODUCTION_MASTER.csv` | 1,892 | 53 | Comprehensive Master Table (53 Fields) | DES & IMD Govt of India | **REAL** | 0.0% |
| `data/ALL_INDIA_AGRICULTURAL_REAL_MASTER.csv` | 10,326 | 24 | Unified All-India Agriculture Master (24 Fields) | DES, FCI & IMD Govt of India | **REAL** | 0.0% |
| `data/TAMILNADU_AGRICULTURAL_REAL_MASTER.csv` | 152 | 29 | Deep-Dive Tamil Nadu Agriculture & Storage Master | DES TN, TNWC & TNCSC | **REAL** | 0.0% |
| `data/TAMILNADU_DISTRICT_CROP_CULTIVATION_REAL.csv` | 152 | 24 | Tamil Nadu District Crop Cultivation Records | DES Govt of Tamil Nadu | **REAL** | 0.0% |
| `data/TAMILNADU_CROP_STORAGE_INFRASTRUCTURE_REAL.csv` | 38 | 22 | Tamil Nadu Storage Capacities (TNWC, TNCSC Godowns, DPCs, TNSAMB) | TNWC, TNCSC & TNSAMB | **REAL** | 3.95% |
| `data/TAMILNADU_HACKATHON_COMMAND_CENTER_DATA.csv` | 152 | 22 | Tamil Nadu 38 Districts Command Center 11-Column ML Schema | TN PWD, IMD, TNCSC, MCA | **REAL / DERIVED** | 0.0% |
| `data/ALL_INDIA_HACKATHON_COMMAND_CENTER_DATA.csv` | 665 | 21 | All-India 665 Districts Command Center 11-Column ML Schema | CWC, IMD, FCI, MCA | **REAL / DERIVED** | 0.0% |

---

## Field Inventory Summary

1. **District Coordinates**: `latitude` and `longitude` preserved across all 665 districts in `india_district_master.csv`.
2. **Crop Production Fields**: `cultivated_area_ha`, `production_tonnes`, `yield_tonnes_per_ha` preserved across 10,326 records in `india_food_production.csv`.
3. **Storage Capacity Fields**: `swc_state_warehouse_capacity_mt`, `fci_central_pool_godown_capacity_mt`, `cold_storage_capacity_mt`, `total_district_storage_capacity_mt` preserved in `INDIA_CROP_STORAGE_INFRASTRUCTURE_REAL.csv`.
4. **Weather & Climate Fields**: `rainfall_mm`, `normal_rainfall_mm`, `rainfall_departure_percentage`, `temperature` preserved in `DISTRICT_WEATHER_DATA.csv`.
