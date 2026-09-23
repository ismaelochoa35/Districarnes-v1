const productModel = require('../models/productModel');

function parseProduct(body) {
  return {
    nombre: body.nombre?.trim(),
    tipo_corte: body.tipo_corte?.trim() || null,
    categoria_id: Number(body.categoria_id),
    unidad_medida: body.unidad_medida,
    precio: Number(body.precio),
    stock: Number(body.stock),
    activo: body.activo ?? true
  };
}

function validateProduct(product) {
  return Boolean(product.nombre)
    && Number.isInteger(product.categoria_id)
    && product.categoria_id > 0
    && ['kg', 'lb', 'unidad'].includes(product.unidad_medida)
    && Number.isFinite(product.precio)
    && product.precio > 0
    && Number.isFinite(product.stock)
    && product.stock >= 0;
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function list(req, res, next) {
  try {
    const filters = {
      search: req.query.buscar || '',
      categoryId: Number(req.query.categoria) || null,
      lowStock: req.query.stockBajo === 'true'
    };
    res.json(await productModel.findAll(filters));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const product = parseProduct(req.body);
    if (!validateProduct(product)) {
      return res.status(400).json({ message: 'Los datos del producto no son válidos' });
    }

    const id = await productModel.create(product);
    res.status(201).json({ id, message: 'Producto creado' });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const product = parseProduct(req.body);
    if (!id || !validateProduct(product)) {
      return res.status(400).json({ message: 'Los datos del producto no son válidos' });
    }

    const affectedRows = await productModel.update(id, product);
    if (!affectedRows) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'El producto solicitado no es válido' });
    }

    const affectedRows = await productModel.remove(id);
    if (!affectedRows) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, update, remove };
