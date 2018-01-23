import { createStore, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router-dom';

// import root reducer
import rootReducer from './reducers/index';

const defaultState = {
  loadedPlaylist: '',
  playlistUrl: '',
  playlistAlbumArt: '',
  playlistName: '',
  playlistUsername: '',
  playlistDisplayUsername: '',
  textbarUsername: '',
  playlistID: '',
  textbarID: '',
  playlistFollowers: '',
  errorText: '',
  validUrl: false,
  playlistLoaded: false,
  filesizeNormal: '',
  filesizeHigh: '',
  filesizeExtreme: '',
  loginurl: '',
};

const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
