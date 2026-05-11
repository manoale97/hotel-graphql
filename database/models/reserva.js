export default (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    habitacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        fechaValida(value) {
          if (value <= this.fecha_inicio) {
            throw new Error('fecha_fin debe ser posterior a fecha_inicio');
          }
        }
      }
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'activa',
      validate: {
        isIn: [['activa', 'cancelada', 'completada']]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reservas',
    timestamps: false
  });

  return Reserva;
};