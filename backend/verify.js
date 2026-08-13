const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  console.log('--- ACHIEVEMENTS SCHEMA ---');
  const [aSchema] = await conn.query('DESCRIBE achievements');
  console.table(aSchema);
  console.log('--- USER_ACHIEVEMENTS SCHEMA ---');
  const [uaSchema] = await conn.query('DESCRIBE user_achievements');
  console.table(uaSchema);
  console.log('--- CONSTRAINTS / INDEXES ---');
  const [indexes] = await conn.query('SHOW INDEXES FROM user_achievements');
  console.table(indexes.filter(i => i.Key_name !== 'PRIMARY').map(i => ({Key_name: i.Key_name, Column_name: i.Column_name, Non_unique: i.Non_unique})));
  console.log('--- FOREIGN KEYS ---');
  const [fks] = await conn.query(`SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' AND TABLE_NAME = 'user_achievements' AND REFERENCED_TABLE_NAME IS NOT NULL`);
  console.table(fks);
  console.log('--- SEEDED ACHIEVEMENTS ---');
  const [data] = await conn.query('SELECT * FROM achievements');
  console.table(data);
  conn.end();
})();
