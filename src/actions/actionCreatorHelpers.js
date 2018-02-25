export function parseSpotifySongs(tracksArray) {
  const localSongs = [];
  const spotifySongs = [];
  let errorSongs = 0;
  let spotifySongStats = {};

  let localTotalDuration = 0;
  let localTotalArtists = 0;
  let localAverageDuration = 0;
  let localAverageArtists = 0;
  let spotifyTotalDuration = 0;
  let spotifyTotalArtists = 0;
  let spotifyTotalExplicit = 0;
  let spotifyTotalPopularity = 0;
  let spotifyAverageDuration = 0;
  let spotifyAverageArtists = 0;
  let spotifyAverageExplicit = 0;
  let spotifyAveragePopularity = 0;

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

  const totalAverageDuration = parseFloat(((localTotalDuration + spotifyTotalDuration) / (localSongs.length + spotifySongs.length)).toFixed(4)) || 0;
  localAverageDuration = parseFloat((localTotalDuration / localSongs.length).toFixed(4)) || 0;
  localAverageArtists = parseFloat((localTotalArtists / localSongs.length).toFixed(4)) || 0;
  spotifyAverageDuration = parseFloat((spotifyTotalDuration / spotifySongs.length).toFixed(4)) || 0;
  spotifyAverageArtists = parseFloat((spotifyTotalArtists / spotifySongs.length).toFixed(4)) || 0;
  spotifyAverageExplicit = parseFloat((spotifyTotalExplicit / spotifySongs.length).toFixed(4)) || 0;
  spotifyAveragePopularity = parseFloat((spotifyTotalPopularity / spotifySongs.length).toFixed(4)) || 0;

  spotifySongStats = {
    totalSongs: localSongs.length + spotifySongs.length,
    totalDuration: localTotalDuration + spotifyTotalDuration,
    totalAverageDuration,
    totalErrorsongs: errorSongs,
    localTotalSongs: localSongs.length,
    localTotalDuration,
    localTotalArtists,
    localAverageDuration,
    localAverageArtists,
    spotifyTotalSongs: spotifySongs.length,
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
