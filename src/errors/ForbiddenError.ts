import { AppError } from './AppError'

export class ForbiddenError extends AppError {
  constructor(message: string, details?: string[]) {
    super(message, 400, details)
  }
}
