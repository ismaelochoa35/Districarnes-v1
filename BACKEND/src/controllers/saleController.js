const saleModel = require('../models/saleModel');

async function list(req, res, next) {
  try {
    const date = parseDate(req.query.fecha);
    const categoryId = parseCategoryId(req.query.categoria);
    if (date === false || categoryId === false) {
      return res.status(400).json({ message: 'Los filtros de ventas no son válidos' });
    }
    res.json(await saleModel.findAll({ date, categoryId }));
  } catch (error) {
    next(error);
  }
}

function parseDate(value) {
  if (!value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : false;
}

function parseCategoryId(value) {
  if (!value) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : false;
}

async function dailyCategorySummary(req, res, next) {
  try {
    const date = parseDate(req.query.fecha);
    if (date === false) {
      return res.status(400).json({ message: 'La fecha del resumen no es válida' });
    }
    res.json(await saleModel.findDailyCategorySummary(date));
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'La venta solicitada no es válida' });
    }

    const sale = await saleModel.findById(id);
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(sale);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { items, cliente_nombre, metodo_pago = 'efectivo', monto_recibido } = req.body;
    const validItems = Array.isArray(items)
      && items.length > 0
      && items.every(item => Number.isInteger(Number(item.producto_id))
        && Number(item.producto_id) > 0
        && Number.isFinite(Number(item.cantidad))
        && Number(item.cantidad) > 0
        && (!item.unidad_venta || ['g', 'kg', 'lb', 'unidad'].includes(item.unidad_venta)));

    if (!validItems) {
      return res.status(400).json({ message: 'La venta debe tener productos' });
    }
    if (!['efectivo', 'tarjeta', 'transferencia'].includes(metodo_pago)) {
      return res.status(400).json({ message: 'Método de pago no válido' });
    }

    const sale = await saleModel.create({
      items,
      clienteNombre: cliente_nombre?.trim(),
      metodoPago: metodo_pago,
      montoRecibido: monto_recibido,
      administradorId: req.user.id
    });
    res.status(201).json({ ...sale, message: 'Venta registrada' });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, dailyCategorySummary, detail, create };
