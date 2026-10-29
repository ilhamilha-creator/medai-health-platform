/**
 * Service d'authentification pour le nouveau backend Python
 * Gère la connexion, l'inscription et les tokens JWT
 */

const PYTHON_API_URL = 'http://localhost:8000';

class PythonAuthService {
  /**
   * Connecter un utilisateur avec le backend Python
   */
  async login(email, password) {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Sauvegarder le token
        localStorage.setItem('python_access_token', data.access_token);
        localStorage.setItem('python_user', JSON.stringify(data.user));
        return {
          success: true,
          user: data.user,
          token: data.access_token
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Erreur de connexion'
        };
      }
    } catch (error) {
      console.error('Python login error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur'
      };
    }
  }

  /**
   * Inscrire un nouvel utilisateur avec le backend Python
   */
  async register(email, password, name, userType) {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          user_type: userType
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          user: data.user
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Erreur d\'inscription'
        };
      }
    } catch (error) {
      console.error('Python register error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur'
      };
    }
  }

  /**
   * Déconnecter l'utilisateur
   */
  logout() {
    localStorage.removeItem('python_access_token');
    localStorage.removeItem('python_user');
  }

  /**
   * Récupérer le token actuel
   */
  getToken() {
    return localStorage.getItem('python_access_token');
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('python_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Appeler un outil médical
   */
  async callTool(toolName, userId, toolArgs) {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/tools/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool_name: toolName,
          user_id: userId,
          arguments: toolArgs
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.result;
      } else {
        console.error('Tool call error:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Tool call error:', error);
      return null;
    }
  }

  /**
   * Récupérer les outils disponibles
   */
  async getAvailableTools() {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/tools/available`);
      if (response.ok) {
        const data = await response.json();
        return data.tools;
      }
      return {};
    } catch (error) {
      console.error('Get tools error:', error);
      return {};
    }
  }

  /**
   * Rechercher dans la base de connaissances
   */
  async searchKnowledge(query, category = null) {
    try {
      let url = `${PYTHON_API_URL}/api/knowledge/search?query=${encodeURIComponent(query)}`;
      if (category) {
        url += `&category=${category}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.results;
      }
      return [];
    } catch (error) {
      console.error('Search knowledge error:', error);
      return [];
    }
  }
}

const pythonAuthService = new PythonAuthService();
export default pythonAuthService;
