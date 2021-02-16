require('dotenv').config();
let db = process.env.NODE_ENV === 'test' ? process.env.DB_TEST  : process.env.DATABASE;

module.exports = {
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: db,
  host: process.env.HOST,
  dialect: 'postgres',
  operatorsAliases: 0,
  logging: false,
}
