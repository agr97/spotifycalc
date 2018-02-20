function parseUserPlaylist(playlistdata) {
  const { playlistBaseData, spotifyAudioFeaturesAverage, spotifySongStats } = playlistdata;
  const values = [];

  const playlistDescription = playlistBaseData.description || '';
  const songStats = Object.values(spotifySongStats);
  let audioFeatures;
  if (spotifyAudioFeaturesAverage === null) {
    audioFeatures = [];
  } else {
    audioFeatures = Object.values(spotifyAudioFeaturesAverage);
  }

  values.push(
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
  );

  return values;
}

function parseUserUser(actionData) {
  const { userData, userPlaylistsTotal } = actionData;

  const values = [];
  values.push(
    userData.id,
    userData.followers.total,
    userData.product,
    userPlaylistsTotal,
  );

  return values;
}

async function getDatabaseStats(pool) {
  try {
    const playlists = await pool.query('SELECT * from playlists');
    const userData = await pool.query('SELECT * from users');

    const initialTotalPlaylistStats = {
      totalNameLength: 0,
      totalDescriptionLength: 0,
      totalFollowers: 0,
      totalPublic: 0,
      totalCollaborative: 0,
      songStats: (new Array(18)).fill(0),
      songStatsPlaylists: 0,
      mixedSongStats: (new Array(18)).fill(0),
      mixedSongStatsPlaylists: 0,
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

      currentPlaylist.songStats.forEach((stat, index) => totalPlaylistStats.songStats[index] += currentPlaylist.songStats[index]);
      totalPlaylistStats.songStatsPlaylists++;

      if (currentPlaylist.songStats[0] === 0) { // if it is an empty playlist
        totalPlaylistStats.totalEmptyPlaylists++;
      } else if (currentPlaylist.songStats[4] === 0) { // if it is a spotifyOnly Playlist
        currentPlaylist.songStats.forEach((stat, index) => totalPlaylistStats.spotifyOnlySongStats[index] += currentPlaylist.songStats[index]);
        totalPlaylistStats.spotifyOnlySongStatsPlaylists++;
      } else if (currentPlaylist.songStats[9] === 0) { // if it is only a localOnly Playlist
        currentPlaylist.songStats.forEach((stat, index) => totalPlaylistStats.localOnlySongStats[index] += currentPlaylist.songStats[index]);
        totalPlaylistStats.localOnlySongStatsPlaylists++;
      } else { // if it is a mixed Playlist
        currentPlaylist.songStats.forEach((stat, index) => totalPlaylistStats.mixedSongStats[index] += currentPlaylist.songStats[index]);
        totalPlaylistStats.mixedSongStatsPlaylists++;
      }

      if (currentPlaylist.audioFeatures.length !== 0) {
        currentPlaylist.audioFeatures.forEach((stat, index) => totalPlaylistStats.audioFeatures[index] += currentPlaylist.audioFeatures[index]);
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
      averageMixedSongStats: totalPlaylists.mixedSongStats.map(stat => stat / totalPlaylists.mixedSongStatsPlaylists),
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
  } catch (err) {
    console.log(err);
    return {
      averagePlaylists: null,
      averageUsers: null,
    };
  }
}

module.exports.parseUserPlaylist = parseUserPlaylist;
module.exports.parseUserUser = parseUserUser;
module.exports.getDatabaseStats = getDatabaseStats;
