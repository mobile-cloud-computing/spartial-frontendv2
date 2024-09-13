import { OktaAuthIdxOptions } from '@okta/okta-auth-js';

// Configuration object for Okta using OktaAuthIdxOptions
export const oktaConfig: OktaAuthIdxOptions = {
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID || '',
    issuer: process.env.REACT_APP_OKTA_ISSUER || '',
    redirectUri: `${window.location.origin}/login/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    devMode: true
};