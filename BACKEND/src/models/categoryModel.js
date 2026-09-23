const pool = require('../config/database');

async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, nombre FROM categorias ORDER BY nombre'
  );
  return rows;
}

module.exports = { findAll };
