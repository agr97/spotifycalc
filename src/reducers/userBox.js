// import { login, logout} from '../actions';

function userBox(state = {}, action) {
  switch (action.type) {
    case 'INITIALIZE':
      return Object.assign({}, state, {
        callbackUrl: action.href,
      });
    default:
      return state;
  }
}

export default userBox;
