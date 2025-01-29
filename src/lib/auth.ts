import { adminSchema } from './types';

const DEFAULT_PASSWORD = 'admin123456'; // For testing purposes

export function validateAdminPassword(password: string): boolean {
  try {
    adminSchema.parse({ password });
    return password === DEFAULT_PASSWORD;
  } catch {
    return false;
  }
}

export function getIsAuthenticated(): boolean {
  return sessionStorage.getItem('isAuthenticated') === 'true';
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem('isAuthenticated', 'true');
  } else {
    sessionStorage.removeItem('isAuthenticated');
  }
}