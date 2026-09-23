const administratorModel = require('../models/administratorModel');

async function list(req, res, next) {
  try {
    res.json(await administratorModel.findAll());
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const nombre = req.body.nombre?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!nombre || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Nombre, correo y una contraseña de 6 caracteres son obligatorios' });
    }

    const id = await administratorModel.create({ nombre, email, password });
    res.status(201).json({ id, message: 'Administrador creado' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un administrador con ese correo' });
    }
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0 || typeof req.body.activo !== 'boolean') {
      return res.status(400).json({ message: 'Los datos del administrador no son válidos' });
    }
    if (id === req.user.id && !req.body.activo) {
      return res.status(400).json({ message: 'No puedes desactivar tu propia cuenta mientras estás conectado' });
    }

    const affectedRows = await administratorModel.setStatus(id, req.body.activo);
    if (!affectedRows) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.json({ message: req.body.activo ? 'Administrador activado' : 'Administrador desactivado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, updateStatus };
