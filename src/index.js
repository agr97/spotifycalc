import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import { store, history } from './store';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'react-router-redux';

const router = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
      <Route path="*" component={App} />
      <Switch>        
        <Redirect from="/callback" render={
          store.dispatch({type: 'INITIALIZE', href: window.location.href})
        } push to="/user"/>
      </Switch>
      </div>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(router, document.getElementById('root'));
registerServiceWorker();
