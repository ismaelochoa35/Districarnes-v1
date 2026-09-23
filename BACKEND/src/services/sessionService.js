const crypto = require('crypto');

const sessions = new Map();

function create(administrator) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, {
    id: administrator.id,
    nombre: administrator.nombre,
    email: administrator.email
  });
  return token;
}

function find(token) {
  return sessions.get(token) || null;
}

function remove(token) {
  sessions.delete(token);
}

module.exports = { create, find, remove };
