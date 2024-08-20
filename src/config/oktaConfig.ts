
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const protocol = isLocalhost ? 'http' : 'https';

const redirectUri = `${protocol}://${window.location.hostname}:3000/login/callback`;

// Okta configuration object
export const oktaConfig = {
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID || '',
    issuer: process.env.REACT_APP_OKTA_ISSUER || '',
    redirectUri: redirectUri,
    scopes: (process.env.REACT_APP_OKTA_SCOPES || 'openid profile email').split(' '),  // Default scopes if not provided
    pkce: process.env.REACT_APP_OKTA_PKCE === 'true',
    disableHttpsCheck: process.env.REACT_APP_OKTA_DISABLE_HTTPS_CHECK === 'true',  // Only use this in dev environments
};
