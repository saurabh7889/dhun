/* ==========================================================================
   DHUN — API Client (Supabase + Music API ready)
   ========================================================================== */

import { authStore } from '../store/index.js';
import { storage } from '../utils/format.js';

const API_BASE = import.meta.env.VITE_API_URL || '';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/** Custom fetch wrapper with auth interceptors */
class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
    this.supabaseUrl = SUPABASE_URL;
    this.supabaseKey = SUPABASE_ANON_KEY;
    this.interceptors = [];
  }

  /** Add request interceptor */
  use(interceptor) {
    this.interceptors.push(interceptor);
  }

  /** Get auth headers */
  getAuthHeaders() {
    const { token } = authStore.get();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (this.supabaseKey) headers['apikey'] = this.supabaseKey;
    return headers;
  }

  /** Core request method */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
      headers: { ...this.getAuthHeaders(), ...options.headers }
    };

    // Run interceptors
    for (const interceptor of this.interceptors) {
      await interceptor(config);
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 - token expired
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry with new token
          config.headers = this.getAuthHeaders();
          return fetch(url, config);
        } else {
          // Refresh failed, logout
          authStore.set({ user: null, token: null, isAuthenticated: false, error: 'Session expired' });
          throw new Error('Authentication required');
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) return null;

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  /** Refresh access token */
  async refreshToken() {
    const { refreshToken } = authStore.get();
    if (!refreshToken || !this.supabaseUrl) return false;

    try {
      const response = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.supabaseKey
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        authStore.set({
          token: data.access_token,
          refreshToken: data.refresh_token,
          user: data.user
        });
        return true;
      }
    } catch (e) {
      console.error('Token refresh failed:', e);
    }
    return false;
  }

  // HTTP methods
  get(endpoint, params) {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) });
  }

  put(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  }

  patch(endpoint, data) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(data) });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

/** ===========================
    AUTH API
    =========================== */
