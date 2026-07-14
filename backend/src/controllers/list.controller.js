const pool = require('../db');

// GET /lists -> all lists belonging to logged-in user
async function getLists(req, res) {
  const result = await pool.query(
    `SELECT * FROM shopping_lists WHERE user_id = $1 ORDER BY id`,
    [req.user.id]
  );
  res.json(result.rows);
}

async function createList(req, res) {
  const { name } = req.body;
  const result = await pool.query(
    `INSERT INTO shopping_lists (name, user_id) VALUES ($1,$2) RETURNING *`,
    [name, req.user.id]
  );
  res.status(201).json(result.rows[0]);
}

async function updateList(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'name is required' });

  const result = await pool.query(
    `UPDATE shopping_lists SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
    [name, id, req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ message: 'List not found' });
  res.json(result.rows[0]);
}

async function deleteList(req, res) {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM shopping_lists WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ message: 'List not found' });
  res.json({ message: 'Deleted' });
}

module.exports = { getLists, createList, updateList, deleteList };