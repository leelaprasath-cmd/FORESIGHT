# FORESIGHT: El Niño Food Security & Sustainable Supply Chain Platform

> 🏆 **VELSATHON Hackathon Submission**  
> *Anticipating, identifying, and reducing food system vulnerabilities under El Niño climate shocks across India.*

---

## 🌾 About FORESIGHT

**FORESIGHT** is an AI-powered food security resilience platform and operational digital twin built to tackle El Niño climate disruptions across India's agricultural supply chain. By integrating real-world climate indicators, crop production metrics, demographic demands, and warehousing infrastructure, FORESIGHT moves beyond simple risk prediction to deliver an end-to-end **Detect → Predict → Explain → Decide → Act → Verify** closed-loop decision engine.

---

## 🚀 Key Features

- **📍 Interactive Geospatial Command Center:** Real-time Google Maps visualizer plotting risk status across **665 districts of India** (including a 38-district Tamil Nadu deep-dive).
- **🌦️ El Niño Scenario Simulator:** Interactive slider-driven simulation engine testing micro-climate shocks (rainfall deficit, temperature rise, reservoir depletion).
- **🧠 Root-Cause Explainability Engine:** Tree-based XGBoost risk scoring combined with SHAP feature attribution explaining *why* specific districts face vulnerability.
- **🚚 Weather-Aware AI Supply Redistribution:** Linear programming optimization algorithm identifying surplus grain corridors and mapping cost-effective rerouting pairs to deficit regions.
- **🛡️ 100% Real-World Data Baseline:** Synthesized from official government sources (DES, IMD, NOAA CPC, FCI, CWC, Census 2011, LGD) with zero synthetic filler data.

---

## 📁 Repository & Pipeline Architecture

```text
FORESIGHT/
├── README.md                                 # Main project introduction & overview
├── FOOD_SECURITY_DATA_PIPELINE.md            # Comprehensive dataset schema & pipeline methodology
├── architecture_and_tech_stack.md            # System architecture, AWS cloud setup & tech stack
├── features.md                               # Complete feature catalog & hackathon differentiator strategy
├── api_reference.md                          # API documentation for frontend & backend services
├── FoodGuard_Risk_Engine.ipynb               # Jupyter notebook for ML model training & SHAP explainability
├── generate_colab_notebook.py                # Python script generating the Colab notebook
├── data/                                     # 19 Production-ready baseline & scenario CSV datasets
│   ├── ALL_INDIA_HACKATHON_COMMAND_CENTER_DATA.csv
│   ├── TAMILNADU_HACKATHON_COMMAND_CENTER_DATA.csv
│   ├── REAL_BASELINE_DATA.csv
│   ├── EL_NINO_SCENARIO_DATA.csv
│   ├── EL_NINO_FOOD_SECURITY_MASTER.csv
│   ├── ML_TRAINING_DATA.csv
│   └── REDISTRIBUTION_INPUT.csv
└── frontend/                                 # Next.js 15 + Google Maps interactive command center app
    ├── src/app/page.tsx
    ├── package.json
    └── next.config.ts
```

---

## 📖 Documentation Quick Links

- [🌾 Food System & El Niño Data Pipeline Documentation](FOOD_SECURITY_DATA_PIPELINE.md)
- [🏗️ System Architecture & Technology Stack](architecture_and_tech_stack.md)
- [✨ Platform Features & Differentiating Strategy](features.md)
- [🔌 API Reference Manual](api_reference.md)
- [🗺️ State & District Crop Cultivation Summary](STATE_DISTRICT_CULTIVATION_SUMMARY.md)

---

## 🛠️ Quick Start

### 1. Run Next.js Command Center
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to launch the Interactive Command Center.

### 2. Train Risk Engine Notebook
Run `FoodGuard_Risk_Engine.ipynb` in Google Colab or Jupyter Lab to train the XGBoost risk model and visualize SHAP root-cause feature importances.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for details.