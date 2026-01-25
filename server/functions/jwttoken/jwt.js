// server/auth/jwt.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get .env setup file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.join(__dirname, '../../.env')
});

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '59m';

export function generateAccessToken(userID, password, email)
{
    const payload = {
        userID,
        password,
        email
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

export function verifyAccessToken(token)
{
    if(!JWT_SECRET) throw new Error ("JWT_SECRET is not set");
    return jwt.verify(token, JWT_SECRET);
}
