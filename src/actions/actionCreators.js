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

export function INITIALIZE(callbackUrl) {
  return function (dispatch, getState) {
    dispatch({ type: 'INITIALIZE STARTED' });
    const parsedCallbackUrl = queryString.parse(url.parse(callbackUrl).search);

    if (parsedCallbackUrl.code === undefined) {
      // Do Nothing;
    } else if (parsedCallbackUrl.error !== undefined) {
      dispatch({ type: 'LOGIN_FAILURE' });
    } else if (parsedCallbackUrl.code !== undefined && parsedCallbackUrl.state.length === 16) {
      dispatch({ type: 'server/userLogin', userCode: parsedCallbackUrl.code });
      const unsubscribe = store.subscribe(() => {
        const loginStatus = getState().userBox.isLoggedIn;
        if (loginStatus === true) {
          outerUnsubscribe();
          (async () => {
            await login();
          })();
        } else if (loginStatus === false) {
          //outerUnsubscribe();
        }

        async function login() {
          dispatch({ type: 'USERDATA_REQUEST' });
          const userSpotifyApi = getState().userBox.userSpotifyApi;
          Object.setPrototypeOf(userSpotifyApi, SpotifyWebApi.prototype);

          try {
            const userData = await userSpotifyApi.getMe();
            console.log(userData.body);
            dispatch({ type: 'USERDATA_SUCCESS', userData: userData.body });

            dispatch({ type: 'USERPLAYLISTS_REQUEST' });
            try {
              const userPlaylists = await userSpotifyApi.getUserPlaylists(userData.body.id, { limit: 50 });
              console.log(userPlaylists.body);
              dispatch({ type: 'USERPLAYLISTS_SUCCESS', userPlaylists: userPlaylists.body });
            } catch (err) {
              dispatch({ type: 'USERPLAYLISTS_FAILURE' });
            }
          } catch (err) {
            console.log(err);
            dispatch({ type: 'USERDATA_FAILURE' });
          }
        }
      });
      function outerUnsubscribe() { unsubscribe(); }
    }
  };
}


export function GETPLAYLIST(userID, playlistID) {
  return function (dispatch, getState) {
    var a = window.performance.now();

    dispatch({ type: 'PLAYLIST_REQUEST' });
    const userLoggedIn = getState().userBox.isLoggedIn;
    let usedSpotifyApi = getState().userBox.clientSpotifyApi;
    if (userLoggedIn) {
      usedSpotifyApi = getState().userBox.userSpotifyApi;
      console.log('using user api');
    }
    
    try { 
      (async () => {
        Object.setPrototypeOf(usedSpotifyApi, SpotifyWebApi.prototype);
        const fields = 'collaborative,description,external_urls,followers,id,images,name,owner,public,snapshot_id,tracks.total,type';
        const playlistBaseData = await usedSpotifyApi.getPlaylist(userID, playlistID, {fields: fields});
        const totalSongs = playlistBaseData.body.tracks.total;
        
        const totalRequests = parseInt(totalSongs / 100, 10) + 1;

        let currentStart = 0;
        const localSongs = [];
        const spotifySongs = [];
        let errorSongs = 0;
              
        for (let i = 0; i < totalRequests; i++) {
          let tracks = await usedSpotifyApi.getPlaylistTracks(userID, playlistID, { offset: currentStart, limit: 100 });
          tracks.body.items.forEach(track => {

            if (track.track == null) {
              errorSongs++;
            } else if (track.is_local === true) {
              let trackData = {
                duration_ms: track.track.duration_ms,
                artists: track.track.artists.length,
              }
              localSongs.push(trackData);                               
            } else {
              let trackData = {
                id: track.track.id,
                duration_ms: track.track.duration_ms,
                explicit: track.track.explicit,
                artists: track.track.artists.length,
                popularity: track.track.popularity,
              }
              spotifySongs.push(trackData);
            }
            
          });
          currentStart += 100;
        }

        console.log(localSongs.length);
        console.log(spotifySongs.length);
        console.log(errorSongs);

        const spotifyAudioFeatures = [];
        const totalAudioFeaturesRequests = parseInt(spotifySongs.length / 100) + 1;

        const spotifySongIds = spotifySongs.map(track => track.id);
        let start = 0;

        for (let i = 0; i < totalAudioFeaturesRequests; i++) {
          let ids = spotifySongIds.slice(start, start + 100);
          let audiofeatures = await usedSpotifyApi.getAudioFeaturesForTracks(ids);
          console.log(audiofeatures);
          audiofeatures.body.audio_features.forEach(audiofeatures => spotifyAudioFeatures.push(audiofeatures));

          start += 100;
        }

        console.log(spotifyAudioFeatures);

        var b = window.performance.now();
        const fetchingTime = b - a;
        console.log("Fetching Playlist Took " + fetchingTime + " milliseconds.")

        dispatch({
          type: 'PLAYLIST_SUCCESS',
          playlistData: {
            playlistBaseData: playlistBaseData.body,
            localSongs: localSongs,
            spotifySongs: spotifySongs,
            errorSongs: errorSongs,
            spotifyAudioFeatures: spotifyAudioFeatures,
            fetchingTime: fetchingTime,
          },
        });

        
      })();
    } catch (err) {
      console.log(err);
      dispatch({ type: 'PLAYLIST_FAILURE' });
    }
  };
}
