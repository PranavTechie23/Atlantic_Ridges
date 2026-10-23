-- ==============================================================================
-- PRYSM COMPETITOR INTELLIGENCE — POSTGRESQL SCHEMA INITIALIZATION
-- Database: prysm (PostgreSQL 18+)
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. COMPETITORS
CREATE TABLE IF NOT EXISTS competitors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tagline TEXT,
    category VARCHAR(100) NOT NULL,
    website VARCHAR(512) NOT NULL,
    logo_text VARCHAR(10),
    threat_score NUMERIC(5, 2) DEFAULT 0.0 CHECK (threat_score >= 0 AND threat_score <= 100),
    threat_level VARCHAR(20) DEFAULT 'LOW' CHECK (threat_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    trend VARCHAR(20) DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
    trend_delta NUMERIC(5, 2) DEFAULT 0.0,
    monitoring_status VARCHAR(20) DEFAULT 'active' CHECK (monitoring_status IN ('active', 'paused', 'degraded')),
    last_scan_time VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COMPETITOR METRICS (Radar & Vector Analysis)
CREATE TABLE IF NOT EXISTS competitor_metrics (
    competitor_id VARCHAR(64) PRIMARY KEY REFERENCES competitors(id) ON DELETE CASCADE,
    pricing_pressure INT DEFAULT 0,
    feature_velocity INT DEFAULT 0,
    ai_capability INT DEFAULT 0,
    launch_activity INT DEFAULT 0,
    integrations INT DEFAULT 0,
    analytics INT DEFAULT 0,
    automation INT DEFAULT 0,
    market_position INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMPETITOR THREAT SCORE HISTORY (Time Series)
CREATE TABLE IF NOT EXISTS competitor_threat_history (
    id SERIAL PRIMARY KEY,
    competitor_id VARCHAR(64) NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    threat_score NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(competitor_id, record_date)
);

-- 4. COMPETITOR PRICING PLANS
CREATE TABLE IF NOT EXISTS competitor_plans (
    id SERIAL PRIMARY KEY,
    competitor_id VARCHAR(64) NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_current NUMERIC(10, 2) NOT NULL,
    price_previous NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    billing_cycle VARCHAR(50) DEFAULT '/month',
    change_delta_percent NUMERIC(5, 2) DEFAULT 0,
    observed_date VARCHAR(50),
    source_url VARCHAR(1024),
    is_popular BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMPETITOR FEATURE MATRIX
CREATE TABLE IF NOT EXISTS competitor_features (
    id SERIAL PRIMARY KEY,
    competitor_id VARCHAR(64) NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('AVAILABLE', 'UNAVAILABLE', 'NEW', 'UPDATED')),
    note TEXT,
    last_updated VARCHAR(50)
);

-- 6. COMPETITOR POSITIONING CLAIMS
CREATE TABLE IF NOT EXISTS competitor_positioning (
    competitor_id VARCHAR(64) PRIMARY KEY REFERENCES competitors(id) ON DELETE CASCADE,
    current_claim TEXT NOT NULL,
    previous_claim TEXT,
    detected_shift TEXT,
    confidence NUMERIC(5, 2) DEFAULT 0,
    detected_date VARCHAR(50),
    tone_shift VARCHAR(100),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMPETITOR ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS competitor_announcements (
    id VARCHAR(64) PRIMARY KEY,
    competitor_id VARCHAR(64) NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    title VARCHAR(512) NOT NULL,
    date VARCHAR(50),
    type VARCHAR(50) CHECK (type IN ('Blog', 'Press Release', 'Release Notes', 'Product Hunt')),
    url VARCHAR(1024),
    summary TEXT,
    impact_score INT DEFAULT 0
);

-- 8. CHANGES / SIGNALS (Diff Engine Output)
CREATE TABLE IF NOT EXISTS change_events (
    id VARCHAR(64) PRIMARY KEY,
    competitor_id VARCHAR(64) NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    competitor_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('pricing', 'features', 'launch', 'positioning', 'announcements')),
    title VARCHAR(512) NOT NULL,
    summary TEXT NOT NULL,
    significance_score NUMERIC(5, 2) NOT NULL CHECK (significance_score >= 0 AND significance_score <= 100),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    confidence INT NOT NULL,
    evidence_id VARCHAR(64) NOT NULL,
    before_state TEXT,
    after_state TEXT,
    change_delta VARCHAR(255),
    why_it_matters TEXT NOT NULL
);

-- 9. EVIDENCE ITEMS (Cryptographic Audit Vault)
CREATE TABLE IF NOT EXISTS evidence_items (
    id VARCHAR(64) PRIMARY KEY,
    change_id VARCHAR(64) NOT NULL,
    competitor_id VARCHAR(64) NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    competitor_name VARCHAR(255) NOT NULL,
    title VARCHAR(512) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    confidence INT NOT NULL,
    observed_current_date TIMESTAMPTZ,
    observed_previous_date TIMESTAMPTZ,
    source_url VARCHAR(1024) NOT NULL,
    source_title VARCHAR(512),
    detection_method VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'flagged')),
    hash_digest VARCHAR(128) NOT NULL,
    before_content TEXT,
    after_content TEXT,
    raw_excerpt TEXT,
    strategic_implication TEXT,
    recommended_action TEXT,
    user_notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INTELLIGENCE REPORTS
CREATE TABLE IF NOT EXISTS intelligence_reports (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    subtitle VARCHAR(512),
    date VARCHAR(50),
    period VARCHAR(100),
    competitor_count INT DEFAULT 0,
    changes_count INT DEFAULT 0,
    high_impact_count INT DEFAULT 0,
    confidence_avg NUMERIC(5, 2) DEFAULT 0,
    executive_summary TEXT NOT NULL,
    key_changes JSONB DEFAULT '[]'::jsonb,
    competitive_movement JSONB DEFAULT '[]'::jsonb,
    strategic_implications JSONB DEFAULT '[]'::jsonb,
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    citations JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS FEED
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    description TEXT NOT NULL,
    time VARCHAR(100),
    severity VARCHAR(20) NOT NULL,
    competitor VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    evidence_id VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CRAWLER RAW SNAPSHOTS (Storage Registry)
CREATE TABLE IF NOT EXISTS snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_id VARCHAR(64) REFERENCES competitors(id) ON DELETE CASCADE,
    url VARCHAR(1024) NOT NULL,
    observed_at TIMESTAMPTZ DEFAULT NOW(),
    http_status INT NOT NULL,
    content_hash_sha256 CHAR(64) NOT NULL,
    byte_size INT NOT NULL,
    storage_path VARCHAR(1024),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- PERFORMANCE INDEXES (Optimized for Dashboard, Radar, and Timeline)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_changes_radar ON change_events(detected_at DESC, significance_score DESC);
CREATE INDEX IF NOT EXISTS idx_changes_category ON change_events(category);
CREATE INDEX IF NOT EXISTS idx_changes_severity ON change_events(severity);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON evidence_items(hash_digest);
CREATE INDEX IF NOT EXISTS idx_evidence_comp ON evidence_items(competitor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_snapshots_hash ON snapshots(content_hash_sha256);
