import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { loginUser, registerUser, getProfile } from '../services/authService';
import { LS_TOKEN, LS_USER } from '../utils/constants';
import { getLS, setLS, removeLS } from '../utils/helpers';

// ── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  user:       getLS(LS_USER) || null,
  token:      getLS(LS_TOKEN) || null,
  loading:    false,
  authChecked: false,
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user:        action.payload.user,
        token:       action.payload.token,
        loading:     false,
        authChecked: true,
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':
      return { ...initialState, user: null, token: null, authChecked: true };
    case 'AUTH_CHECKED':
      return { ...state, authChecked: true, loading: false };
    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Verify stored token on mount
  useEffect(() => {
    const verify = async () => {
      const token = getLS(LS_TOKEN);
      if (!token) { dispatch({ type: 'AUTH_CHECKED' }); return; }
      try {
        const data = await getProfile();
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: data.user, token } });
        setLS(LS_USER, data.user);
      } catch {
        removeLS(LS_TOKEN);
        removeLS(LS_USER);
        dispatch({ type: 'LOGOUT' });
      }
    };
    verify();
  }, []);

  // ── Auth actions ─────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await loginUser(credentials);
      setLS(LS_TOKEN, data.token);
      setLS(LS_USER,  data.user);
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true, role: data.user.role };
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  const register = useCallback(async (payload) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await registerUser(payload);
      setLS(LS_TOKEN, data.token);
      setLS(LS_USER,  data.user);
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      return { success: true, role: data.user.role };
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  const logout = useCallback(() => {
    removeLS(LS_TOKEN);
    removeLS(LS_USER);
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully.');
  }, []);

  const updateUser = useCallback((updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    setLS(LS_USER, { ...state.user, ...updates });
  }, [state.user]);

  return (
    <AppContext.Provider value={{
      user:        state.user,
      token:       state.token,
      loading:     state.loading,
      authChecked: state.authChecked,
      isLoggedIn:  !!state.user,
      isAdmin:     state.user?.role === 'admin',
      isOwner:     state.user?.role === 'owner',
      isFarmer:    state.user?.role === 'farmer',
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
