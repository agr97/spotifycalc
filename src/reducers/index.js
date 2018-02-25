import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function userBox(state = {}, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST': {
      return Object.assign({}, state, {
        fetchingUserData: true,
      });
    }
    case 'LOGIN_SUCCESS': {
      return Object.assign({}, state, {
        isLoggedIn: true,
        fetchingUserData: false,
        userSpotifyApi: action.userSpotifyApi,
        userData: action.userData,
        userPlaylists: action.userPlaylists,
      });
    }
    case 'LOGIN_FAILURE': {
      return Object.assign({}, state, {
        isLoggedIn: false,
        fetchingUserData: false,
        loginFailure: true,
      });
    }
    case 'LOGOUT': {
      return Object.assign({}, state, {
        isLoggedIn: false,
        userSpotifyApi: '',
        userData: '',
        userPlaylists: '',
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
        initiateLogin: false,
      });
    }
    default:
      return state;
  }
}

function playlist(state = {}, action) {
  switch (action.type) {
    case 'SENDCLIENTSPOTIFYAPI': {
      return Object.assign({}, state, {
        clientSpotifyApi: action.clientSpotifyApi,
      });
    }
    case 'SENDCLIENTDATABASESTATS': {
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
