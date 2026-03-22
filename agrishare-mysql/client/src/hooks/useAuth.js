import { useApp as useBaseApp } from '../context/AppContext';

/**
 * Named export 'useApp' to satisfy Vite/esbuild resolution in ProfilePage.jsx
 */
export const useApp = () => {
  const context = useBaseApp();
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

/**
 * Convenience hook for auth state + actions
 */
export const useAuth = () => {
  return useApp();
};

export default useAuth;