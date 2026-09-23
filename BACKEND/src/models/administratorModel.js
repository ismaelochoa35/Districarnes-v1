const pool = require('../config/database');

async function findActiveByCredentials(email, password) {
  const [rows] = await pool.execute(
    `SELECT id, nombre, email
     FROM administradores
     WHERE email = ?
       AND password_hash = SHA2(?, 256)
       AND activo = TRUE`,
    [email, password]
  );
  return rows[0] || null;
}

async function findAll() {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, activo, fecha_creacion
     FROM administradores
     ORDER BY activo DESC, nombre`
  );
  return rows;
}

async function create({ nombre, email, password }) {
  const [result] = await pool.execute(
    `INSERT INTO administradores (nombre, email, password_hash, activo)
     VALUES (?, ?, SHA2(?, 256), TRUE)`,
    [nombre, email, password]
  );
  return result.insertId;
}

async function setStatus(id, activo) {
  const [result] = await pool.execute(
    'UPDATE administradores SET activo = ? WHERE id = ?',
    [activo, id]
  );
  return result.affectedRows;
}

module.exports = { findActiveByCredentials, findAll, create, setStatus };