export const authApi = {
  /** Sign up with email/password */
  async signup(email, password, displayName) {
    if (!api.supabaseUrl) {
      // Local demo mode when Supabase is not configured
      const users = JSON.parse(localStorage.getItem('dhun_local_users') || '{}');
      if (users[email]) {
        throw new Error('An account with this email already exists.');
      }
      const user = {
        id: 'usr_' + Math.random().toString(36).slice(2, 9),
        email,
        user_metadata: {
          display_name: displayName || email.split('@')[0],
          name: displayName || email.split('@')[0]
        }
      };
      users[email] = { user, password };
      localStorage.setItem('dhun_local_users', JSON.stringify(users));
      const token = 'demo_token_' + Date.now();
      authStore.set({
        user,
        token,
        refreshToken: 'demo_refresh_' + Date.now(),
        isAuthenticated: true
      });
      return { user, session: { access_token: token } };
    }

    const response = await fetch(`${api.supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': api.supabaseKey
      },
      body: JSON.stringify({ email, password, data: { display_name: displayName } })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Signup failed');

    // Store session
    authStore.set({
      user: data.user,
      token: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      isAuthenticated: !!data.session
    });
    return data;
  },

  /** Sign in with email/password */
  async login(email, password) {
    if (!api.supabaseUrl) {
      // Local demo mode
      const users = JSON.parse(localStorage.getItem('dhun_local_users') || '{}');
      let account = users[email];
      if (!account) {
        // Auto-register on first sign in in demo mode
        const user = {
          id: 'usr_' + Math.random().toString(36).slice(2, 9),
          email,
          user_metadata: {
            display_name: email.split('@')[0],
            name: email.split('@')[0]
          }
        };
        account = { user, password };
        users[email] = account;
        localStorage.setItem('dhun_local_users', JSON.stringify(users));
      } else if (account.password && account.password !== password) {
        throw new Error('Invalid password. Please check your credentials.');
      }

      const token = 'demo_token_' + Date.now();
      authStore.set({
        user: account.user,
        token,
        refreshToken: 'demo_refresh_' + Date.now(),
        isAuthenticated: true
      });
      return { user: account.user, access_token: token };
    }

    const response = await fetch(`${api.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': api.supabaseKey
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Invalid credentials');

    authStore.set({
      user: data.user,
      token: data.access_token,
      refreshToken: data.refresh_token,
      isAuthenticated: true
    });
    return data;
  },

  /** Sign in with Google OAuth */
  async loginWithGoogle() {
    if (!api.supabaseUrl) {
      // Local demo Google login
      const user = {
        id: 'goog_' + Math.random().toString(36).slice(2, 9),
        email: 'listener@dhun.local',
        user_metadata: {
          display_name: 'Dhun Explorer',
          avatar_url: ''
        }
      };
      const token = 'goog_demo_' + Date.now();
      authStore.set({
        user,
        token,
        refreshToken: 'goog_refresh_' + Date.now(),
        isAuthenticated: true
      });
      return { user, access_token: token };
    }

    const redirectTo = `${window.location.origin}/auth/callback`;
    const url = `${api.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    window.location.href = url;
  },

  /** Handle OAuth callback */
  async handleOAuthCallback(hash) {
    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken) throw new Error('No access token in callback');

    // Get user info
    const response = await fetch(`${api.supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': api.supabaseKey
      }
    });

    const user = await response.json();
    if (!response.ok) throw new Error(user.message || 'Failed to get user');

    authStore.set({ user, token: accessToken, refreshToken, isAuthenticated: true });
    return { user, accessToken, refreshToken };
  },

  /** Sign out */
  async logout() {
    if (api.supabaseUrl && authStore.get().token) {
      await fetch(`${api.supabaseUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: api.getAuthHeaders()
      }).catch(() => {});
    }
    authStore.set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },

  /** Reset password */
  async resetPassword(email) {
    if (!api.supabaseUrl) {
      return { message: 'Reset email simulated (Demo mode)' };
    }

    const response = await fetch(`${api.supabaseUrl}/auth/v1/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': api.supabaseKey },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send reset email');
    return data;
  },

  /** Update password */
  async updatePassword(newPassword) {
    if (!api.supabaseUrl) throw new Error('Supabase not configured');

    const response = await fetch(`${api.supabaseUrl}/auth/v1/user`, {
      method: 'PUT',
      headers: api.getAuthHeaders(),
      body: JSON.stringify({ password: newPassword })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update password');
    return data;
  },

  /** Get current session */
  async getSession() {
    if (!api.supabaseUrl) return null;

    const response = await fetch(`${api.supabaseUrl}/auth/v1/user`, {
      headers: api.getAuthHeaders()
    });

    if (response.ok) {
      const user = await response.json();
      authStore.set({ user, isAuthenticated: true });
      return user;
    }
    return null;
  }
};

/** ===========================
    USER PROFILE API
    =========================== */
export const userApi = {
  /** Get user profile */
  async getProfile(userId) {
    return api.get(`/users/${userId}`);
  },

  /** Update profile */
  async updateProfile(userId, data) {
    return api.patch(`/users/${userId}`, data);
  },

  /** Upload avatar */
  async uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.request(`/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    });
  },

  /** Delete account */
  async deleteAccount(userId) {
    return api.delete(`/users/${userId}`);
  }
};

/** ===========================
    PLAYLIST API
    =========================== */
export const playlistApi = {
  /** Get user playlists */
  async getPlaylists(userId) {
    return api.get(`/users/${userId}/playlists`);
  },

  /** Get playlist by ID */
  async getPlaylist(playlistId) {
    return api.get(`/playlists/${playlistId}`);
  },

  /** Create playlist */
  async createPlaylist(userId, data) {
    return api.post(`/users/${userId}/playlists`, data);
  },

  /** Update playlist */
  async updatePlaylist(playlistId, data) {
    return api.patch(`/playlists/${playlistId}`, data);
  },

  /** Delete playlist */
  async deletePlaylist(playlistId) {
    return api.delete(`/playlists/${playlistId}`);
  },

  /** Add tracks to playlist */
  async addTracks(playlistId, trackIds) {
    return api.post(`/playlists/${playlistId}/tracks`, { track_ids: trackIds });
  },

  /** Remove track from playlist */
  async removeTrack(playlistId, trackId) {
    return api.delete(`/playlists/${playlistId}/tracks/${trackId}`);
  },

  /** Reorder tracks */
  async reorderTracks(playlistId, trackIds) {
    return api.put(`/playlists/${playlistId}/tracks`, { track_ids: trackIds });
  },

  /** Get editorial playlists */
  async getEditorialPlaylists() {
    return api.get('/playlists/editorial');
  }
};

/** ===========================
    MUSIC API (Supabase + External)
    =========================== */
export const musicApi = {
  /** Search tracks, artists, albums */
  async search(query, options = {}) {
    const params = { q: query, ...options };
    return api.get('/music/search', params);
  },

  /** Get track by ID */
  async getTrack(trackId) {
    return api.get(`/music/tracks/${trackId}`);
  },

  /** Get album by ID */
  async getAlbum(albumId) {
    return api.get(`/music/albums/${albumId}`);
  },

  /** Get artist by ID */
  async getArtist(artistId) {
    return api.get(`/music/artists/${artistId}`);
  },

  /** Get artist top tracks */
  async getArtistTopTracks(artistId) {
    return api.get(`/music/artists/${artistId}/top-tracks`);
  },

  /** Get artist albums */
  async getArtistAlbums(artistId) {
    return api.get(`/music/artists/${artistId}/albums`);
  },

  /** Get album tracks */
  async getAlbumTracks(albumId) {
    return api.get(`/music/albums/${albumId}/tracks`);
  },

  /** Get playlist tracks */
  async getPlaylistTracks(playlistId) {
    return api.get(`/music/playlists/${playlistId}/tracks`);
  },

  /** Get new releases */
  async getNewReleases(options = {}) {
    return api.get('/music/new-releases', options);
  },

  /** Get charts */
  async getCharts(chartId) {
    return api.get(`/music/charts/${chartId}`);
  },

  /** Get recommendations */
  async getRecommendations(seedTracks, seedArtists, seedGenres) {
    return api.post('/music/recommendations', { seedTracks, seedArtists, seedGenres });
  },

  /** Get track audio features */
  async getAudioFeatures(trackId) {
    return api.get(`/music/tracks/${trackId}/audio-features`);
  },

  /** Get lyrics */
  async getLyrics(trackId) {
    return api.get(`/music/tracks/${trackId}/lyrics`);
  }
};

/** ===========================
    LIBRARY API (User data)
    =========================== */
export const libraryApi = {
  /** Get liked tracks */
  async getLikedTracks(userId) {
    return api.get(`/users/${userId}/liked-tracks`);
  },

  /** Like a track */
  async likeTrack(userId, trackId) {
    return api.post(`/users/${userId}/liked-tracks`, { track_id: trackId });
  },

  /** Unlike a track */
  async unlikeTrack(userId, trackId) {
    return api.delete(`/users/${userId}/liked-tracks/${trackId}`);
  },

  /** Get followed artists */
  async getFollowedArtists(userId) {
    return api.get(`/users/${userId}/followed-artists`);
  },

  /** Follow artist */
  async followArtist(userId, artistId) {
    return api.post(`/users/${userId}/followed-artists`, { artist_id: artistId });
  },

  /** Unfollow artist */
  async unfollowArtist(userId, artistId) {
    return api.delete(`/users/${userId}/followed-artists/${artistId}`);
  },

  /** Get saved albums */
  async getSavedAlbums(userId) {
    return api.get(`/users/${userId}/saved-albums`);
  },

  /** Save album */
  async saveAlbum(userId, albumId) {
    return api.post(`/users/${userId}/saved-albums`, { album_id: albumId });
  },

  /** Unsave album */
  async unsaveAlbum(userId, albumId) {
    return api.delete(`/users/${userId}/saved-albums/${albumId}`);
  },

  /** Get play history */
  async getHistory(userId, options = {}) {
    return api.get(`/users/${userId}/history`, options);
  },

  /** Add to history */
  async addToHistory(userId, data) {
    return api.post(`/users/${userId}/history`, data);
  },

  /** Get user preferences */
  async getPreferences(userId) {
    return api.get(`/users/${userId}/preferences`);
  },

  /** Update preferences */
  async updatePreferences(userId, data) {
    return api.patch(`/users/${userId}/preferences`, data);
  }
};

export default api;