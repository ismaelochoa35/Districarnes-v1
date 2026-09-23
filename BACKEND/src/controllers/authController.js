const administratorModel = require('../models/administratorModel');
const sessionService = require('../services/sessionService');

async function login(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    const administrator = await administratorModel.findActiveByCredentials(email, password);
    if (!administrator) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.json({ token: sessionService.create(administrator) });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  sessionService.remove(req.token);
  res.json({ message: 'Sesión cerrada' });
}

module.exports = { login, logout };
