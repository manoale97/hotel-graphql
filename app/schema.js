import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Usuario {
    id: ID!
    nombre: String!
    email: String!
    rol: String!
    reservas: [Reserva]
  }
  
  type Habitacion {
    id: ID!
    numero: String!
    tipo: String!
    precio_noche: Float!
    disponible: Boolean!
    reservas: [Reserva]
  }
  
  type Reserva {
    id: ID!
    usuario_id: Int!
    habitacion_id: Int!
    fecha_inicio: String!
    fecha_fin: String!
    estado: String!
    usuario: Usuario
    habitacion: Habitacion
  }
  
  type AuthPayload {
    token: String!
    usuario: Usuario!
  }
  
  type Query {
    habitaciones: [Habitacion]!
    habitacion(id: ID!): Habitacion
    misReservas: [Reserva]!
    reserva(id: ID!): Reserva
    todasReservas: [Reserva]!
    usuarios: [Usuario]!
  }
  
  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    crearReserva(habitacion_id: Int!, fecha_inicio: String!, fecha_fin: String!): Reserva!
    cancelarReserva(id: ID!): Reserva!
    cambiarRolUsuario(usuario_id: ID!, rol: String!): Usuario!
  }
`;

export default typeDefs;