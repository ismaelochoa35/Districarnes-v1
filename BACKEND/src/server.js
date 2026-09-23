require('dotenv').config();

const app = require('./app');
const database = require('./config/database');

const port = Number(process.env.PORT) || 3000;

function handleServerError(error) {
  const message = error.code === 'EADDRINUSE'
    ? `El puerto ${port} ya está ocupado. Cierra el servidor anterior antes de iniciar otro.`
    : `No fue posible iniciar el servidor: ${error.message}`;
  console.error(message);
  process.exit(1);
}

async function startServer() {
  try {
    const connection = await database.checkConnection();
    console.log(
      `MySQL conectado: base ${connection.database_name} (MySQL ${connection.mysql_version})`
    );

    const server = app.listen(port, () => {
      console.log(`Servidor disponible en http://localhost:${port}`);
    });
    server.on('error', handleServerError);
  } catch (error) {
    console.error('No fue posible conectar con MySQL. Revisa BACKEND/.env y que MySQL Server esté iniciado.');
    console.error(`${error.code || 'DB_ERROR'}: ${error.message}`);
    process.exit(1);
  }
}

startServer();
