import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function getUsuarioFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[0];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export default ({ req }) => {
  const usuario = getUsuarioFromToken(req);
  return { usuario };
};