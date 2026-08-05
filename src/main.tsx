import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ComingSoon from './components/ComingSoon';
import {AuthProvider} from './lib/auth/AuthContext';
import {BranchProvider} from './lib/branch/BranchContext';
import {UNDER_CONSTRUCTION} from './lib/config';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {UNDER_CONSTRUCTION ? (
      // Maintenance mode: a single themed landing page replaces the whole app.
      // Providers are skipped intentionally — no auth/branch/menu wiring is needed.
      <ComingSoon />
    ) : (
      <AuthProvider>
        <BranchProvider>
          <App />
        </BranchProvider>
      </AuthProvider>
    )}
  </StrictMode>,
);
