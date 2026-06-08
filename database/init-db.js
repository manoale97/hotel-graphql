import { sequelize, Usuario, Habitacion, Reserva } from './db.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

async function initDatabase() {
  faker.seed(12345);
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

// ==========================
// DATOS MASIVOS PARA TESIS
// ==========================

console.log('⏳ Generando datos de prueba...');

// Usuarios
const usuariosFaker = [];
const passwordHash = await bcrypt.hash('123456', 10);

for (let i = 0; i < 5000; i++) {
  usuariosFaker.push({
    nombre: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password_hash: passwordHash,
    rol: 'cliente'
  });
}

const usuariosCreados = await Usuario.bulkCreate(
  usuariosFaker,
  { returning: true
  }
);

console.log(`✅ ${usuariosCreados.length} usuarios creados`);


// Habitaciones
const habitacionesFaker = [];

for (let i = 0; i < 500; i++) {

  habitacionesFaker.push({
    numero: `${1000 + i}`,
    tipo: faker.helpers.arrayElement([
      'individual',
      'doble',
      'suite'
    ]),
    precio_noche: faker.number.float({
      min: 40,
      max: 250,
      fractionDigits: 2
    }),
    disponible: true
  });
}

const habitacionesCreadas = await Habitacion.bulkCreate(
  habitacionesFaker,
  { returning: true }
);

console.log(`✅ ${habitacionesCreadas.length} habitaciones creadas`);


// Reservas
const reservasFaker = [];

for (let i = 0; i < 50000; i++) {

  const fechaInicio = faker.date.between({
    from: '2026-01-01',
    to: '2026-12-01'
  });

  const fechaFin = new Date(fechaInicio);

  fechaFin.setDate(
    fechaFin.getDate() +
    faker.number.int({
      min: 1,
      max: 10
    })
  );

  reservasFaker.push({

    usuario_id:
      usuariosCreados[
        faker.number.int({
          min: 0,
          max: usuariosCreados.length - 1
        })
      ].id,

    habitacion_id:
      habitacionesCreadas[
        faker.number.int({
          min: 0,
          max: habitacionesCreadas.length - 1
        })
      ].id,

    fecha_inicio: fechaInicio,

    fecha_fin: fechaFin,

    estado: faker.helpers.arrayElement([
      'activa',
      'cancelada',
      'finalizada'
    ])
  });
}


// Insertar en bloques
const chunkSize = 5000;

for (let i = 0; i < reservasFaker.length; i += chunkSize) {

  const chunk = reservasFaker.slice(
    i,
    i + chunkSize
  );

  await Reserva.bulkCreate(chunk);

  console.log(
    `Reservas insertadas: ${
      Math.min(i + chunkSize, reservasFaker.length)
    }/${reservasFaker.length}`
  );
}

console.log(`✅ ${reservasFaker.length} reservas creadas`);

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error al inicializar:', error);
  }
}

initDatabase();