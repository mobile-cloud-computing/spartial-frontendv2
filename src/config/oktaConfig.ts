export const oktaConfig = {
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID || '',
    issuer: process.env.REACT_APP_OKTA_ISSUER || '',
    redirectUri: `${window.location.origin}/login/callback`,
    scopes: (process.env.REACT_APP_OKTA_SCOPES || 'openid profile email').split(' '),
    pkce: process.env.REACT_APP_OKTA_PKCE === 'true',
    disableHttpsCheck: process.env.REACT_APP_OKTA_DISABLE_HTTPS_CHECK === 'true',
};