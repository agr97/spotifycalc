import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CircularProgress, Divider } from 'material-ui';
import '../styles/Stats.css';

class StatsClass extends Component {
  constructor(props) {
    super(props);

    this.statsMain = this.statsMain.bind(this);
  }

  statsMain() {
    if (this.props.databaseStats === null) {
      return (
        <div className="statsLoading">
          Waiting for Stats from Server
          <CircularProgress style={{ marginTop: '10px' }} />
        </div>
      );
    }

    const { averagePlaylists, averageUsers } = this.props.databaseStats;
    function getTime(milliseconds) {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      seconds %= 60;
      const hours = Math.floor(minutes / 60);
      minutes %= 60;

      return `${hours} hrs ${minutes} min ${seconds} s`;
    }

    const acousticness = `Acousticness: ${(averagePlaylists.averageAudioFeatures[6] * 100).toFixed(2)}%`;
    const danceability = `Danceability: ${(averagePlaylists.averageAudioFeatures[0] * 100).toFixed(2)}%`;
    const energy = `Energy: ${(averagePlaylists.averageAudioFeatures[1] * 100).toFixed(2)}%`;
    const instrumentalness = `Instrumentalness: ${(averagePlaylists.averageAudioFeatures[7] * 100).toFixed(2)}%`;
    const liveness = `Liveness: ${(averagePlaylists.averageAudioFeatures[8] * 100).toFixed(2)}%`;
    const mode = `Average Modality: ${(averagePlaylists.averageAudioFeatures[4] * 100).toFixed(2)}%`;
    const speechiness = `Speechiness: ${(averagePlaylists.averageAudioFeatures[5] * 100).toFixed(2)}%`;
    const valence = `Valence: ${(averagePlaylists.averageAudioFeatures[9] * 100).toFixed(2)}%`;

    let key;
    switch (parseFloat(averagePlaylists.averageAudioFeatures[2]).toFixed(0)) {
      case '0': key = 'Average Key: C'; break;
      case '1': key = 'Average Key: C#'; break;
      case '2': key = 'Average Key: D'; break;
      case '3': key = 'Average Key: D#'; break;
      case '4': key = 'Average Key: E'; break;
      case '5': key = 'Average Key: F'; break;
      case '6': key = 'Average Key: F#'; break;
      case '7': key = 'Average Key: G'; break;
      case '8': key = 'Average Key: G#'; break;
      case '9': key = 'Average Key: A'; break;
      case '10': key = 'Average Key: A#'; break;
      case '11': key = 'Average Key: B'; break;
      default: key = 'Average Key: Unknown'; break;
    }

    const loudness = `Loudness: ${(averagePlaylists.averageAudioFeatures[3]).toFixed(2)} dB`;
    const tempo = `Tempo: ${(averagePlaylists.averageAudioFeatures[10]).toFixed(2)} BPM`;
    const timesignature = `Time Signature: ${(averagePlaylists.averageAudioFeatures[12]).toFixed(2)}`;

    return (
      <div>
        <div className="statsMainTop">These statistics only pertain to playlists that have been loaded and users that have logged in through the application. Statistics are updated every 10 minutes.</div>
        <Divider style={{ margin: '4px 0px 4px' }} />
        <div className="statsPlaylistType">
          <div>Avg Followers Per User: {averageUsers.averageFollowers.toFixed(0)}</div>
          <div>Percentage of Premium Users: {averageUsers.averagePremium.toFixed(2) * 100}%</div>
          <div>Avg Playlists Per User: {averageUsers.averagePlaylists.toFixed(0)}</div>
        </div>
        <Divider style={{ margin: '4px 0px 4px' }} />
        <div className="statsPlaylistType">
          <div>Avg Playlist Name Length: {averagePlaylists.averageNameLength.toFixed(0)} Characters</div>
          <div>Avg Description Length: {averagePlaylists.averageDescriptionLength.toFixed(0)} Characters</div>
          <div>Avg Followers Per Playlist: {averagePlaylists.averageFollowers.toFixed(0)} </div>
          <div>Percentage of Playlists Public: {(averagePlaylists.averagePublic * 100).toFixed(2)}%</div>
          <div>Percentage of Playlists Collaborative: {(averagePlaylists.averageCollaborative * 100).toFixed(2)}%</div>
        </div>
        <Divider style={{ margin: '4px 0px 4px' }} />
        <div className="statsPlaylistType">
          <div>All Playlists Averages</div>
          <div>Total Songs Per Playlist: {averagePlaylists.averageSongStats[0].toFixed(0)}</div>
          <div>Total Playlist Length: {getTime(averagePlaylists.averageSongStats[1])}</div>
          <div>Avg Song Length: {getTime(averagePlaylists.averageSongStats[2])}</div>

          <div>Total Spotify Songs: {averagePlaylists.averageSongStats[9].toFixed(2)}</div>
          <div>Total Spotify Song Length: {getTime(averagePlaylists.averageSongStats[10])}</div>
          <div>Avg Spotify Song Popularity: {averagePlaylists.averageSongStats[17].toFixed(2)}</div>
          <div>Spotify Explicit Songs: {(averagePlaylists.averageSongStats[16] * 100).toFixed(2)}%</div>

          <div>Total Local Songs: {averagePlaylists.averageSongStats[4].toFixed(2)}</div>
          <div>Total Local Song Length: {getTime(averagePlaylists.averageSongStats[5])}</div>
        </div>
        <Divider style={{ margin: '4px 0px 4px' }} />
        <div className="statsPlaylistType">
          <div>{acousticness}</div>
          <div>{danceability}</div>
          <div>{energy}</div>
          <div>{instrumentalness}</div>
          <div>{key}</div>
          <div>{liveness}</div>
          <div>{loudness}</div>
          <div>{mode}</div>
          <div>{speechiness}</div>
          <div>{tempo}</div>
          <div>{timesignature}</div>
          <div>{valence}</div>
        </div>
        <Divider style={{ margin: '4px 0px 4px' }} />
        <div className="statsPlaylistType">
          <div>Spotify Song Only Playlist Averages</div>
          <div>Total Spotify Songs: {averagePlaylists.averageSpotifyOnlySongStats[9].toFixed(2)}</div>
          <div>Total Spotify Song Length: {getTime(averagePlaylists.averageSpotifyOnlySongStats[10])}</div>
          <div>Avg Spotify Song Length: {getTime(averagePlaylists.averageSpotifyOnlySongStats[14])}</div>
          <div>Avg Spotify Song Popularity: {averagePlaylists.averageSpotifyOnlySongStats[17].toFixed(2)}</div>
          <div>Spotify Explicit Songs: {(averagePlaylists.averageSpotifyOnlySongStats[16] * 100).toFixed(2)}%</div>
          <div>Avg Artists Per Song: {(averagePlaylists.averageSpotifyOnlySongStats[15]).toFixed(2)}</div>
        </div>
        <Divider style={{ margin: '4px 0px 4px' }} />
        <div className="statsPlaylistType">
          <div>Local Song Playlist Averages</div>
          <div>Total Local Songs: {averagePlaylists.averageLocalOnlySongStats[4].toFixed(2)}</div>
          <div>Total Local Song Length: {getTime(averagePlaylists.averageLocalOnlySongStats[5])}</div>
          <div>Avg Local Song Length: {getTime(averagePlaylists.averageLocalOnlySongStats[7])}</div>
          <div>Avg Artists Per Song: {(averagePlaylists.averageLocalOnlySongStats[8]).toFixed(2)}</div>
        </div>

      </div>
    );
  }

  render() {
    return (
      <div className="stats">
        {this.statsMain()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  databaseStats: state.playlist.databaseStats,
});


const Stats = connect(mapStateToProps)(StatsClass);

export default Stats;
