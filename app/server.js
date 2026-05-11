import express from 'express';
import {ApolloServer} from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import dotenv from 'dotenv';

import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import context from './context.js';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    playground: true
  });
  
  await server.start();

    // Middleware de Apollo con contexto personalizado
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Extraer token del header
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        
        // Contexto vulnerable: no validamos el token correctamente
        // Permitimos tokens vacíos o inválidos para pruebas
        let usuario = null;
        if (token) {
          try {
            const jwt = await import('jsonwebtoken');
            usuario = jwt.verify(token, process.env.JWT_SECRET);
          } catch (error) {
            // VULNERABILIDAD: No rechazamos el request, solo logueamos
            console.log(`Token inválido: ${error.message}`);
          }
        }
        
        return { usuario, req };
      }
    })
  );
  
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', api: 'GraphQL', port: process.env.PORT });
  });
  
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL API en http://localhost:${PORT}/graphql`);
  });
}

startServer();