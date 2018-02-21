import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function userBox(state = {}, action) {
  switch (action.type) {
    case 'LOGOUT': {
      return Object.assign({}, state, {
        isLoggedIn: false,
        userSpotifyApi: '',
        userData: '',
        userPlaylists: '',
      });
    }
    case 'LOGIN_REQUEST': {
      return Object.assign({}, state, {
        fetchingUserApi: true,
      });
    }
    case 'LOGIN_FAILURE': {
      return Object.assign({}, state, {
        isLoggedIn: false,
        fetchingUserApi: false,
      });
    }
    case 'LOGIN_SUCCESS': {
      return Object.assign({}, state, {
        userSpotifyApi: action.userSpotifyApi,
        isLoggedIn: true,
        fetchingUserApi: false,
      });
    }
    case 'USERDATA_REQUEST': {
      return Object.assign({}, state, {
        fetchingUserData: true,
      });
    }
    case 'USERDATA_FAILURE': {
      return Object.assign({}, state, {
        fetchingUserData: false,
      });
    }
    case 'USERDATA_SUCCESS': {
      return Object.assign({}, state, {
        userData: action.userData,
        fetchingUserData: false,
      });
    }
    case 'USERPLAYLISTS_REQUEST': {
      return Object.assign({}, state, {
        fetchingUserPlaylists: true,
      });
    }
    case 'USERPLAYLISTS_FAILURE': {
      return Object.assign({}, state, {
        fetchingUserPlaylists: false,
      });
    }
    case 'USERPLAYLISTS_SUCCESS': {
      return Object.assign({}, state, {
        userPlaylists: action.userPlaylists,
        fetchingUserPlaylists: false,
      });
    }
    default:
      return state;
  }
}

function playlist(state = {}, action) {
  switch (action.type) {
    case 'sendClientSpotifyApi': {
      return Object.assign({}, state, {
        clientSpotifyApi: action.clientSpotifyApi,
      });
    }
    case 'sendClientDatabaseStats': {
      return Object.assign({}, state, {
        databaseStats: action.databaseStats,
      });
    }
    case 'PLAYLIST_REQUEST': {
      return Object.assign({}, state, {
        fetchingPlaylist: true,
      });
    }
    case 'PLAYLIST_FAILURE': {
      return Object.assign({}, state, {
        fetchingPlaylist: false,
        error: action.error,
      });
    }
    case 'PLAYLIST_SUCCESS': {
      return Object.assign({}, state, {
        loadedPlaylist: action.playlistData,
        fetchingPlaylist: false,
        error: '',
      });
    }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  userBox,
  playlist,
  router: routerReducer,
});

export default rootReducer;
