export const oktaConfig = {
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID || '',
    issuer: process.env.REACT_APP_OKTA_ISSUER || '',
    redirectUri: `http://193.40.154.121:3000/login/callback` || `${window.location.origin}/login/callback`,
    scopes: ('openid profile email').split(' '),
    pkce: process.env.REACT_APP_OKTA_PKCE === 'true',
    disableHttpsCheck: process.env.REACT_APP_OKTA_DISABLE_HTTPS_CHECK === 'true',
};