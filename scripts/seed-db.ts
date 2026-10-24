import fs from "fs";
import path from "path";
import { pool } from "../lib/db";
import {
  realCompetitors,
  realChanges,
  realEvidence,
  realReports,
  realNotifications,
} from "../db/real-data";
import { upsertSeedUser } from "../lib/auth/user-store";
import {
  JUDGE_DEMO_EMAIL,
  JUDGE_DEMO_PASSWORD_HINT,
} from "../lib/auth/demo-access";

async function seed() {
  console.log("🌱 Starting PRYSM Real-World Intelligence Seeder...");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Ensure schema tables exist first (for fresh remote/cloud PostgreSQL instances)
    console.log("📐 Ensuring database schema exists...");
    const schemaPath = path.join(__dirname, "../db/schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, "utf-8");
      await client.query(schemaSql);
    }

    // Clear existing data in topological order
    console.log("🧹 Clearing old database records...");
    await client.query(`
      TRUNCATE TABLE 
        snapshots,
        notifications,
        intelligence_reports,
        evidence_items,
        change_events,
        competitor_announcements,
        competitor_positioning,
        competitor_features,
        competitor_plans,
        competitor_threat_history,
        competitor_metrics,
        competitors
      CASCADE;
    `);

    // 1. Seed Competitors & related sub-entities
    console.log(`🏢 Seeding ${realCompetitors.length} enterprise competitors...`);
    for (const comp of realCompetitors) {
      await client.query(
        `INSERT INTO competitors (
          id, name, slug, tagline, category, website, logo_text, 
          threat_score, threat_level, trend, trend_delta, monitoring_status, last_scan_time
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          comp.id,
          comp.name,
          comp.slug,
          comp.tagline,
          comp.category,
          comp.website,
          comp.logoText,
          comp.threatScore,
          comp.threatLevel,
          comp.trend,
          comp.trendDelta,
          comp.monitoringStatus,
          comp.lastScanTime,
        ]
      );

      // Metrics
      if (comp.metrics) {
        await client.query(
          `INSERT INTO competitor_metrics (
            competitor_id, pricing_pressure, feature_velocity, ai_capability, 
            launch_activity, integrations, analytics, automation, market_position
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            comp.id,
            comp.metrics.pricingPressure,
            comp.metrics.featureVelocity,
            comp.metrics.aiCapability,
            comp.metrics.launchActivity,
            comp.metrics.integrations,
            comp.metrics.analytics,
            comp.metrics.automation,
            comp.metrics.marketPosition,
          ]
        );
      }

      // Threat History
      if (comp.history && comp.history.length > 0) {
        for (const h of comp.history) {
          await client.query(
            `INSERT INTO competitor_threat_history (competitor_id, record_date, threat_score)
             VALUES ($1, $2, $3)
             ON CONFLICT (competitor_id, record_date) DO UPDATE SET threat_score = EXCLUDED.threat_score`,
            [comp.id, h.date, h.threatScore]
          );
        }
      }

      // Plans
      if (comp.plans && comp.plans.length > 0) {
        for (const plan of comp.plans) {
          await client.query(
            `INSERT INTO competitor_plans (
              competitor_id, name, price_current, price_previous, currency, 
              billing_cycle, change_delta_percent, observed_date, source_url, is_popular
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              comp.id,
              plan.name,
              plan.priceCurrent,
              plan.pricePrevious,
              plan.currency,
              plan.billingCycle,
              plan.changeDeltaPercent,
              plan.observedDate,
              plan.sourceUrl,
              plan.popular || false,
            ]
          );
        }
      }

      // Features
      if (comp.features && comp.features.length > 0) {
        for (const feat of comp.features) {
          await client.query(
            `INSERT INTO competitor_features (
              competitor_id, name, category, status, note, last_updated
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              comp.id,
              feat.name,
              feat.category,
              feat.status,
              feat.note || null,
              feat.lastUpdated || null,
            ]
          );
        }
      }

      // Positioning
      if (comp.positioning) {
        await client.query(
          `INSERT INTO competitor_positioning (
            competitor_id, current_claim, previous_claim, detected_shift, confidence, detected_date, tone_shift
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            comp.id,
            comp.positioning.currentClaim,
            comp.positioning.previousClaim,
            comp.positioning.detectedShift,
            comp.positioning.confidence,
            comp.positioning.detectedDate,
            comp.positioning.toneShift,
          ]
        );
      }

      // Announcements
      if (comp.announcements && comp.announcements.length > 0) {
        for (const ann of comp.announcements) {
          await client.query(
            `INSERT INTO competitor_announcements (
              id, competitor_id, title, date, type, url, summary, impact_score
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO NOTHING`,
            [
              ann.id,
              comp.id,
              ann.title,
              ann.date,
              ann.type,
              ann.url,
              ann.summary,
              ann.impactScore,
            ]
          );
        }
      }
    }

    // 2. Seed Change Events
    console.log(`⚡ Seeding ${realChanges.length} high-significance change signals...`);
    for (const ch of realChanges) {
      await client.query(
        `INSERT INTO change_events (
          id, competitor_id, competitor_name, category, title, summary, 
          significance_score, severity, detected_at, confidence, evidence_id, 
          before_state, after_state, change_delta, why_it_matters
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          ch.id,
          ch.competitorId,
          ch.competitorName,
          ch.category,
          ch.title,
          ch.summary,
          ch.significanceScore,
          ch.severity,
          ch.detectedAt,
          ch.confidence,
          ch.evidenceId,
          ch.beforeState || null,
          ch.afterState || null,
          ch.changeDelta || null,
          ch.whyItMatters,
        ]
      );
    }

    // 3. Seed Evidence Items (Cryptographic Vault)
    console.log(`🔐 Seeding ${realEvidence.length} cryptographic evidence vault records...`);
    for (const ev of realEvidence) {
      await client.query(
        `INSERT INTO evidence_items (
          id, change_id, competitor_id, competitor_name, title, category, severity, 
          confidence, observed_current_date, observed_previous_date, source_url, 
          source_title, detection_method, verification_status, hash_digest, 
          before_content, after_content, raw_excerpt, strategic_implication, 
          recommended_action, user_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
        [
          ev.id,
          ev.changeId,
          ev.competitorId,
          ev.competitorName,
          ev.title,
          ev.category,
          ev.severity,
          ev.confidence,
          ev.observedCurrentDate,
          ev.observedPreviousDate,
          ev.sourceUrl,
          ev.sourceTitle,
          ev.detectionMethod,
          ev.verificationStatus,
          ev.hashDigest,
          ev.beforeContent,
          ev.afterContent,
          ev.rawExcerpt,
          ev.strategicImplication,
          ev.recommendedAction || null,
          JSON.stringify(ev.userNotes || []),
        ]
      );
    }

    // 4. Seed Raw Crawler Snapshots
    console.log("📸 Seeding raw crawler audit snapshots...");
    const snapshotsData = [
      {
        competitor_id: "comp-acme",
        url: "https://acmecloud.io/pricing",
        http_status: 200,
        content_hash_sha256: "4f89a910ecb29381c818f9104882bcde7102eac694f6e4a81b29a023f019c41a",
        byte_size: 48920,
        storage_path: "s3://prysm-evidence/snapshots/2026-10-23/acme-pricing-dom.html",
      },
      {
        competitor_id: "comp-nova",
        url: "https://nova-agentic.ai/pricing",
        http_status: 200,
        content_hash_sha256: "d8271038bc49281a03948bfe018274019a3b9847102938471029471928471029",
        byte_size: 61400,
        storage_path: "s3://prysm-evidence/snapshots/2026-10-18/nova-pricing.html",
      },
      {
        competitor_id: "comp-orbit",
        url: "https://orbitcrm.com/pricing",
        http_status: 200,
        content_hash_sha256: "391847102948271b402837401928374a01928374019283740192837401928374",
        byte_size: 92450,
        storage_path: "s3://prysm-evidence/snapshots/2026-10-12/orbit-features.html",
      },
      {
        competitor_id: "comp-vertex",
        url: "https://vertexlabs.dev/pricing",
        http_status: 200,
        content_hash_sha256: "710293840192837401928374a019283740192837401928374019283740192837",
        byte_size: 34120,
        storage_path: "s3://prysm-evidence/snapshots/2026-10-16/vertex-pricing.html",
      },
      {
        competitor_id: "comp-nexasuite",
        url: "https://nexasuite.enterprise",
        http_status: 200,
        content_hash_sha256: "9182736401928374a01928374019283740192837401928374019283740192837",
        byte_size: 112800,
        storage_path: "s3://prysm-evidence/snapshots/2026-10-09/nexasuite-homepage.html",
      },
    ];

    for (const s of snapshotsData) {
      await client.query(
        `INSERT INTO snapshots (
          competitor_id, url, http_status, content_hash_sha256, byte_size, storage_path
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [s.competitor_id, s.url, s.http_status, s.content_hash_sha256, s.byte_size, s.storage_path]
      );
    }

    // 5. Seed Reports
    console.log(`📄 Seeding ${realReports.length} executive intelligence reports...`);
    for (const rep of realReports) {
      await client.query(
        `INSERT INTO intelligence_reports (
          id, title, subtitle, date, period, competitor_count, changes_count, 
          high_impact_count, confidence_avg, executive_summary, key_changes, 
          competitive_movement, strategic_implications, recommended_actions, citations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          rep.id,
          rep.title,
          rep.subtitle,
          rep.date,
          rep.period,
          rep.competitorCount,
          rep.changesCount,
          rep.highImpactCount,
          rep.confidenceAvg,
          rep.executiveSummary,
          JSON.stringify(rep.keyChanges || []),
          JSON.stringify(rep.competitiveMovement || []),
          JSON.stringify(rep.strategicImplications || []),
          JSON.stringify(rep.recommendedActions || []),
          JSON.stringify(rep.citations || {}),
        ]
      );
    }

    // 6. Seed Notifications
    console.log(`🔔 Seeding ${realNotifications.length} alerts & notifications...`);
    for (const n of realNotifications) {
      await client.query(
        `INSERT INTO notifications (
          id, title, description, time, severity, competitor, is_read, evidence_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          n.id,
          n.title,
          n.description,
          n.time,
          n.severity,
          n.competitor,
          n.read,
          n.evidenceId || null,
        ]
      );
    }

    await client.query("COMMIT");
    console.log("🔐 Seeding HackNova judge workspace credentials (scrypt hashed)...");
    await upsertSeedUser({
      email: JUDGE_DEMO_EMAIL,
      name: "HackNova Judge",
      password: JUDGE_DEMO_PASSWORD_HINT,
      plan: "Enterprise Demo",
    });
    await upsertSeedUser({
      email: "demo@prysm.io",
      name: "PRYSM Demo Admin",
      password: "Demo2026!",
      plan: "Enterprise Demo",
    });
    console.log(`   Judge login → ${JUDGE_DEMO_EMAIL} / ${JUDGE_DEMO_PASSWORD_HINT}`);

    console.log("✅ PRYSM Real-World Intelligence Dataset Successfully Loaded into PostgreSQL!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
