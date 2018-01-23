import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import createHistory from 'history/createBrowserHistory';
import { BrowserRouter as Router, Route, IndexRoute, Redirect } from 'react-router-dom';

const history = createHistory();

const router = (
  <Router history={history}>
    <div>
    <Route path="/" component={App} />
    <Route path="/callback" />
    </div>
  </Router>
);

ReactDOM.render(router, document.getElementById('root'));
registerServiceWorker();
