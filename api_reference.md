# Climate Data API Reference

We are using the **Open-Meteo API** (which requires no API keys) for our climate and weather data. Below are the reference endpoints for fetching current, recent past, and historical climate data.

## 1. Current Weather
Fetches current temperature and wind speed, plus hourly forecasts.

**Endpoint:**
```http
GET https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m
```

**Response Format:**
```json
{
  "current": {
    "time": "2022-01-01T15:00",
    "temperature_2m": 2.4,
    "wind_speed_10m": 11.9
  },
  "hourly": {
    "time": ["2022-07-01T00:00","2022-07-01T01:00", "..."],
    "wind_speed_10m": [3.16,3.02,3.3,3.14,3.2,2.95, "..."],
    "temperature_2m": [13.7,13.3,12.8,12.3,11.8, "..."],
    "relative_humidity_2m": [82,83,86,85,88,88,84,76, "..."]
  }
}
```

## 2. Past 10 Days
Fetches hourly data for the last 10 days (useful for immediate historical context).

**Endpoint:**
```http
GET https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m
```

**Response Format:**
```json
{
  "hourly": {
    "time": ["2022-06-19T00:00","2022-06-19T01:00", "..."],
    "wind_speed_10m": [3.16,3.02,3.3,3.14,3.2,2.95, "..."],
    "temperature_2m": [13.7,13.3,12.8,12.3,11.8, "..."],
    "relative_humidity_2m": [82,83,86,85,88,88,84,76, "..."]
  }
}
```

## 3. Historical Data (ERA5)
Fetches long-term historical data for training models and analyzing climate baselines.

**Endpoint:**
```http
GET https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m
```

**Response Format:**
```json
{
  "hourly": {
    "time": ["2022-01-01T00:00","2022-01-01T01:00", "..."],
    "temperature_2m": [1.7,1.3,1.8,1.3,1.8, "..."]
  }
}
```
