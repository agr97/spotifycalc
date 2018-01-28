import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';


//import userBox from './userBox';
//import playlist from './playlist';

function userBox(state = {}, action) {
  switch (action.type) {
    case 'INITIALIZE': {
      return Object.assign({}, state, {
        callbackUrl: action.href,
      });
    }
    case 'sendClientSpotifyApi': {
      return Object.assign({}, state, {
        clientSpotifyApi: action.clientSpotifyApi,
      });
    }
    case 'sendUserApi': {
      return Object.assign({}, state, {
        userApi: action.data,
      });
    }
    default:
      return state;
  }
}

function playlist(state = {}, action) {
  return state;
}

const rootReducer = combineReducers({
  userBox: userBox,
  playlist: playlist,
  router: routerReducer,
});

export default rootReducer;
