# VELSATHON Hackathon El Niño Food Security ML Data Pipeline

## Quick Start Guide

Welcome to the **REAL-WORLD INDIA EL NIÑO FOOD SECURITY & SUPPLY REDISTRIBUTION PIPELINE** for VELSATHON.

---

## Output Datasets Portfolio

1. **`data/REAL_BASELINE_DATA.csv`**: Baseline table containing strictly `REAL` and `DERIVED` metrics across all 665 districts in India.
2. **`data/EL_NINO_SCENARIO_DATA.csv`**: Stress-testing scenario dataset with `NORMAL`, `MILD_EL_NINO`, `MODERATE_EL_NINO`, and `SEVERE_EL_NINO` parameters tagged `SCENARIO_ASSUMPTION`.
3. **`data/EL_NINO_FOOD_SECURITY_MASTER.csv`**: Comprehensive master table (35 fields) joining Identity, Agriculture, Storage, Climate, Food Security, Market, Logistics, Model Features, and Metadata.
4. **`data/ML_TRAINING_DATA.csv`**: Preprocessed numerical matrix formatted for **XGBoost / Scikit-learn ML model training** with target labels (`target_yield_anomaly_pct`, `target_shortage_risk_label`).
5. **`data/REDISTRIBUTION_INPUT.csv`**: Input matrix for the **AI Supply Redistribution Optimization Engine** mapping surplus districts to deficit destination districts, distance km, and priority score.
6. **`data/MODEL_FEATURE_DICTIONARY.csv`**: Feature dictionary for **SHAP Root-Cause Explainability**.

---

## Python / Google Colab Code Integration

```python
import pandas as pd
import xgboost as xgb

# 1. Load ML Training Data
df = pd.read_csv('data/ML_TRAINING_DATA.csv')

# 2. Select Features for XGBoost
features = ['rainfall_deficit_pct', 'temp_anomaly_c', 'reservoir_level_pct', 
            'area_sown_hectares', 'historical_yield_tonnes_per_hectare', 
            'storage_capacity_tonnes', 'projected_demand_tonnes_30d', 
            'current_market_price_rs_per_kg', 'distance_to_nearest_hub_km']

X = df[features]
y = df['target_shortage_risk_label']

# 3. Train Model
model = xgb.XGBClassifier(n_estimators=100, max_depth=4, random_state=42)
model.fit(X, y)

print("XGBoost Model Trained Successfully on Real India Data!")
```
