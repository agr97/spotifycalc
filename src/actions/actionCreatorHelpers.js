import SpotifyWebApi from 'spotify-web-api-node';

export async function login(dispatch, getState) {
  dispatch({ type: 'USERDATA_REQUEST' });
  const { userSpotifyApi } = getState().userBox;
  Object.setPrototypeOf(userSpotifyApi, SpotifyWebApi.prototype);

  let userData;
  try {
    userData = await userSpotifyApi.getMe();
    console.log(userData.body);
    dispatch({ type: 'USERDATA_SUCCESS', userData: userData.body });
  } catch (err) {
    console.log(err);
    dispatch({ type: 'USERDATA_FAILURE' });
    return;
  }

  dispatch({ type: 'USERPLAYLISTS_REQUEST' });
  try {
    const userPlaylists = await userSpotifyApi.getUserPlaylists(userData.body.id, { limit: 50 });
    console.log(userPlaylists.body);
    dispatch({ type: 'USERPLAYLISTS_SUCCESS', userPlaylists: userPlaylists.body });
  } catch (err) {
    dispatch({ type: 'USERPLAYLISTS_FAILURE' });
  }
}

export function parseSpotifySongs(tracksArray) {
  const localSongs = [];
  const spotifySongs = [];
  let errorSongs = 0;
  let spotifySongStats = {};

  let localTotalDuration = 0;
  let localTotalArtists = 0;
  let spotifyTotalDuration = 0;
  let spotifyTotalArtists = 0;
  let spotifyTotalExplicit = 0;
  let spotifyTotalPopularity = 0;

  tracksArray.forEach((track) => {
    if (track.track == null) {
      errorSongs += 1;
      return;
    }

    if (track.is_local) {
      localSongs.push({
        duration_ms: track.track.duration_ms,
        artists: track.track.artists.length,
      });
      localTotalDuration += track.track.duration_ms;
      localTotalArtists += track.track.artists.length;
      return;
    }

    spotifySongs.push({
      id: track.track.id,
      duration_ms: track.track.duration_ms,
      explicit: track.track.explicit,
      artists: track.track.artists.length,
      popularity: track.track.popularity,
    });
    spotifyTotalDuration += track.track.duration_ms;
    spotifyTotalArtists += track.track.artists.length;
    spotifyTotalExplicit += track.track.explicit;
    spotifyTotalPopularity += track.track.popularity;
  });

  const localAverageDuration = parseFloat((localTotalDuration / localSongs.length).toFixed(4));
  const localAverageArtists = parseFloat((localTotalArtists / localSongs.length).toFixed(4));
  const spotifyAverageDuration = parseFloat((spotifyTotalDuration / spotifySongs.length).toFixed(4));
  const spotifyAverageArtists = parseFloat((spotifyTotalArtists / spotifySongs.length).toFixed(4));
  const spotifyAverageExplicit = parseFloat((spotifyTotalExplicit / spotifySongs.length).toFixed(4));
  const spotifyAveragePopularity = parseFloat((spotifyTotalPopularity / spotifySongs.length).toFixed(4));

  spotifySongStats = {
    totalSongs: localSongs.length + spotifySongs.length,
    totalDuration: localTotalDuration + spotifyTotalDuration,
    totalAverageDuration: (localTotalDuration + spotifyTotalDuration) / (localSongs.length + spotifySongs.length),
    totalErrorsongs: errorSongs,
    totalLocalSongs: localSongs.length,
    localTotalDuration,
    localTotalArtists,
    localAverageDuration,
    localAverageArtists,
    totalSpotifySongs: spotifySongs.length,
    spotifyTotalDuration,
    spotifyTotalArtists,
    spotifyTotalExplicit,
    spotifyTotalPopularity,
    spotifyAverageDuration,
    spotifyAverageArtists,
    spotifyAverageExplicit,
    spotifyAveragePopularity,
  };

  const spotifySongIds = spotifySongs.map(track => track.id);

  return [spotifySongStats, spotifySongIds];
}

export function parseAudioFeatures(audioFeaturesArray) {
  if (audioFeaturesArray.length === 0) {
    return null;
  }

  const spotifyAudioFeaturesSum = {
    danceability: 0,
    energy: 0,
    key: 0,
    loudness: 0,
    mode: 0,
    speechiness: 0,
    acousticness: 0,
    instrumentalness: 0,
    liveness: 0,
    valence: 0,
    tempo: 0,
    duration_ms: 0,
    time_signature: 0,
  };

  const featureNames = Object.keys(spotifyAudioFeaturesSum);

  audioFeaturesArray.forEach((audiofeature) => {
    featureNames.forEach((featureName) => {
      spotifyAudioFeaturesSum[featureName] += audiofeature[featureName];
    });
  });

  const spotifyAudioFeaturesAverage = {};
  featureNames.forEach((featureName) => {
    spotifyAudioFeaturesAverage[featureName] = parseFloat((spotifyAudioFeaturesSum[featureName] / audioFeaturesArray.length).toFixed(4));
  });

  return spotifyAudioFeaturesAverage;
}
