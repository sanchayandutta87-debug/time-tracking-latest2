import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Google OAuth Client ID for development
// For production, replace with your own from https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = '832445498015-j2kmhte1v2f1p5f6q3oj9t3vljjnqf3n.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
