import { createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client = null;

const configureClient = async () => {
  auth0Client = await createAuth0Client({
    domain: 'dev-308x0ggohmrzr8c3.us.auth0.com',
    clientId: 'B1Z3JVZWB28irqp5UpadN2zcoX5b2UBq',
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
};

export const initAuth = async () => {
  await configureClient();
  const isAuthenticated = await auth0Client.isAuthenticated();
  
  if (isAuthenticated) {
    return await auth0Client.getUser();
  }

  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
    return await auth0Client.getUser();
  }

  return null;
};

export const login = async () => {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
};

export const logout = () => {
  auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
};

export const getToken = async () => {
  return await auth0Client.getTokenSilently();
};