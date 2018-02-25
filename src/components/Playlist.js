import React, { Component } from 'react';
import { connect } from 'react-redux';
import url from 'url';
import { TextField, RaisedButton, CircularProgress, Divider } from 'material-ui';
import { store } from '../store';
import { GETPLAYLIST } from '../actions/actionCreators';
import '../styles/Playlist.css';
import blankalbumart from '../blankalbumart.png';
import spotifyIcon from '../Spotify_Icon_RGB_Green.png';

class PlaylistClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistUrl: '',
      textbarUsername: '',
      textbarID: '',
      errorText: '',
      validUrl: false,
    };

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.submitUrl = this.submitUrl.bind(this);
    this.playlistData = this.playlistData.bind(this);
    this.searchBar = this.searchBar.bind(this);
    this.playlistStats = this.playlistStats.bind(this);
  }

  submitUrl(event) {
    event.preventDefault();
    store.dispatch(GETPLAYLIST(this.state.textbarUsername, this.state.textbarID));
    this.setState({ textbarID: '', textbarUsername: '', validUrl: false });
  }


  handleUrlChange(event) {
    this.setState({ playlistUrl: event.target.value });
    const urlRegexp = /(\/user\/)+(\w+)+(\/playlist\/)+(\w+)/g;

    const parsedUrl = url.parse(event.target.value);
    const { pathname, hostname } = parsedUrl;

    if (hostname === 'open.spotify.com' && pathname.match(urlRegexp)) {
      const playlistData = urlRegexp.exec(pathname);
      this.setState({ errorText: '', validUrl: true });
      this.setState({ textbarUsername: playlistData[2], textbarID: playlistData[4] });
    } else {
      this.setState({ errorText: 'Invalid Playlist Url', validUrl: false });
    }
  }


  searchBar() {
    if (this.props.clientSpotifyApi === '' && this.props.userSpotifyApi === '') {
      return (
        <div className="playlistLoading">
          <div>Waiting For Spotify Api From Server</div>
          <CircularProgress style={{ marginTop: '10px' }} />
        </div>
      );
    }

    if (this.props.fetchingPlaylist) {
      return (
        <div className="playlistLoading">
          <div>Fetching Playlist. Longer Playlists have longer fetching times</div>
          <CircularProgress style={{ marginTop: '10px' }} />
        </div>
      );
    }

    let errorText;
    switch (this.props.error) {
      case 404: errorText = 'Playlist Not Found.'; break;
      case 429: errorText = 'Too many requests. Wait longer between requesting again.'; break;
      case 401: errorText = 'Api expired. Try refreshing the page before making another request.'; break;
      default: errorText = null; break;
    }

    return (
      <div>
        <form onSubmit={this.submitUrl} className="playlistForm">
          <TextField
            errorText={this.state.errorText}
            fullWidth
            floatingLabelText="Enter A Spotify Playlist URL"
            value={this.state.playlistUrl}
            onChange={this.handleUrlChange}
            autoFocus
            onFocus={() => this.setState({ playlistUrl: '' })}
          />
          <RaisedButton
            disabled={!this.state.validUrl}
            type="submit"
            label="Get Playlist From Spotify"
          />
        </form>
        <div className="playlistMainItem">{errorText}</div>
      </div>
    );
  }


  playlistStats() {
    const { spotifyAudioFeaturesAverage, spotifySongStats } = this.props.loadedPlaylist;

    function getTime(milliseconds) {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      seconds %= 60;
      const hours = Math.floor(minutes / 60);
      minutes %= 60;

      return `${hours} hrs ${minutes} min ${seconds} s`;
    }

    let playlistStats;
    let playlistAudioFeatures;


    if (spotifySongStats.totalSongs === 0) {
      return (
        <div>
        No songs in this playlist to analyze
        </div>
      );
    } else if (spotifySongStats.localTotalSongs === 0) {
      playlistStats = (
        <div>
          <div>Total Songs: {spotifySongStats.spotifyTotalSongs}</div>
          <div>Avg Song Popularity: {spotifySongStats.spotifyAveragePopularity.toFixed(2)}</div>
          <div>Total Length: {getTime(spotifySongStats.spotifyTotalDuration)}</div>
          <div>Avg Song Length: {getTime(spotifySongStats.spotifyAverageDuration)}</div>
          <div>Avg Artists Per Song: {spotifySongStats.spotifyAverageArtists.toFixed(2)}</div>
          <div>{spotifySongStats.spotifyTotalExplicit} Explicit Songs or {(spotifySongStats.spotifyAverageExplicit * 100).toFixed(2)}% of Spotify Songs</div>
          <div>Downloading at Normal Quality: {(spotifySongStats.totalDuration / 1000 * 12 / 1024).toFixed(2)} MB</div>
          <div>Downloading at High Quality: {(spotifySongStats.totalDuration / 1000 * 20 / 1024).toFixed(2)} MB</div>
          <div>Downloading at Extreme Quality: {(spotifySongStats.totalDuration / 1000 * 40 / 1024).toFixed(2)} MB</div>
        </div>
      );
    } else if (spotifySongStats.spotifyTotalSongs === 0) {
      playlistStats = (
        <div>
          <div>Total Songs: {spotifySongStats.localTotalSongs}</div>
          <div>Total Duration: {getTime(spotifySongStats.localTotalDuration)}</div>
          <div>Avg Song Duration: {getTime(spotifySongStats.localAverageDuration)}</div>
          <div>Avg Artists Per Song: {spotifySongStats.localAverageArtists.toFixed(2)}</div>
          <div>Downloading at Normal Quality: {(spotifySongStats.totalDuration / 1000 * 12 / 1024).toFixed(2)} MB</div>
          <div>Downloading at High Quality: {(spotifySongStats.totalDuration / 1000 * 20 / 1024).toFixed(2)} MB</div>
          <div>Downloading at Extreme Quality: {(spotifySongStats.totalDuration / 1000 * 40 / 1024).toFixed(2)} MB</div>
        </div>
      );
    } else {
      playlistStats = (
        <div>
          <div>Total Songs: {spotifySongStats.totalSongs}</div>
          <div>Total Length: {getTime(spotifySongStats.totalDuration)}</div>
          <div>Avg Song Length: {getTime(spotifySongStats.totalAverageDuration)}</div>
          <div>Downloading at Normal Quality: {(spotifySongStats.totalDuration / 1000 * 12 / 1024).toFixed(2)} MB</div>
          <div>Downloading at High Quality: {(spotifySongStats.totalDuration / 1000 * 20 / 1024).toFixed(2)} MB</div>
          <div>Downloading at Extreme Quality: {(spotifySongStats.totalDuration / 1000 * 40 / 1024).toFixed(2)} MB</div>
          <Divider style={{ margin: '4px 0px 4px' }} />
          <div>Total Spotify Songs: {spotifySongStats.spotifyTotalSongs}</div>
          <div>Avg Spotify Song Popularity: {spotifySongStats.spotifyAveragePopularity.toFixed(2)}</div>
          <div>Total Spotify Song Length: {getTime(spotifySongStats.spotifyTotalDuration)}</div>
          <div>Avg Spotify Song Length: {getTime(spotifySongStats.spotifyAverageDuration)}</div>
          <div>Avg Artists Per Spotify Song: {spotifySongStats.spotifyAverageArtists.toFixed(2)}</div>
          <div>{spotifySongStats.spotifyTotalExplicit} Explicit or {spotifySongStats.spotifyAverageExplicit * 100}% of Spotify Songs</div>
          <Divider style={{ margin: '4px 0px 4px' }} />
          <div>Total Local Songs: {spotifySongStats.localTotalSongs}</div>
          <div>Total Local Song Length: {getTime(spotifySongStats.localTotalDuration)}</div>
          <div>Avg Local Song Length: {getTime(spotifySongStats.localAverageDuration)}</div>
          <div>Avg Artists Per Local Song: {spotifySongStats.localAverageArtists.toFixed(2)}</div>

        </div>
      );
    }


    if (spotifyAudioFeaturesAverage !== null) {
      const acousticness = `Acousticness: ${(spotifyAudioFeaturesAverage.acousticness * 100).toFixed(2)}%`;
      const danceability = `Danceability: ${(spotifyAudioFeaturesAverage.danceability * 100).toFixed(2)}%`;
      const energy = `Energy: ${(spotifyAudioFeaturesAverage.energy * 100).toFixed(2)}%`;
      const instrumentalness = `Instrumentalness: ${(spotifyAudioFeaturesAverage.instrumentalness * 100).toFixed(2)}%`;
      const liveness = `Liveness: ${(spotifyAudioFeaturesAverage.liveness * 100).toFixed(2)}%`;
      const mode = `Average Modality: ${(spotifyAudioFeaturesAverage.mode * 100).toFixed(2)}%`;
      const speechiness = `Speechiness: ${(spotifyAudioFeaturesAverage.speechiness * 100).toFixed(2)}%`;
      const valence = `Valence: ${(spotifyAudioFeaturesAverage.valence * 100).toFixed(2)}%`;

      const keys = [
        'Average Key: C',
        'Average Key: C#',
        'Average Key: D',
        'Average Key: D#',
        'Average Key: E',
        'Average Key: F',
        'Average Key: F#',
        'Average Key: G',
        'Average Key: G#',
        'Average Key: A',
        'Average Key: A#',
        'Average Key: B',
      ]

      const key = keys[parseFloat(spotifyAudioFeaturesAverage.key.toFixed(0))] || 'Average Key: Unknown' ;
      const loudness = `Loudness: ${(spotifyAudioFeaturesAverage.loudness).toFixed(2)} dB`;
      const tempo = `Tempo: ${(spotifyAudioFeaturesAverage.tempo).toFixed(2)} BPM`;
      const timesignature = `Time Signature: ${(spotifyAudioFeaturesAverage.time_signature).toFixed(2)}`;

      playlistAudioFeatures = (
        <div>
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
      );
    }

    return (
      <div className="playlistSongs">
        {playlistStats}
        <Divider style={{ margin: '4px 0px 4px' }} />
        {playlistAudioFeatures}
      </div>
    );
  }

  playlistData() {
    const { playlistBaseData } = this.props.loadedPlaylist;

    let fetchingTime = `Fetching Time: ${this.props.loadedPlaylist.fetchingTime} ms`;
    if (this.props.loadedPlaylist.fetchingTime === '0') { fetchingTime = null; }

    const playlistImage = playlistBaseData.images.length === 0 ? blankalbumart : playlistBaseData.images[0].url;
    const playlistCollaborative = playlistBaseData.collaborative ? 'Collaborative' : null;
    const playlistPublic = playlistBaseData.public ? 'Public' : 'Private';

    const displayName = playlistBaseData.owner.display_name || playlistBaseData.owner.id;
    const htmlDescription = (new window.DOMParser()).parseFromString(playlistBaseData.description, 'text/html');
    let textDescription = htmlDescription.getElementsByTagName('body')[0].innerHTML;
    if (playlistBaseData.description === null) { textDescription = null; }

    return (
      <div className="playlistData">
        <div className="playlistHeader">
          <img src={playlistImage} className="playlistImage" alt="Album Art" />
          <div className="playlistHeaderText">
            <div>{playlistPublic}</div>
            <div>{playlistCollaborative}</div>
            <div>Followers: {playlistBaseData.followers.total}</div>
            <div>
              <a target="_blank" href={playlistBaseData.external_urls.spotify}>
                Link To Playlist On <img className="spotifyIcon" src={spotifyIcon} alt="Spotify Icon" />
              </a>
            </div>
            <div>{fetchingTime}</div>
          </div>
        </div>
        <div className="playlistMain">
          <div className="playlistMainTitle">{playlistBaseData.name}</div>
          <div className="playlistMainItem">Created By: {displayName}</div>
          <div className="playlistMainDescription">{textDescription}</div>
        </div>
        {this.playlistStats()}
        <div />
      </div>
    );
  }


  render() {
    return (
      <div className="playlist">
        {this.searchBar()}
        {this.playlistData()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.playlist.error,
  clientSpotifyApi: state.playlist.clientSpotifyApi,
  fetchingPlaylist: state.playlist.fetchingPlaylist,
  userSpotifyApi: state.userBox.userSpotifyApi,
  loadedPlaylist: state.playlist.loadedPlaylist,
});


const Playlist = connect(mapStateToProps)(PlaylistClass);

export default Playlist;
