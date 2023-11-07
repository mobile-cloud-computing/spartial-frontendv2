import React from 'react';
import { useNavigate } from 'react-router-dom';

import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { oktaConfig } from './config/oktaConfig';

import './App.css';
import { Security } from "@okta/okta-react";
import Navbar from "./components/layout/Navbar";
import { Footer } from './components/layout/Footer';
import AppRoutes from "./routes/AppRoutes";


// interface Token {
//   accessToken: string;
//   idToken: string;
//   // ... any other token properties
// }

const App: React.FC = () => {
  const navigate = useNavigate();

  const oktaAuth = new OktaAuth(oktaConfig);

  const customAuthHandler = () => {
    navigate('/protected');
  };

  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };


  return (
      <div className="App">
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
          <Navbar />
          <AppRoutes />
          <Footer />
        </Security>
      </div>
  );
}

export default App;
