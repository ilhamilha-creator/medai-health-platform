/**
 * Service JWT pour l'authentification avec refresh tokens
 * Gère la création, la validation et le rafraîchissement des tokens
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || 'your-secret-key-change-in-production';
const REFRESH_SECRET = process.env.REACT_APP_REFRESH_SECRET || 'your-refresh-secret-change-in-production-2024';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

class JWTService {
  /**
   * Génère un access token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  /**
   * Génère un refresh token
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  /**
   * Vérifie un access token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  /**
   * Vérifie un refresh token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }

  /**
   * Rafraîchit un access token en utilisant un refresh token
   */
  refreshAccessToken(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Refresh token invalide ou expiré');
    }

    // Générer un nouvel access token
    const newAccessToken = this.generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken, // Conserver le même refresh token
    };
  }

  /**
   * Décode un token sans vérifier la signature (pour lecture uniquement)
   */
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  /**
   * Vérifie si un token est expiré
   */
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    
    const now = Date.now() / 1000;
    return decoded.exp < now;
  }

  /**
   * Sauvegarde les tokens dans localStorage
   */
  saveTokens(accessToken, refreshToken) {
    localStorage.setItem('medai_access_token', accessToken);
    localStorage.setItem('medai_refresh_token', refreshToken);
  }

  /**
   * Récupère l'access token depuis localStorage
   */
  getAccessToken() {
    return localStorage.getItem('medai_access_token');
  }

  /**
   * Récupère le refresh token depuis localStorage
   */
  getRefreshToken() {
    return localStorage.getItem('medai_refresh_token');
  }

  /**
   * Supprime les tokens de localStorage
   */
  clearTokens() {
    localStorage.removeItem('medai_access_token');
    localStorage.removeItem('medai_refresh_token');
  }

  /**
   * Récupère l'utilisateur depuis le token
   */
  getUserFromToken() {
    const token = this.getAccessToken();
    if (!token) return null;

    const decoded = this.verifyAccessToken(token);
    if (!decoded) return null;

    return {
      id: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };
  }
}

const jwtService = new JWTService();
export default jwtService;
