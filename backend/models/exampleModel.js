const db = require('../config/database');

// Example model functions using promise-based pool
const findAll = async () => {
  const [rows] = await db.promise.query('SELECT * FROM examples');
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.promise.query('SELECT * FROM examples WHERE id = ?', [id]);
  return rows[0];
};

const create = async (data) => {
  const { name, description } = data;
  const [result] = await db.promise.query(
    'INSERT INTO examples (name, description) VALUES (?, ?)',
    [name, description]
  );
  return { id: result.insertId, ...data };
};

const update = async (id, data) => {
  const { name, description } = data;
  await db.promise.query(
    'UPDATE examples SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );
  return { id, ...data };
};

const deleteItem = async (id) => {
  await db.promise.query('DELETE FROM examples WHERE id = ?', [id]);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: deleteItem
};

