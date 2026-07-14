const pool = require('../db');

async function getProducts(req, res) {
  const result = await pool.query(
    `SELECT p.id, p.name, p.price, p.category_id, c.category_name
     FROM products p LEFT JOIN categories c ON p.category_id = c.id
     ORDER BY p.id`
  );
  res.json(result.rows);
}

async function createProduct(req, res) {
  const { name, price, categoryId } = req.body;
  const result = await pool.query(
    `INSERT INTO products (name, price, category_id) VALUES ($1,$2,$3) RETURNING *`,
    [name, price, categoryId]
  );
  res.status(201).json(result.rows[0]);
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ message: 'No fields to update' });

  const colMap = { name: 'name', price: 'price', categoryId: 'category_id' };
  const setClauses = keys.map((k, i) => `${colMap[k]} = $${i + 1}`);
  const values = keys.map((k) => fields[k]);

  const result = await pool.query(
    `UPDATE products SET ${setClauses.join(', ')} WHERE id=$${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  if (!result.rows.length) return res.status(404).json({ message: 'Product not found' });
  res.json(result.rows[0]);
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [id]);
  if (!result.rows.length) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };