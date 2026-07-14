const pool = require('../db');

// helper: verify the list belongs to req.user.id
async function assertListOwnership(listId, userId) {
  const result = await pool.query(
    `SELECT id FROM shopping_lists WHERE id = $1 AND user_id = $2`,
    [listId, userId]
  );
  return result.rows.length > 0;
}

// GET /listitems/:id/items -> :id is listId
async function getItems(req, res) {
  const listId = req.params.id;
  const owns = await assertListOwnership(listId, req.user.id);
  if (!owns) return res.status(404).json({ message: 'List not found' });

  const result = await pool.query(
    `SELECT li.id, li.list_id, li.product_id, li.is_purchased, li.quantity,
            p.name, p.price
     FROM list_items li
     JOIN products p ON li.product_id = p.id
     WHERE li.list_id = $1
     ORDER BY li.id`,
    [listId]
  );
  res.json(result.rows);
}

// POST /listitems/addItem/:id -> :id is listId
async function addItem(req, res) {
  const listId = req.params.id;
  const { productId, quantity } = req.body;

  const owns = await assertListOwnership(listId, req.user.id);
  if (!owns) return res.status(404).json({ message: 'List not found' });

  const result = await pool.query(
    `INSERT INTO list_items (list_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING *`,
    [listId, productId, quantity]
  );
  res.status(201).json(result.rows[0]);
}

// PATCH /listitems/:id -> :id is list_item id
async function updateItem(req, res) {
  const itemId = req.params.id;
  const { quantity, isPurchased } = req.body;

  // verify the item belongs (via its list) to this user
  const check = await pool.query(
    `SELECT li.id FROM list_items li
     JOIN shopping_lists sl ON li.list_id = sl.id
     WHERE li.id = $1 AND sl.user_id = $2`,
    [itemId, req.user.id]
  );
  if (!check.rows.length) return res.status(404).json({ message: 'Item not found' });

  const fields = [];
  const values = [];
  let i = 1;
  if (quantity !== undefined) { fields.push(`quantity = $${i++}`); values.push(quantity); }
  if (isPurchased !== undefined) { fields.push(`is_purchased = $${i++}`); values.push(isPurchased); }
  if (!fields.length) return res.status(400).json({ message: 'No fields to update' });

  values.push(itemId);
  const result = await pool.query(
    `UPDATE list_items SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  res.json(result.rows[0]);
}

// DELETE /listitems/:id
async function deleteItem(req, res) {
  const itemId = req.params.id;
  const result = await pool.query(
    `DELETE FROM list_items li
     USING shopping_lists sl
     WHERE li.id = $1 AND li.list_id = sl.id AND sl.user_id = $2
     RETURNING li.id`,
    [itemId, req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ message: 'Item not found' });
  res.json({ message: 'Deleted' });
}

module.exports = { getItems, addItem, updateItem, deleteItem };