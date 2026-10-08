# Machine Learning Feature Risk Scoring Methodology

## 1. Overview
This document specifies the transparent scoring rules for risk indicators fed into the XGBoost model and SHAP explainability engine.

---

## 2. Individual Risk Components

### Crop Failure Risk (\(R_{crop}\))
$$R_{crop} = \min\left(1.0, \max\left(0.0, 0.015 	imes 	ext{rainfall\_deficit\_pct} + 0.005 	imes (100 - 	ext{reservoir\_level\_pct})ight)ight)$$

### Affordability Risk (\(R_{afford}\))
$$R_{afford} = \min\left(1.0, \max\left(0.0, rac{	ext{current\_retail\_price\_rs} - 30.0}{30.0}ight)ight)$$

### Logistics Risk (\(R_{logistics}\))
$$R_{logistics} = \min\left(1.0, \max\left(0.0, rac{	ext{distance\_to\_nearest\_hub\_km} - 10}{50.0}ight)ight)$$

### Overall Food Security Risk (\(R_{overall}\))
$$R_{overall} = 0.35 R_{crop} + 0.25 R_{shortage} + 0.20 R_{afford} + 0.20 R_{logistics}$$

---

## 3. Classification Tag
- **Data Classification**: `MODEL_OUTPUT` / `DERIVED`
