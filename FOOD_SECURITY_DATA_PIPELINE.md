# 🌾 FORESIGHT: Real-World Food System & El Niño Data Pipeline

> **Hackathon Track:** Food Security & Sustainable Supply Chain  
> **Problem Statement:** *How might we identify, anticipate, and reduce vulnerabilities across food systems when El Niño disrupts the interconnected relationship between production, availability, affordability, movement, and consumption?*  
> **Repository:** [leelaprasath-cmd/FORESIGHT](https://github.com/leelaprasath-cmd/FORESIGHT)

---

## 📌 1. Executive Summary

**FORESIGHT** is an end-to-end, scientifically defensible intelligence platform designed to detect climate shocks, predict regional food vulnerabilities, explain root causes via ML/SHAP, and optimize inter-district food grain redistribution during El Niño events.

This data pipeline synthesizes real-world agricultural, infrastructure, climate, and demographic data for **665 districts across all 28 States and 8 Union Territories of India**, alongside a targeted deep-dive for **38 districts of Tamil Nadu**.

---

## 🛡️ 2. Principles & Data Governance

To ensure maximum credibility for hackathon evaluation and real-world deployment, this dataset adheres to 5 strict data governance rules:

1. **Zero Fake Baseline Data:** All geographic coordinates, baseline crop production figures, cultivated crop types, and storage infrastructure capacities originate strictly from verified official government repositories.
2. **Explicit Data Tagging:** Every data field is strictly classified into one of five categories:
   - `REAL`: Empirical baseline data from government databases.
   - `DERIVED`: Scientifically computed values (e.g., yield = production / area; monthly food demand = population × ICMR intake rate).
   - `MODEL_OUTPUT`: Predictions from the XGBoost risk model.
   - `SCENARIO_ASSUMPTION`: Controlled climate stress anomalies for El Niño simulations.
   - `MISSING`: Explicit label for unobserved metrics (e.g. real-time daily stock levels).
3. **Storage Capacity vs. Physical Stock Distinction:** Warehousing infrastructure capacity (State Warehousing Corporation [SWC], Food Corporation of India [FCI], and Cold Storage) is strictly tracked as structural capacity (**tonnes**). Physical grain stock levels are never confused with total storage capacity.
4. **100% Provenance Traceability:** Every data point links back to primary data sources including Ministry of Agriculture (DES), IMD, NOAA CPC, FCI, AGMARKNET, and LGD.
5. **Geospatial Readiness:** All 665 districts feature precise GPS latitude and longitude coordinates for direct ingestion into Leaflet, Mapbox, and Google Maps visualizers.

---

## 🏛️ 3. Official Source Registry

| Data Category | Primary Source Institution | Dataset / API Reference | Governance Tag |
|---|---|---|---|
| **Geospatial & Identities** | Local Government Directory (LGD) / Survey of India | District Codes & GPS Centroids | `REAL` |
| **Climate & El Niño** | IMD / NOAA Climate Prediction Center (CPC) | Historical Rainfall & Oceanic Niño Index (ONI) | `REAL` / `SCENARIO_ASSUMPTION` |
| **Crop Production** | Ministry of Agriculture & Farmers Welfare (DES) | APY (Area, Production, Yield) Statistics | `REAL` |
| **Storage Infrastructure** | FCI / Central Warehousing Corp (CWC) / NCCD | Storage Capacity Directory (SWC, FCI, Cold Storage) | `REAL` |
| **Demographics & Consumption** | Census of India / ICMR National Institute of Nutrition | District Population (Projected) & Per Capita Intake | `DERIVED` |
| **Market Prices** | AGMARKNET (DAC&FW) | Daily Mandi Prices & Price Sensitivity | `REAL` |

---

## 📂 4. Core Pipeline Data Files

All processed dataset CSVs are stored in the `/data` folder of the repository:

```text
data/
├── ALL_INDIA_HACKATHON_COMMAND_CENTER_DATA.csv  # 665 Districts ML & Map schema
├── TAMILNADU_HACKATHON_COMMAND_CENTER_DATA.csv  # 38 Tamil Nadu Districts ML schema
├── REAL_BASELINE_DATA.csv                      # Baseline agricultural & storage statistics
├── EL_NINO_SCENARIO_DATA.csv                   # 2,660 Simulated El Niño scenario records
├── EL_NINO_FOOD_SECURITY_MASTER.csv            # 36-column master feature table
├── ML_TRAINING_DATA.csv                        # Clean numerical feature matrix for XGBoost
├── REDISTRIBUTION_INPUT.csv                    # 30 Priority supply redistribution pairs
├── crop_production_clean.csv                   # Cleaned crop production & yield records
├── storage_infrastructure.csv                  # District SWC, FCI & Cold Storage capacities
└── DATA_DICTIONARY.csv                         # Full schema and column definitions
```

---

## 📊 5. Feature Schema & Command Center Interface

The primary dataset (`ALL_INDIA_HACKATHON_COMMAND_CENTER_DATA.csv` and `TAMILNADU_HACKATHON_COMMAND_CENTER_DATA.csv`) powers both the **Google Maps Command Center Frontend** and the **XGBoost Risk Engine**:

| Field Name | Type | Description | Unit | Data Class |
|---|---|---|---|---|
| `district_name` | String | Official LGD District Name | - | `REAL` |
| `node_type` | String | Functional node classification (Farm, Warehouse, Market) | - | `DERIVED` |
| `latitude` | Float | Geographic Latitude Centroid | Decimal Degrees | `REAL` |
| `longitude` | Float | Geographic Longitude Centroid | Decimal Degrees | `REAL` |
| `crop_type` | String | Dominant regional crop (e.g. Rice / Paddy) | - | `REAL` |
| `rainfall_deficit_pct` | Float | % deficit below historical seasonal mean | % | `SCENARIO_ASSUMPTION` |
| `temp_anomaly_c` | Float | Surface temperature anomaly above normal | °C | `SCENARIO_ASSUMPTION` |
| `reservoir_level_pct` | Float | Current reservoir water storage level | % | `SCENARIO_ASSUMPTION` |
| `soil_moisture_index` | Float | Topsoil moisture index (0.00 to 1.00) | Index | `DERIVED` |
| `storage_capacity_tonnes` | Float | Combined SWC + FCI + Cold Storage Capacity | Metric Tonnes | `REAL` |
| `current_stock_tonnes` | String | Physical inventory in warehouses | Metric Tonnes | `MISSING` |
| `vulnerability_score` | Float | Integrated Food Insecurity Risk Index (0 - 100) | Index | `MODEL_OUTPUT` |

---

## 🧮 6. Vulnerability Scoring Methodology

The baseline **Vulnerability Score ($V$)** quantifies multi-dimensional food security risks during climate stress:

$$V = 0.35 \times \text{ClimateStress} + 0.30 \times \text{ProductionRisk} + 0.20 \times \text{StorageDeficit} + 0.15 \times \text{LogisticsRisk}$$

Where:
- **Climate Stress:** Normalized combination of rainfall deficit, temperature anomaly, and reservoir depletion.
- **Production Risk:** Historical yield variance and crop sensitivity to water deficit.
- **Storage Deficit:** Ratio of required buffer stock to existing warehousing capacity.
- **Logistics Risk:** Distance to nearest major transport corridor and market connectivity index.

---

## 🔄 7. Closed-Loop AI Supply Redistribution Engine

When El Niño stress elevates a district's vulnerability score above $65.0$ (High/Critical Risk), FORESIGHT triggers the **Linear Programming Supply Redistribution Engine**:

1. **Surplus Identification:** Identifies neighboring districts with buffer capacity exceeding safety thresholds ($V < 35.0$).
2. **Cost-Risk Routing:** Computes optimal grain transfer routes balancing transport distance (km) against climate hazard exposure along highway corridors.
3. **Intervention Impact Evaluation:** Re-simulates vulnerability scores post-redistribution to quantify risk reduction (e.g., Vulnerability Score reduced from $74.2 \rightarrow 38.5$).

---

## 🚀 8. How to Use

### In Next.js Frontend (`frontend/src/app/page.tsx`):
```typescript
import foodData from '@/data/ALL_INDIA_HACKATHON_COMMAND_CENTER_DATA.csv';

// Plot districts on Google Maps / Leaflet
foodData.forEach((district) => {
  const marker = new google.maps.Marker({
    position: { lat: district.latitude, lng: district.longitude },
    title: district.district_name,
    icon: district.vulnerability_score > 60 ? 'red_pin.png' : 'green_pin.png'
  });
});
```

### In Python / Colab (`FoodGuard_Risk_Engine.ipynb`):
```python
import pandas as pd
import xgboost as xgb
import shap

# Load clean training data
df = pd.read_csv('data/ML_TRAINING_DATA.csv')
X = df[['rainfall_deficit_pct', 'temp_anomaly_c', 'reservoir_level_pct', 'soil_moisture_index', 'yield_kg_ha']]
y = df['vulnerability_score']

# Train XGBoost Regressor
model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.05)
model.fit(X, y)

# Generate SHAP Root-Cause Explanations
explainer = shap.TreeExplainer(model)
shap_values = explainer(X)
shap.summary_plot(shap_values, X)
```

---

## 📜 9. Related Documentation & References

- [Architecture & Tech Stack](architecture_and_tech_stack.md)
- [Platform Features & Differentiating Strategy](features.md)
- [API Reference Guide](api_reference.md)
- [State & District Crop Cultivation Summary](STATE_DISTRICT_CULTIVATION_SUMMARY.md)
- [Data Inventory & Integrity Metrics](DATA_INVENTORY.md)
