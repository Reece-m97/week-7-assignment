import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", function (request, response) {
  response.json("You are looking at my route route. How roude!");
});

// Route: Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = `
        SELECT id, password, villain_name, notoriety_score
        FROM users
        WHERE username = $1;
      `;
    const result = await db.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = result.rows[0];
    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid password." });
    }

    res.json({
      id: user.id,
      villain_name: user.villain_name,
      notoriety_score: user.notoriety_score,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in." });
  }
});

//   Route: Register new user
app.post("/register", async (req, res) => {
  const { username, password, villainName } = req.body;

  if (!username || !password || !villainName) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const query = `
        INSERT INTO users (username, password, villain_name)
        VALUES ($1, $2, $3)
        RETURNING id, villain_name, notoriety_score;
      `;
    const result = await db.query(query, [username, password, villainName]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Route: Get all deeds with engagement (Profile and Leaderboard Pages)
app.get("/deeds", async (req, res) => {
  try {
    const query = `
        SELECT 
    deeds.id AS deed_id,
    deeds.description,
    deeds.category,
    deeds.date,
    users.villain_name,
    COUNT(reactions.id) AS evil_laughs,
    COUNT(comments.id) AS comments_count
FROM deeds
LEFT JOIN users ON deeds.user_id = users.id
LEFT JOIN reactions ON deeds.id = reactions.deed_id
LEFT JOIN comments ON deeds.id = comments.deed_id
GROUP BY deeds.id, users.villain_name
ORDER BY deeds.date DESC;
      `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching deeds:", error);
    res.status(500).json({ error: "Failed to fetch deeds." });
  }
});

// Route: Get a user's profile by ID
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const query = `
        SELECT 
          users.id,
          users.villain_name,
          users.backstory,
          users.notoriety_score,
          villain_levels.title
        FROM users
        JOIN villain_levels
        ON users.notoriety_score BETWEEN villain_levels.min_score AND villain_levels.max_score
        WHERE users.id = $1;
      `;
    const result = await db.query(query, [userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

// Route: Add a new deed
app.post("/deeds", async (req, res) => {
  const { user_id, description, category } = req.body;
  try {
    const query = `
        INSERT INTO deeds (user_id, description, category)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const result = await db.query(query, [user_id, description, category]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding deed:", error);
    res.status(500).json({ error: "Failed to add deed." });
  }
});

// Route: Add an "evil laugh" reaction
app.post("/reactions", async (req, res) => {
  const { deed_id, user_id } = req.body;
  try {
    const query = `
        INSERT INTO reactions (deed_id, user_id)
        VALUES ($1, $2)
        RETURNING *;
      `;
    const result = await db.query(query, [deed_id, user_id]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({ error: "Failed to add reaction." });
  }
});

// Route: Add a comment
app.post("/comments", async (req, res) => {
  const { deed_id, user_id, comment } = req.body;
  try {
    const query = `
        INSERT INTO comments (deed_id, user_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const result = await db.query(query, [deed_id, user_id, comment]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

// Route: Leaderboard
app.get("/leaderboard", async (req, res) => {
  try {
    const query = `
        SELECT 
          users.villain_name,
          users.notoriety_score,
          COUNT(deeds.id) AS total_deeds,
          villain_levels.title
        FROM users
        JOIN villain_levels
        ON users.notoriety_score BETWEEN villain_levels.min_score AND villain_levels.max_score
        LEFT JOIN deeds ON deeds.user_id = users.id
        GROUP BY users.id, villain_levels.title
        ORDER BY users.notoriety_score DESC
        LIMIT 10;
      `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard." });
  }
});

// start server
app.listen(8080, function () {
  console.log(`Server is running on port 8080`);
});
