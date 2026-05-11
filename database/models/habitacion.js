export default (sequelize, DataTypes) => {
  const Habitacion = sequelize.define('Habitacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    precio_noche: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'habitaciones',
    timestamps: false
  });

  return Habitacion;
};