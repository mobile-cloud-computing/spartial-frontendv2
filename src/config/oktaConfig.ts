export const oktaConfig = {
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID || '',
    issuer: process.env.REACT_APP_OKTA_ISSUER || '',
    redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI || '',
    scopes: (process.env.REACT_APP_OKTA_SCOPES || '').split(' '),
    pkce: process.env.REACT_APP_OKTA_PKCE === 'true',
    disableHttpsCheck: process.env.REACT_APP_OKTA_DISABLE_HTTPS_CHECK === 'true',
};
