import React from 'react';
import ReactDOM from 'react-dom';
import { ImplicitCallback, Security } from '@okta/okta-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import {oktaOrgUrl, oktaClientId} from './config.json';
ReactDOM.render(
  <Router>
    <Security
      issuer={`${oktaOrgUrl}`}
      client_id={`${oktaClientId}`}
      redirect_uri={`${window.location.origin}/implicit/callback`}
    >
      <Route path="/" exact component={App} />
      <Route path="/implicit/callback" component={ImplicitCallback} />
    </Security>
  </Router>,
  document.getElementById('root')
);
