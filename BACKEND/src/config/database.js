const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'districarnes',
  waitForConnections: true,
  connectionLimit: 10
});

async function checkConnection() {
  const [rows] = await pool.query(
    'SELECT DATABASE() AS database_name, VERSION() AS mysql_version'
  );
  return rows[0];
}

pool.checkConnection = checkConnection;

module.exports = pool;
