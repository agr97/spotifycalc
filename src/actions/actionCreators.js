// INITIALIZE
// LOGIN_REQUEST
// LOGIN_FAILURE
// LOGIN_SUCCESS
// USERDATA_REQUEST
// USERDATA_FAILURE
// USERDATA_SUCCESS
// USERPLAYLISTS_REQUEST
// USERPLAYLISTS_FAILURE
// USERPLAYLISTS_SUCCESS
// PLAYLIST_REQUEST
// PLAYLIST_FAILURE
// PLAYLIST_SUCCESS
import queryString from 'query-string';
import url from 'url';
import { store } from '../store';
import SpotifyWebApi from 'spotify-web-api-node';
import { login, parseSpotifySongs, parseAudioFeatures } from './actionCreatorHelpers';

export function INITIALIZE(callbackUrl) {
  return async function initialize(dispatch, getState) {
    dispatch({ type: 'INITIALIZE STARTED' });
    const parsedCallbackUrl = queryString.parse(url.parse(callbackUrl).search);

    if (parsedCallbackUrl.code === undefined) return;

    if (parsedCallbackUrl.error !== undefined) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return;
    }

    if (parsedCallbackUrl.code && parsedCallbackUrl.state.length === 16) {
      dispatch({ type: 'server/userLogin', userCode: parsedCallbackUrl.code });
      let outerUnsubscribe;
      const unsubscribe = store.subscribe(() => {
        const loginStatus = getState().userBox.isLoggedIn;
        if (loginStatus === true) {
          outerUnsubscribe();
          (async () => {
            await login(dispatch, getState);
          })();
        } else if (loginStatus === false) {
          outerUnsubscribe();
        }
      });
      outerUnsubscribe = unsubscribe;
    }
  };
}


export function GETPLAYLIST(userID, playlistID) {
  return async function getPlaylist(dispatch, getState) {
    const t0 = window.performance.now();

    // Determine which api to use for this playlist call
    dispatch({ type: 'PLAYLIST_REQUEST' });
    const userLoggedIn = getState().userBox.isLoggedIn;
    let usedSpotifyApi = getState().playlist.clientSpotifyApi;
    if (userLoggedIn) {
      usedSpotifyApi = getState().userBox.userSpotifyApi;
    }
    Object.setPrototypeOf(usedSpotifyApi, SpotifyWebApi.prototype);

    // Returned as objects on success
    let playlistBaseData = null;
    let spotifyAudioFeaturesAverage = [];
    let spotifySongStats = {};
    let fetchingTime = 0;

    // Used as helper variables
    let spotifySongIds = [];
    let totalSongs = 0;
    const spotifyRequestSize = 100;

    try {
      const fields = 'collaborative,description,external_urls,followers,id,images,name,owner,public,snapshot_id,tracks.total,type';
      playlistBaseData = await usedSpotifyApi.getPlaylist(userID, playlistID, { fields });
    } catch (err) {
      console.log(err);
      dispatch({
        type: 'PLAYLIST_FAILURE',
        error: err.statusCode,
      });
      return;
    }

    try {
      totalSongs = playlistBaseData.body.tracks.total;

      const tracksArray = [];
      const playlistRequests = [];

      for (let i = 0; i < totalSongs; i += spotifyRequestSize) {
        playlistRequests.push(usedSpotifyApi.getPlaylistTracks(userID, playlistID, { offset: i, limit: spotifyRequestSize }));
      }

      await Promise.all(playlistRequests).then((data) => {
        data.forEach((tracks) => {
          tracks.body.items.forEach(track => tracksArray.push(track));
        });
      });

      [spotifySongStats, spotifySongIds] = parseSpotifySongs(tracksArray);
    } catch (err) {
      console.log(err);
      dispatch({
        type: 'PLAYLIST_FAILURE',
        error: err.statusCode,
      });
      return;
    }

    // Need to add a wait time before more requests to help prevent rejections from the Spotify Api
    let requestWait = 100;
    if (playlistBaseData.body.tracks.total > 5000) {
      requestWait = 4000;
    }

    setTimeout(async () => {
      try {
        const spotifyAudioFeatures = [];
        const audioFeatureRequests = [];

        for (let start = 0; start < spotifySongIds.length; start += spotifyRequestSize) {
          audioFeatureRequests.push(usedSpotifyApi
            .getAudioFeaturesForTracks(spotifySongIds.slice(start, start + spotifyRequestSize)));
        }

        await Promise.all(audioFeatureRequests).then((data) => {
          data.forEach(request => request.body.audio_features.forEach(feature => spotifyAudioFeatures.push(feature)));
        });

        spotifyAudioFeaturesAverage = parseAudioFeatures(spotifyAudioFeatures);

        const t1 = window.performance.now();
        fetchingTime = (t1 - t0).toFixed(0);
        console.log(`Fetching Playlist Took ${fetchingTime} milliseconds.`);

        dispatch({
          type: 'PLAYLIST_SUCCESS',
          playlistData: {
            playlistBaseData: playlistBaseData.body,
            spotifyAudioFeaturesAverage,
            spotifySongStats,
            fetchingTime,
          },
        });

        dispatch({
          type: 'server/getPlaylist',
          playlistData: {
            playlistBaseData: playlistBaseData.body,
            spotifyAudioFeaturesAverage,
            spotifySongStats,
          },
        });
      } catch (err) {
        console.log(err);
        dispatch({
          type: 'PLAYLIST_FAILURE',
          error: err.statusCode,
        });
      }
    }, requestWait);
  };
}
