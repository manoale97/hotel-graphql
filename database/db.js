import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import usuarioModel from './models/usuario.js';
import habitacionModel from './models/habitacion.js';
import reservaModel from './models/reserva.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const Usuario = usuarioModel(sequelize, DataTypes);
const Habitacion = habitacionModel(sequelize, DataTypes);
const Reserva = reservaModel(sequelize, DataTypes);


export { sequelize, Usuario, Habitacion, Reserva };