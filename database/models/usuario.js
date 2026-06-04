import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(20),
      defaultValue: 'cliente',
      validate: {
        isIn: [['cliente', 'admin', 'empleado']]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password_hash) {
          const salt = await bcrypt.genSalt(14);
          usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
        }
      }
    }
  });

  Usuario.prototype.validarPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  return Usuario;
};