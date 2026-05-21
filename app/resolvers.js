import jwt from 'jsonwebtoken';
import { Usuario, Habitacion, Reserva } from '../database/db.js';

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol, origen: 'GRAPHQL' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

const resolvers = {
  Query: {
    habitaciones: async () => await Habitacion.findAll(),
    habitacion: async (_, { id }) => await Habitacion.findByPk(id),
    
    misReservas: async (_, __, { usuario }) => {
      if (!usuario) throw new Error('No autenticado');
      return await Reserva.findAll({
        where: { usuario_id: usuario.id }
      });
    },
    
    // VULNERABLE A IDOR
    reserva: async (_, { id }, { usuario }) => {
      if (!usuario) throw new Error('No autenticado');
      return await Reserva.findByPk(id);
    },
    
    todasReservas: async (_, __, { usuario }) => {
      if (!usuario || usuario.rol !== 'admin') throw new Error('Acceso denegado');
      return await Reserva.findAll();
    },
    
    usuarios: async (_, __, { usuario }) => {
      if (!usuario || usuario.rol !== 'admin') throw new Error('Acceso denegado');
      return await Usuario.findAll({ attributes: { exclude: ['password_hash'] } });
    }
  },
  
  Mutation: {
    login: async (_, { email, password }) => {
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) throw new Error('Credenciales inválidas');
      
      const passwordValido = await usuario.validarPassword(password);
      if (!passwordValido) throw new Error('Credenciales inválidas');
      
      const token = generarToken(usuario);
      return { token, usuario };
    },
    
    crearReserva: async (_, { habitacion_id, fecha_inicio, fecha_fin }, { usuario }) => {
      if (!usuario) throw new Error('No autenticado');
      return await Reserva.create({
        usuario_id: usuario.id,
        habitacion_id,
        fecha_inicio,
        fecha_fin,
        estado: 'activa'
      });
    },
    
    // VULNERABLE A IDOR
    cancelarReserva: async (_, { id }, { usuario }) => {
      if (!usuario) throw new Error('No autenticado');
      const reserva = await Reserva.findByPk(id);
      if (!reserva) throw new Error('Reserva no encontrada');
      await reserva.update({ estado: 'cancelada' });
      return reserva;
    },
    
    cambiarRolUsuario: async (_, { usuario_id, rol }, { usuario }) => {
      if (!usuario || usuario.rol !== 'admin') throw new Error('Acceso denegado');
      const targetUser = await Usuario.findByPk(usuario_id);
      if (!targetUser) throw new Error('Usuario no encontrado');
      targetUser.rol = rol;
      await targetUser.save();
      return targetUser;
    }
  },
  
  Usuario: {
    reservas: async (parent) => await Reserva.findAll({ where: { usuario_id: parent.id } })
  },
  
  Habitacion: {
    reservas: async (parent) => await Reserva.findAll({ where: { habitacion_id: parent.id } })
  },
  
  Reserva: {
    usuario: async (parent) => await Usuario.findByPk(parent.usuario_id),
    habitacion: async (parent) => await Habitacion.findByPk(parent.habitacion_id)
  }
};

export default resolvers;