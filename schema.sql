-- =========================================================
-- AgriSmart AI: Complete Cloud Database Schema (PostgreSQL / Supabase)
-- Execute this SQL in your Supabase SQL Editor or PostgreSQL database
-- =========================================================

-- 1. Farmers Profile Table
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_name VARCHAR(100) NOT NULL DEFAULT 'Ramesh',
    location VARCHAR(150) NOT NULL DEFAULT 'Srikakulam, Andhra Pradesh',
    latitude DOUBLE PRECISION DEFAULT 18.2969,
    longitude DOUBLE PRECISION DEFAULT 83.8967,
    primary_crop VARCHAR(50) NOT NULL DEFAULT 'Tomato',
    field_name VARCHAR(50) DEFAULT 'Field A (North Plot)',
    field_size_acres NUMERIC(5, 2) DEFAULT 2.50,
    preferred_language VARCHAR(10) DEFAULT 'te',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crop Disease Scans & AI Diagnostics History
CREATE TABLE IF NOT EXISTS crop_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    crop_name VARCHAR(50) NOT NULL,
    disease_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'attention', -- 'healthy', 'attention', 'critical'
    confidence NUMERIC(5, 2) NOT NULL DEFAULT 95.00,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    organic_remedy TEXT NOT NULL,
    chemical_remedy TEXT NOT NULL,
    preventive_care TEXT NOT NULL,
    image_url TEXT,
    leaf_greenness_pct NUMERIC(5, 2) DEFAULT 42.00,
    necrosis_pct NUMERIC(5, 2) DEFAULT 18.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Continuous Crop Growth & Canopy Health Tracking
CREATE TABLE IF NOT EXISTS crop_growth_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    crop_name VARCHAR(50) NOT NULL DEFAULT 'Tomato',
    growth_stage VARCHAR(50) DEFAULT 'Vegetative - Active Tillering',
    health_score INT NOT NULL CHECK (health_score BETWEEN 0 AND 100) DEFAULT 89,
    leaf_color_spad NUMERIC(5, 2) NOT NULL DEFAULT 42.00,
    plant_height_cm NUMERIC(6, 2) NOT NULL DEFAULT 48.00,
    canopy_coverage_pct NUMERIC(5, 2) NOT NULL DEFAULT 74.00,
    chlorophyll_status VARCHAR(50) DEFAULT 'Optimal Healthy Green',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Hyperlocal Farm Weather & Telemetry Logs
CREATE TABLE IF NOT EXISTS weather_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    temperature_c NUMERIC(4, 1) NOT NULL DEFAULT 29.0,
    humidity_pct INT NOT NULL DEFAULT 78,
    rain_probability_pct INT NOT NULL DEFAULT 75,
    rainfall_amount_mm NUMERIC(5, 1) DEFAULT 12.0,
    wind_speed_kmh NUMERIC(5, 1) DEFAULT 8.5,
    soil_moisture_pct INT NOT NULL DEFAULT 62,
    soil_ph NUMERIC(3, 1) DEFAULT 6.8,
    spraying_recommended BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Outbreak Alerts & Pest Radar
CREATE TABLE IF NOT EXISTS farm_alerts (
    id SERIAL PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'High', -- 'High', 'Moderate', 'Low'
    category VARCHAR(50) NOT NULL DEFAULT 'Pest Outbreak',
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Voice Assistant & Multilingual Chat Log
CREATE TABLE IF NOT EXISTS voice_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    user_query TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    language_code VARCHAR(10) NOT NULL DEFAULT 'te',
    audio_played BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_crop_scans_farmer ON crop_scans(farmer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_logs_farmer ON crop_growth_logs(farmer_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_weather_farmer ON weather_telemetry(farmer_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_conversations_farmer ON voice_conversations(farmer_id, created_at DESC);
