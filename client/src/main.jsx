import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import './index.css';
import store from './store/index.js';
import AppRouter from './routes/index.jsx';
import { fetchCurrentUser } from './features/auth/authSlice.js';

// Initialize auth on app load
function AppInit({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      // Mark as initialized even without a token
      dispatch({ type: 'auth/me/rejected', payload: null });
    }
  }, [dispatch]);
  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppInit>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#1e293b',
              color: '#f1f5f9',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AppInit>
    </Provider>
  </StrictMode>
);
