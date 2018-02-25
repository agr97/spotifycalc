const spotifyCredentials = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: process.env.redirectUri,
};

const poolData = {
  user: process.env.dbUser,
  host: process.env.dbHost,
  database: process.env.dbDatabase,
  password: process.env.dbPassword,
  port: process.env.dbPort,
};

async function spotifyRefreshToken(spotifyApi, log) {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
  } catch (err) {
    log.fatal('Access Roken Refresh Failed', err);
  }
}

function parseUserPlaylist(playlistdata) {
  const { playlistBaseData, spotifyAudioFeaturesAverage, spotifySongStats } = playlistdata;

  const playlistDescription = playlistBaseData.description || '';
  const songStats = Object.values(spotifySongStats);
  const audioFeatures = Object.values(spotifyAudioFeaturesAverage || {});

  const values = [
    playlistBaseData.owner.id,
    playlistBaseData.id,
    playlistBaseData.name,
    playlistDescription,
    playlistBaseData.followers.total,
    playlistBaseData.public,
    playlistBaseData.collaborative,
    playlistBaseData.snapshot_id,
    songStats,
    audioFeatures,
  ];

  return values;
}

function parseDatabaseStats(playlists, userData) {
  const initialTotalPlaylistStats = {
    totalNameLength: 0,
    totalDescriptionLength: 0,
    totalFollowers: 0,
    totalPublic: 0,
    totalCollaborative: 0,
    songStats: (new Array(18)).fill(0),
    songStatsPlaylists: 0,
    localOnlySongStats: (new Array(18)).fill(0),
    localOnlySongStatsPlaylists: 0,
    spotifyOnlySongStats: (new Array(18)).fill(0),
    spotifyOnlySongStatsPlaylists: 0,
    totalEmptyPlaylists: 0,
    audioFeatures: (new Array(13)).fill(0),
    totalAudioFeatures: 0,
  };

  const totalPlaylists = playlists.rows.reduce((totalPlaylistStats, currentPlaylist) => {
    totalPlaylistStats.totalNameLength += currentPlaylist.name.length;
    totalPlaylistStats.totalDescriptionLength += currentPlaylist.description.length;
    totalPlaylistStats.totalFollowers += currentPlaylist.followers;
    totalPlaylistStats.totalPublic += currentPlaylist.public;
    totalPlaylistStats.totalCollaborative += currentPlaylist.collaborative;

    currentPlaylist.songstats.forEach((stat, index) => totalPlaylistStats.songStats[index] += currentPlaylist.songstats[index]);
    totalPlaylistStats.songStatsPlaylists++;

    if (currentPlaylist.songstats[0] === 0) { // if it is an empty playlist
      totalPlaylistStats.totalEmptyPlaylists++;
    } else if (currentPlaylist.songstats[4] === 0) { // if it is a spotifyOnly Playlist
      currentPlaylist.songstats.forEach((stat, index) => totalPlaylistStats.spotifyOnlySongStats[index] += currentPlaylist.songstats[index]);
      totalPlaylistStats.spotifyOnlySongStatsPlaylists++;
    } else if (currentPlaylist.songstats[9] === 0) { // if it is only a localOnly Playlist
      currentPlaylist.songstats.forEach((stat, index) => totalPlaylistStats.localOnlySongStats[index] += currentPlaylist.songstats[index]);
      totalPlaylistStats.localOnlySongStatsPlaylists++;
    }

    if (currentPlaylist.audiofeatures.length !== 0) {
      currentPlaylist.audiofeatures.forEach((stat, index) => totalPlaylistStats.audioFeatures[index] += currentPlaylist.audiofeatures[index]);
      totalPlaylistStats.totalAudioFeatures++;
    }

    return totalPlaylistStats;
  }, initialTotalPlaylistStats);

  const averagePlaylists = {
    averageNameLength: totalPlaylists.totalNameLength / totalPlaylists.songStatsPlaylists,
    averageDescriptionLength: totalPlaylists.totalDescriptionLength / totalPlaylists.songStatsPlaylists,
    averageFollowers: totalPlaylists.totalFollowers / totalPlaylists.songStatsPlaylists,
    averagePublic: totalPlaylists.totalPublic / totalPlaylists.songStatsPlaylists,
    averageCollaborative: totalPlaylists.totalCollaborative / totalPlaylists.songStatsPlaylists,
    averageSongStats: totalPlaylists.songStats.map(stat => stat / totalPlaylists.songStatsPlaylists),
    averageLocalOnlySongStats: totalPlaylists.localOnlySongStats.map(stat => stat / totalPlaylists.localOnlySongStatsPlaylists),
    averageSpotifyOnlySongStats: totalPlaylists.spotifyOnlySongStats.map(stat => stat / totalPlaylists.spotifyOnlySongStatsPlaylists),
    totalEmptyPlaylists: totalPlaylists.totalEmptyPlaylists,
    averageAudioFeatures: totalPlaylists.audioFeatures.map(stat => stat / totalPlaylists.totalAudioFeatures),
  };

  const initialTotalUserStats = {
    totalUsers: 0,
    totalFollowers: 0,
    totalPremium: 0,
    totalUserPlaylists: 0,
  };


  const totalUsers = userData.rows.reduce((totalUserStats, currentUser) => {
    totalUserStats.totalUsers++;
    totalUserStats.totalFollowers += currentUser.followers;
    if (currentUser.product === 'premium') totalUserStats.totalPremium++;
    totalUserStats.totalUserPlaylists += currentUser.playlists;

    return totalUserStats;
  }, initialTotalUserStats);

  const averageUsers = {
    averageFollowers: totalUsers.totalFollowers / totalUsers.totalUsers,
    averagePremium: totalUsers.totalPremium / totalUsers.totalUsers,
    averagePlaylists: totalUsers.totalUserPlaylists / totalUsers.totalUsers,
  };

  return {
    averagePlaylists,
    averageUsers,
  };
}


module.exports.parseUserPlaylist = parseUserPlaylist;
module.exports.parseDatabaseStats = parseDatabaseStats;
module.exports.poolData = poolData;
module.exports.spotifyCredentials = spotifyCredentials;
module.exports.spotifyRefreshToken = spotifyRefreshToken;
