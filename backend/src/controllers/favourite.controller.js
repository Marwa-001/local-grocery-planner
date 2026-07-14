const pool = require('../db');

// GET /favourites
async function getFavourites(req, res) {
  const result = await pool.query(
    `SELECT f.id AS favourite_id, p.*
     FROM favourite_products f
     JOIN products p ON f.product_id = p.id
     WHERE f.user_id = $1
     ORDER BY f.id`,
    [req.user.id]
  );
  res.json(result.rows);
}

// POST /favourites/:id -> :id is productId
async function addFavourite(req, res) {
  const productId = req.params.id;
  try {
    const result = await pool.query(
      `INSERT INTO favourite_products (user_id, product_id) VALUES ($1,$2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING *`,
      [req.user.id, productId]
    );
    if (!result.rows.length) return res.status(409).json({ message: 'Already in favourites' });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// DELETE /favourites/:id -> :id is productId
async function removeFavourite(req, res) {
  const productId = req.params.id;
  const result = await pool.query(
    `DELETE FROM favourite_products WHERE user_id = $1 AND product_id = $2 RETURNING id`,
    [req.user.id, productId]
  );
  if (!result.rows.length) return res.status(404).json({ message: 'Favourite not found' });
  res.json({ message: 'Deleted' });
}

module.exports = { getFavourites, addFavourite, removeFavourite };