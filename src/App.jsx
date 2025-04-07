import React from 'react';
import { ClientAuthProvider } from './components/compulsory/client/contexts/ClientAuthContext';
import ClientPageRoutes from './components/compulsory/client/routes/ClientPageRoutes';

function App() {
  return (
    <>
      <ClientAuthProvider>
        <ClientPageRoutes />
      </ClientAuthProvider>
    </>
  );
}

export default App;
