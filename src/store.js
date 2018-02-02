import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import defaultPlaylist from './globaltop50.json';
import createSocketIoMiddleware from 'redux-socket.io';
import socketIo from 'socket.io-client';
import thunk from 'redux-thunk';

// import root reducer
import rootReducer from './reducers/index';

const socket = socketIo.connect();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

export const history = createHistory();

const defaultState = {
  userBox: {
    fetchingUserApi: false,
    clientSpotifyApi: '',
    userSpotifyApi: '',
    fetchingUserData: false,
    isLoggedIn: '',
    userData: '',
    fetchingUserPlaylists: false,
    userPlaylists: '',
  },
  playlist: {
    fetchingPlaylist: false,
    defaultPlaylist: defaultPlaylist,
    loadedPlaylist: defaultPlaylist,
  },
};

export const store = createStore(
  rootReducer,
  defaultState,
  compose(
    applyMiddleware(routerMiddleware(history), socketIoMiddleware, thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);

