// load playlist
// login
// logout

export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export function updatePlaylist(index) {
  return {
    type: 'UPDATE_PLAYLIST',
    index,
  };
}

export function login() {
  return {
    type: 'LOGIN',
  };
}

export function logout() {
  return {
    type: 'LOGOUT',
  };
}
