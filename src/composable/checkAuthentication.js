import { decodeJwt } from '@/composable/jwt';

export async function isAuthenticated() {
  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = await decodeJwt(token);

    const isTokenExpired = decodedToken.exp < Date.now() / 1000;

    return !isTokenExpired; 
  }

  return false;
}