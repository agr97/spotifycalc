import {createStore, compose } from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';
import {browserHistory} from 'react-router';

// import root reducer
import rootReducer from './reducersIndex'

const defaultState = {date: 1};

const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
