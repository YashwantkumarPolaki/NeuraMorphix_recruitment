import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const JSON_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json',
};

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      admin_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passcode TEXT UNIQUE,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Seed the original hardcoded admin so login works against the shared DB too.
  const existing = await sql`SELECT 1 FROM admins WHERE email = 'ykpmusic502@gmail.com' LIMIT 1`;
  if (existing.length === 0) {
    const seedAdmin = {
      admin_id: 'admin-ykp-1',
      name: 'YKP',
      email: 'ykpmusic502@gmail.com',
      role: 'Admin',
      password: 'ykp1234567',
      passcode: null,
      invited_by: null,
      created_at: '2026-01-01T00:00:00Z',
    };
    await sql`
      INSERT INTO admins (admin_id, email, passcode, data)
      VALUES (${seedAdmin.admin_id}, ${seedAdmin.email}, ${seedAdmin.passcode}, ${JSON.stringify(seedAdmin)}::jsonb)
      ON CONFLICT (email) DO NOTHING
    `;
  }

  schemaReady = true;
}

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function generatePasscode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function stripSecrets(admin) {
  const { password, passcode, ...rest } = admin;
  return rest;
}

function getSubPath(path) {
  const match = path.match(/\/admins\/?(.*)$/);
  return match ? match[1].replace(/\/+$/, '') : '';
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: JSON_HEADERS, body: '' };
  }

  try {
    await ensureSchema();

    const subPath = getSubPath(event.path);

    if (event.httpMethod === 'GET' && subPath === '') {
      const rows = await sql`SELECT data FROM admins ORDER BY created_at ASC`;
      return {
        statusCode: 200,
        headers: JSON_HEADERS,
        body: JSON.stringify(rows.map((r) => stripSecrets(r.data))),
      };
    }

    if (event.httpMethod === 'POST' && subPath === '') {
      const { name, email, role, invited_by } = JSON.parse(event.body || '{}');
      if (!name || !email || !role) {
        return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'name, email, and role are required' }) };
      }
      const cleanEmail = email.trim().toLowerCase();

      const dup = await sql`SELECT 1 FROM admins WHERE email = ${cleanEmail} LIMIT 1`;
      if (dup.length > 0) {
        return { statusCode: 409, headers: JSON_HEADERS, body: JSON.stringify({ error: 'An admin with this email already exists' }) };
      }

      const newAdmin = {
        admin_id: `admin-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        role,
        password: generateTempPassword(),
        passcode: generatePasscode(),
        invited_by: invited_by || null,
        created_at: new Date().toISOString(),
      };

      await sql`
        INSERT INTO admins (admin_id, email, passcode, data)
        VALUES (${newAdmin.admin_id}, ${newAdmin.email}, ${newAdmin.passcode}, ${JSON.stringify(newAdmin)}::jsonb)
      `;

      // Full record (including the one-time secrets) is returned only here,
      // right after creation, so the UI can display/email them once.
      return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(newAdmin) };
    }

    if (event.httpMethod === 'POST' && subPath === 'login-password') {
      const { email, password } = JSON.parse(event.body || '{}');
      if (!email || !password) {
        return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'email and password are required' }) };
      }
      const rows = await sql`SELECT data FROM admins WHERE email = ${email.trim().toLowerCase()} LIMIT 1`;
      if (rows.length === 0 || rows[0].data.password !== password.trim()) {
        return { statusCode: 401, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Invalid credentials' }) };
      }
      return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(stripSecrets(rows[0].data)) };
    }

    if (event.httpMethod === 'POST' && subPath === 'login-passcode') {
      const { passcode } = JSON.parse(event.body || '{}');
      if (!passcode) {
        return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'passcode is required' }) };
      }
      const rows = await sql`SELECT data FROM admins WHERE passcode = ${passcode.trim()} LIMIT 1`;
      if (rows.length === 0) {
        return { statusCode: 401, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Invalid passcode' }) };
      }
      return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(stripSecrets(rows[0].data)) };
    }

    return { statusCode: 404, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Not found' }) };
  } catch (err) {
    console.error('[admins function] error:', err);
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: err.message || 'Internal error' }) };
  }
};
