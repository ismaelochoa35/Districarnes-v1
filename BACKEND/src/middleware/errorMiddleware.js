function notFound(req, res) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, _req, res, _next) {
  const databaseStatus = error.code === 'ER_ROW_IS_REFERENCED_2' ? 409 : null;
  const status = error.status || databaseStatus || 500;
  if (status === 500) console.error(error);
  const message = status === 500
    ? 'Ocurrió un error interno en el servidor'
    : error.message;
  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
