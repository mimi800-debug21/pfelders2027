import { createClient } from '@libsql/client';

const tursoClient = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Ensure table exists
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zeitstempel TEXT NOT NULL,
        familie TEXT NOT NULL,
        interesse TEXT NOT NULL,
        erwachsene INTEGER NOT NULL DEFAULT 0,
        kinder INTEGER NOT NULL DEFAULT 0,
        abfahrt TEXT NOT NULL
      )
    `);

    if (req.method === 'GET') {
      // Read all responses
      const result = await tursoClient.execute('SELECT * FROM responses ORDER BY id DESC');
      const rows = result.rows.map(row => ({
        id: row[0],
        zeitstempel: row[1],
        familie: row[2],
        interesse: row[3],
        erwachsene: row[4],
        kinder: row[5],
        abfahrt: row[6]
      }));
      return res.status(200).json({ success: true, data: rows });
    }

    if (req.method === 'POST') {
      // Insert new response
      const { zeitstempel, familie, interesse, erwachsene, kinder, abfahrt } = req.body;
      
      await tursoClient.execute({
        sql: 'INSERT INTO responses (zeitstempel, familie, interesse, erwachsene, kinder, abfahrt) VALUES (?, ?, ?, ?, ?, ?)',
        args: [zeitstempel, familie, interesse, erwachsene, kinder, abfahrt]
      });
      
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id, all } = req.query;
      
      if (all === 'true') {
        await tursoClient.execute('DELETE FROM responses');
      } else if (id) {
        await tursoClient.execute({
          sql: 'DELETE FROM responses WHERE id = ?',
          args: [parseInt(id, 10)]
        });
      }
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
