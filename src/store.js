import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import defaultPlaylist from './globaltop50.json';
import createSocketIoMiddleware from 'redux-socket.io';
import socketIo from 'socket.io-client';

// import root reducer
import rootReducer from './reducers/index';

const socket = socketIo.connect();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

export const history = createHistory();

const defaultState = {
  userBox: {
    isLoggedin: false,
    isFetching: false,
    error: '',
    userres: {
      id: '',
    },
    defaultApi: '',
    userApi: '',
    currentApi: '',
    loginurl: '',
    encryptedSecret: '',
    socketId: '',
  },
  playlist: {
    loadedPlaylist: defaultPlaylist,
    playlistUrl: '',
  },
};

export const store = createStore(
  rootReducer,
  defaultState,
  compose(
    applyMiddleware(routerMiddleware(history), socketIoMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);

