const pool = require('../db');

async function getCategories(req, res) {
  const result = await pool.query('SELECT * FROM categories ORDER BY id');
  res.json(result.rows);
}

async function createCategory(req, res) {
  const { categoryName } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO categories (category_name) VALUES ($1) RETURNING *`,
      [categoryName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Category already exists' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { categoryName } = req.body;
  if (!categoryName) return res.status(400).json({ message: 'categoryName is required' });

  const result = await pool.query(
    `UPDATE categories SET category_name = $1 WHERE id = $2 RETURNING *`,
    [categoryName, id]
  );
  if (!result.rows.length) return res.status(404).json({ message: 'Category not found' });
  res.json(result.rows[0]);
}

async function deleteCategory(req, res) {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
  if (!result.rows.length) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };