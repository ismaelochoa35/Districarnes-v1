const pool = require('../config/database');

async function findAll({ search = '', categoryId = null, lowStock = false }) {
  const searchTerm = `%${search}%`;
  const [rows] = await pool.execute(
    `SELECT p.id, p.nombre, p.tipo_corte, p.categoria_id,
            c.nombre AS categoria, p.precio, p.stock, p.unidad_medida,
            p.activo, p.imagen_url
     FROM productos p
     INNER JOIN categorias c ON c.id = p.categoria_id
     WHERE (p.nombre LIKE ? OR p.tipo_corte LIKE ?)
       AND (? IS NULL OR p.categoria_id = ?)
       AND (? = FALSE OR p.stock <= 10)
     ORDER BY p.nombre`,
    [searchTerm, searchTerm, categoryId, categoryId, lowStock]
  );
  return rows;
}

async function create(product) {
  const [result] = await pool.execute(
    `INSERT INTO productos
       (nombre, tipo_corte, categoria_id, unidad_medida, precio, stock, activo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      product.nombre,
      product.tipo_corte,
      product.categoria_id,
      product.unidad_medida,
      product.precio,
      product.stock,
      product.activo
    ]
  );
  return result.insertId;
}

async function update(id, product) {
  const [result] = await pool.execute(
    `UPDATE productos
     SET nombre = ?, tipo_corte = ?, categoria_id = ?, unidad_medida = ?,
         precio = ?, stock = ?, activo = ?
     WHERE id = ?`,
    [
      product.nombre,
      product.tipo_corte,
      product.categoria_id,
      product.unidad_medida,
      product.precio,
      product.stock,
      product.activo,
      id
    ]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { findAll, create, update, remove };
