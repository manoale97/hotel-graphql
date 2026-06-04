import { sequelize, Usuario, Habitacion, Reserva } from './db.js';

async function initDatabase() {
  try {
    // Sincronizar tablas (force: true borra y recrea)
    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas en MySQL (REST)');

    // Crear usuarios
    const admin = await Usuario.create({
      nombre: 'Admin',
      email: 'admin@hotel.com',
      password_hash: 'admin123',
      rol: 'admin'
    });

    const cliente1 = await Usuario.create({
      nombre: 'Juan Perez',
      email: 'juan@example.com',
      password_hash: 'cliente123',
      rol: 'cliente'
    });

    const cliente2 = await Usuario.create({
      nombre: 'Maria Lopez',
      email: 'maria@example.com',
      password_hash: 'maria123',
      rol: 'cliente'
    });

    const cliente3 = await Usuario.create({
      nombre: "Roberto",  // Usuario malicioso para pruebas
      email: "inject@test.com",
      password_hash: "test123",
      rol: 'cliente'
    });

    const empleado1 = await Usuario.create({
      nombre: "Victoria Gomez", 
      email: "victoriag@hotelAPI.com",
      password_hash: "victoria123",
      rol: 'empleado'
    });

    const empleado2 = await Usuario.create({
      nombre: "Juan Perez", 
      email: "juanp@hotelAPI.com",
      password_hash: "juanperez123",
      rol: 'empleado'
    });

    // Crear habitaciones
    const hab101 = await Habitacion.create({
      numero: '101',
      tipo: 'individual',
      precio_noche: 50.00,
      disponible: true
    });

    const hab202 = await Habitacion.create({
      numero: '202',
      tipo: 'doble',
      precio_noche: 85.00,
      disponible: true
    });

    const hab303 = await Habitacion.create({
      numero: '303',
      tipo: 'suite',
      precio_noche: 150.00,
      disponible: true
    });

    const hab404 = await Habitacion.create({
      numero: "404",
      tipo: 'vulnerable',
      precio_noche: 999.99,
      disponible: false
    });

    // Crear reservas
    await Reserva.create({
      usuario_id: cliente1.id,
      habitacion_id: hab101.id,
      fecha_inicio: '2026-05-10',
      fecha_fin: '2026-05-12',
      estado: 'activa'
    });

    await Reserva.create({
      usuario_id: cliente2.id,
      habitacion_id: hab202.id,
      fecha_inicio: '2026-05-15',
      fecha_fin: '2026-05-18',
      estado: 'activa'
    });

    await Reserva.create({
      usuario_id: cliente1.id,
      habitacion_id: hab303.id,
      fecha_inicio: '2026-06-01',
      fecha_fin: '2026-06-05',
      estado: 'cancelada'
    });

    console.log('✅ Datos insertados correctamente');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error al inicializar:', error);
  }
}

initDatabase();