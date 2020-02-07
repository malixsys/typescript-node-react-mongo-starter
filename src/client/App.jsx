import React, { useState } from 'react';
import { AuthContext, AuthProvider } from './common/AuthProvider';

const Authenticated = () => {
  const [cart, setCart] = useState(null);
  const { user, actions, api } = React.useContext(AuthContext);
  React.useEffect(() => {
    async function load() {
      const result = await api.getCart();
      setCart(result);
    }

    if (api) {
      load();
    }
  }, [api, setCart]);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={actions.logout}>Sign out</button>
      <blockquote>
        <h2>Cart</h2>
        <pre>{JSON.stringify({ cart }, null, 2)}</pre>
      </blockquote>
    </div>
  );
};

const Anonymous = () => {
  const { actions } = React.useContext(AuthContext);
  return (
    <div>
      <h1>Anonymous</h1>
      <button onClick={actions.login}>Sign in</button>
    </div>
  );
};

function App() {
  const { authenticated, user } = React.useContext(AuthContext);
  if (authenticated && !user) {
    return <pre>Loading...</pre>;
  }
  return authenticated ? <Authenticated /> : <Anonymous />;
}

export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};
