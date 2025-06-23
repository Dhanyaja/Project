import axios from 'axios';
import jwt from "jsonwebtoken"

const API_BASE_URL = 'http://localhost:4000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        if (this.token && this.isTokenValid()) {
          config.headers.Authorization = `Bearer ${this.token}`;
        } else if (this.token && !this.isTokenValid()) {
          this.removeToken();
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('API request failed:', error);
        if (error.response?.status === 401) {
          this.removeToken();
          window.location.reload();
        }
        if (error.response) {
          throw new Error(error.response.data.message || 'Something went wrong');
        } else if (error.request) {
          throw new Error('No response from server');
        } else {
          throw new Error('Request failed');
        }
      }
    );
  }

  isTokenValid() {
    if (!this.token) return false;
    try {
      const decoded = jwt(this.token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp > currentTime : false;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  getUserFromToken() {
    if (!this.token || !this.isTokenValid()) return null;
    try {
      const decoded = jwtDecode(this.token);
      return {
        id: decoded.id || decoded.userId,
        name: decoded.name,
        email: decoded.email,
        studyStreak: decoded.studyStreak || 0,
        totalCardsStudied: decoded.totalCardsStudied || 0
      };
    } catch (error) {
      console.error('Error extracting user from token:', error);
      return null;
    }
  }

  getTokenExpiration() {
    if (!this.token) return null;
    try {
      const decoded = jwtDecode(this.token);
      if (decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
    } catch (error) {
      console.error('Error getting token expiration:', error);
    }
    return null;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    const userInfo = this.getUserFromToken();
    if (userInfo) {
      localStorage.setItem('srs_user', JSON.stringify(userInfo));
    }
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('srs_user');
  }

  async register(userData) {
    const response = await this.client.post('/auth/register', userData);
    if (response.success) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.client.post('/auth/login', credentials);
    if (response.success) {
      this.setToken(response.token);
    }
    return response;
  }

  async getProfile() {
    return this.client.get('/auth/profile');
  }

  async getDecks() {
    return this.client.get('/decks');
  }

  async createDeck(deckData) {
    return this.client.post('/decks', deckData);
  }

  async updateDeck(id, updates) {
    return this.client.put(`/decks/${id}`, updates);
  }

  async deleteDeck(id) {
    return this.client.delete(`/decks/${id}`);
  }

  async getDeckStats() {
    return this.client.get('/decks/stats');
  }

  async getCards(deckId) {
    return this.client.get(`/cards/deck/${deckId}`);
  }

  async createCard(deckData) {
    return this.client.post(`/cards/deck/${deckData.deckId}`, {
      front: deckData.question,
      back: deckData.answer,
      difficulty: deckData.difficulty || 'medium'
    });
  }

  async updateCard(id, updates) {
    return this.client.put(`/cards/${id}`, updates);
  }

  async deleteCard(id) {
    return this.client.delete(`/cards/${id}`);
  }

  async getDueCards() {
    return this.client.get('/cards/due');
  }

  async reviewCard(cardId, reviewData) {
    return this.client.post(`/study/review/${cardId}`, reviewData);
  }

  async getStudyStats(timeframe = '7d') {
    return this.client.get(`/study/stats?timeframe=${timeframe}`);
  }
}

export const apiClient = new ApiClient();
