import createSocketIoMiddleware from 'redux-socket.io';
import socketIo from 'socket.io-client';
import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import defaultPlaylist from './defaultPlaylist.json';

import rootReducer from './reducers/index';

const socket = socketIo.connect();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

export const history = createHistory();

const defaultState = {
  userBox: {
    fetchingUserApi: false,
    userSpotifyApi: '',
    fetchingUserData: false,
    isLoggedIn: '',
    userData: '',
    fetchingUserPlaylists: false,
    userPlaylists: '',
    loginFailure: false,
  },
  playlist: {
    error: '',
    clientSpotifyApi: '',
    fetchingPlaylist: false,
    defaultPlaylist,
    loadedPlaylist: defaultPlaylist,
    databaseStats: '',
  },
};

/* eslint-disable */
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
/* eslint-enable */

export const store = createStore(
  rootReducer,
  defaultState,
  composeEnhancers(applyMiddleware(routerMiddleware(history), socketIoMiddleware, thunk)),
);
