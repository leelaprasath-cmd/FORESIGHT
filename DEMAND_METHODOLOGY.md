# 30-Day Population Food Demand Derivation Methodology

## 1. Overview
This document specifies the exact formula, demographic source, and dietary intake norm used to calculate `projected_demand_tonnes_30d` for every district in India.

---

## 2. Demographic Baseline
- **Primary Source**: Census of India (2011) District Population Tables.
- **Population Growth Projection**: Annual compound growth rate of **1.0% per annum** applied from 2011 to 2023:
  $$	ext{Population}_{2023} = 	ext{Population}_{2011} 	imes (1.01)^{12}$$

---

## 3. Dietary Consumption Intake Norms
- **Primary Source**: Indian Council of Medical Research (ICMR) & National Institute of Nutrition (NIN) Recommended Dietary Allowances (RDA) & NSSO Household Consumption Expenditure Surveys.
- **Monthly Per Capita Rice/Cereal Intake**: **9.0 kg / person / month** (equivalent to 300 g / person / day).

---

## 4. Mathematical Formula

$$	ext{projected\_demand\_tonnes\_30d} = rac{	ext{Population}_{2023} 	imes 9.0 	ext{ kg}}{1000 	ext{ kg/tonne}}$$

---

## 5. Classification Tag
- **Data Classification**: `DERIVED`
- **Zero Fabrication Rule**: Unobserved stock levels are never used in demand calculation.
