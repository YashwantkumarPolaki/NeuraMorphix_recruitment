import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const JSON_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json',
};

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS applicants (
      id SERIAL PRIMARY KEY,
      application_id TEXT UNIQUE NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  schemaReady = true;
}

// Path after the function mount point, e.g. "" or "NM-2026-12345"
function getApplicationIdFromPath(path) {
  const match = path.match(/\/applicants\/?([^/]*)\/?$/);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: JSON_HEADERS, body: '' };
  }

  try {
    await ensureSchema();

    const applicationId = getApplicationIdFromPath(event.path);

    if (event.httpMethod === 'GET' && !applicationId) {
      const rows = await sql`SELECT data FROM applicants ORDER BY created_at DESC`;
      return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(rows.map((r) => r.data)) };
    }

    if (event.httpMethod === 'GET' && applicationId) {
      const rows = await sql`
        SELECT data FROM applicants WHERE UPPER(application_id) = UPPER(${applicationId}) LIMIT 1
      `;
      if (rows.length === 0) {
        return { statusCode: 404, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Not found' }) };
      }
      return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(rows[0].data) };
    }

    if (event.httpMethod === 'POST' && !applicationId) {
      const applicant = JSON.parse(event.body || '{}');
      if (!applicant.application_id) {
        return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'application_id is required' }) };
      }
      await sql`
        INSERT INTO applicants (application_id, data, updated_at)
        VALUES (${applicant.application_id}, ${JSON.stringify(applicant)}::jsonb, NOW())
        ON CONFLICT (application_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      `;
      return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(applicant) };
    }

    if (event.httpMethod === 'PUT' && applicationId) {
      const updates = JSON.parse(event.body || '{}');
      const existing = await sql`
        SELECT data FROM applicants WHERE UPPER(application_id) = UPPER(${applicationId}) LIMIT 1
      `;
      if (existing.length === 0) {
        return { statusCode: 404, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Not found' }) };
      }
      const merged = { ...existing[0].data, ...updates };
      await sql`
        UPDATE applicants SET data = ${JSON.stringify(merged)}::jsonb, updated_at = NOW()
        WHERE UPPER(application_id) = UPPER(${applicationId})
      `;
      return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(merged) };
    }

    return { statusCode: 404, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Not found' }) };
  } catch (err) {
    console.error('[applicants function] error:', err);
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: err.message || 'Internal error' }) };
  }
};
