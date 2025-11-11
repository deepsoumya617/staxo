import jwt from 'jsonwebtoken'
import { env } from '@config/env'
import crypto from 'node:crypto'

export function generateToken(payload: object): string {
  return jwt.sign(payload, env.JWT_SECRET_KEY!, {
    expiresIn: '15m',
  })
}

export function verifyToken<T>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET_KEY!) as T
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}
