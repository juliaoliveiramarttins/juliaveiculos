const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'server-bd-cn1.mysql.database.azure.com',
  user: 'useradmin',
  password: 'admin@123',
  database: 'juliaveiculos',
  ssl: {
    rejectUnauthorized: false 
  }
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao Azure MySQL:', err);
    return;
  }
  console.log('Conexão bem-sucedida com Azure MySQL!');
});

module.exports = db;
