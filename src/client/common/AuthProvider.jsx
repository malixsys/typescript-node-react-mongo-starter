import React from 'react';
import { useAuth } from './auth';
import { withAuth } from '@okta/okta-react';
import { getApi } from './api';

export const AuthContext = React.createContext({});

const Provider = ({ auth, children }) => {
  const { authenticated, user, token } = useAuth(auth);
  const [api, setApi] = React.useState(undefined);

  React.useEffect(() => {
    if (token && !api) {
      setApi(getApi(token));
    }
  }, [token, api, setApi]);

  const login = () => {
    auth.login('/');
  };

  const logout = () => {
    auth.logout('/');
  };
  const actions = { login, logout };
  const context = { authenticated, user, actions, api };
  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};
export const AuthProvider = withAuth(Provider);
