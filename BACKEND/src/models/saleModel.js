const pool = require('../config/database');
const { convertToBaseQuantity } = require('../services/measurementService');

async function findAll({ date = null, categoryId = null } = {}) {
  const categoryCondition = categoryId ? 'AND p.categoria_id = ?' : '';
  const parameters = [date, date];
  if (categoryId) parameters.push(categoryId);
  const [rows] = await pool.execute(
    `SELECT v.id, v.fecha, v.total, v.estado,
            v.cliente_nombre AS cliente,
            v.metodo_pago, v.monto_recibido, v.cambio,
            a.nombre AS atendido_por, COUNT(d.id) AS items,
            COALESCE(SUM(d.subtotal), 0) AS total_filtrado
     FROM ventas v
     LEFT JOIN administradores a ON a.id = v.administrador_id
     LEFT JOIN detalle_venta d ON d.venta_id = v.id
     LEFT JOIN productos p ON p.id = d.producto_id
     WHERE (? IS NULL OR DATE(v.fecha) = ?)
       AND v.estado = 'completada'
       ${categoryCondition}
     GROUP BY v.id, v.fecha, v.total, v.estado, v.cliente_nombre,
              v.metodo_pago, v.monto_recibido, v.cambio, a.nombre
     ORDER BY v.fecha DESC`,
    parameters
  );
  return rows;
}

async function findDailyCategorySummary(date = null) {
  const [rows] = await pool.execute(
    `SELECT c.id, c.nombre,
            COALESCE(SUM(
              CASE WHEN DATE(v.fecha) = COALESCE(?, CURDATE())
                     AND v.estado = 'completada'
                   THEN d.subtotal ELSE 0 END
            ), 0) AS total_vendido,
            COALESCE(SUM(
              CASE WHEN DATE(v.fecha) = COALESCE(?, CURDATE())
                     AND v.estado = 'completada'
                   THEN d.cantidad ELSE 0 END
            ), 0) AS unidades_vendidas
     FROM categorias c
     LEFT JOIN productos p ON p.categoria_id = c.id
     LEFT JOIN detalle_venta d ON d.producto_id = p.id
     LEFT JOIN ventas v ON v.id = d.venta_id
     GROUP BY c.id, c.nombre
     ORDER BY c.nombre`,
    [date, date]
  );
  return rows;
}

async function findById(id) {
  const [sales] = await pool.execute(
    `SELECT v.id, v.fecha, v.total, v.estado,
            v.cliente_nombre AS cliente,
            v.metodo_pago, v.monto_recibido, v.cambio,
            a.nombre AS atendido_por
     FROM ventas v
     LEFT JOIN administradores a ON a.id = v.administrador_id
     WHERE v.id = ?`,
    [id]
  );
  if (!sales.length) return null;

  const [items] = await pool.execute(
    `SELECT d.producto_id, p.nombre, p.categoria_id, p.unidad_medida,
            c.nombre AS categoria, d.cantidad, d.precio_unitario, d.subtotal
     FROM detalle_venta d
     INNER JOIN productos p ON p.id = d.producto_id
     INNER JOIN categorias c ON c.id = p.categoria_id
     WHERE d.venta_id = ?
     ORDER BY d.id`,
    [id]
  );
  return { ...sales[0], items };
}

async function create({ items, clienteNombre, metodoPago, montoRecibido, administradorId }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const [rows] = await connection.execute(
        `SELECT id, precio, stock, unidad_medida
         FROM productos
         WHERE id = ? AND activo = TRUE
         FOR UPDATE`,
        [item.producto_id]
      );
      const product = rows[0];
      const requestedQuantity = Number(item.cantidad);
      const saleUnit = item.unidad_venta || product?.unidad_medida;
      const quantity = product
        ? convertToBaseQuantity(requestedQuantity, saleUnit, product.unidad_medida)
        : NaN;

      if (!product || !Number.isFinite(quantity) || quantity <= 0 || Number(product.stock) < quantity) {
        const error = new Error('Producto no disponible o stock insuficiente');
        error.status = 400;
        throw error;
      }

      total = Number((total + Number(product.precio) * quantity).toFixed(2));
      validatedItems.push({ ...product, cantidad: quantity });
    }

    const received = metodoPago === 'efectivo' ? Number(montoRecibido) : total;
    if (!Number.isFinite(received) || received < total) {
      const error = new Error('El monto recibido no alcanza para completar la venta');
      error.status = 400;
      throw error;
    }
    const change = Number((received - total).toFixed(2));

    const [sale] = await connection.execute(
      `INSERT INTO ventas
       (administrador_id, cliente_nombre, metodo_pago, monto_recibido, cambio, total, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'completada')`,
      [administradorId, clienteNombre || 'Consumidor final', metodoPago, received, change, total]
    );

    for (const item of validatedItems) {
      await connection.execute(
        `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [sale.insertId, item.id, item.cantidad, item.precio]
      );
    }

    await connection.execute(
      "INSERT INTO movimientos (tipo, monto, venta_id) VALUES ('pago', ?, ?)",
      [total, sale.insertId]
    );

    await connection.commit();
    return { id: sale.insertId, total, monto_recibido: received, cambio: change };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { findAll, findDailyCategorySummary, findById, create };
