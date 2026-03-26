import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize DB
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        uid VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        "displayName" VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        points INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS labs (
        id VARCHAR(255) PRIMARY KEY,
        code VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        "iconName" VARCHAR(255),
        color VARCHAR(255),
        bg VARCHAR(255),
        "group" VARCHAR(255),
        "order" INTEGER
      );

      CREATE TABLE IF NOT EXISTS experiments (
        id VARCHAR(255) PRIMARY KEY,
        "labId" VARCHAR(255) REFERENCES labs(id),
        "weekNumber" INTEGER,
        title VARCHAR(255) NOT NULL,
        aim TEXT,
        theory TEXT,
        procedure TEXT,
        materials TEXT,
        observations TEXT,
        result TEXT,
        "vivaQuestions" TEXT
      );

      CREATE TABLE IF NOT EXISTS contributions (
        id VARCHAR(255) PRIMARY KEY,
        "experimentId" VARCHAR(255) REFERENCES experiments(id),
        "userId" VARCHAR(255) REFERENCES users(uid),
        username VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS upvotes (
        id VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) REFERENCES users(uid),
        "contributionId" VARCHAR(255) REFERENCES contributions(id),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing DB:', err);
  } finally {
    client.release();
  }
}

initDB();

// API Routes

// Users
app.post('/api/users', async (req, res) => {
  const { uid, email, displayName, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (uid, email, "displayName", role) VALUES ($1, $2, $3, $4) ON CONFLICT (uid) DO UPDATE SET email = EXCLUDED.email, "displayName" = EXCLUDED."displayName" RETURNING *',
      [uid, email, displayName, role || 'student']
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:uid', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE uid = $1', [req.params.uid]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT uid, email, "displayName" as username, role, points, "createdAt" FROM users ORDER BY points DESC LIMIT 50');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Labs
app.get('/api/labs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM labs ORDER BY "order" ASC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/labs', async (req, res) => {
  const { id, code, name, iconName, color, bg, group, order } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO labs (id, code, name, "iconName", color, bg, "group", "order") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, name = EXCLUDED.name, "iconName" = EXCLUDED."iconName", color = EXCLUDED.color, bg = EXCLUDED.bg, "group" = EXCLUDED."group", "order" = EXCLUDED."order" RETURNING *',
      [id, code, name, iconName, color, bg, group, order]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Experiments
app.get('/api/experiments/:labId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experiments WHERE "labId" = $1 ORDER BY "weekNumber" ASC', [req.params.labId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/experiment/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experiments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Experiment not found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/experiments', async (req, res) => {
  const { id, labId, weekNumber, title, aim, theory, procedure, materials, observations, result: expResult, vivaQuestions } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO experiments (id, "labId", "weekNumber", title, aim, theory, procedure, materials, observations, result, "vivaQuestions") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO UPDATE SET "labId" = EXCLUDED."labId", "weekNumber" = EXCLUDED."weekNumber", title = EXCLUDED.title, aim = EXCLUDED.aim, theory = EXCLUDED.theory, procedure = EXCLUDED.procedure, materials = EXCLUDED.materials, observations = EXCLUDED.observations, result = EXCLUDED.result, "vivaQuestions" = EXCLUDED."vivaQuestions" RETURNING *',
      [id, labId, weekNumber, title, aim, theory, procedure, materials, observations, expResult, vivaQuestions]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Contributions
app.get('/api/contributions/:experimentId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contributions WHERE "experimentId" = $1 ORDER BY "createdAt" DESC', [req.params.experimentId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contributions', async (req, res) => {
  const { id, experimentId, userId, username, type, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO contributions (id, "experimentId", "userId", username, type, content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, experimentId, userId, username, type, content]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/contributions/:id', async (req, res) => {
  const { content, type } = req.body;
  try {
    const result = await pool.query(
      'UPDATE contributions SET content = $1, type = $2 WHERE id = $3 RETURNING *',
      [content, type, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contributions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM contributions WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contributions/:id/upvote', async (req, res) => {
  const { userId, authorId } = req.body;
  const contributionId = req.params.id;
  const upvoteId = `${userId}_${contributionId}`;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if already upvoted
    const check = await client.query('SELECT * FROM upvotes WHERE id = $1', [upvoteId]);
    if (check.rows.length > 0) {
      throw new Error('Already upvoted');
    }

    // Insert upvote
    await client.query('INSERT INTO upvotes (id, "userId", "contributionId") VALUES ($1, $2, $3)', [upvoteId, userId, contributionId]);
    
    // Increment contribution upvotes
    await client.query('UPDATE contributions SET upvotes = upvotes + 1 WHERE id = $1', [contributionId]);
    
    // Increment user points
    if (!authorId.startsWith('anonymous-')) {
      await client.query('UPDATE users SET points = points + 2 WHERE uid = $1', [authorId]);
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err: any) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
