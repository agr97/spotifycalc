import React, { Component } from 'react';
import { connect } from 'react-redux';
import url from 'url';
import { TextField, RaisedButton, CircularProgress, Popover, Menu } from 'material-ui';
import { store } from '../store';
import { GETPLAYLIST } from '../actions/actionCreators';
import '../styles/Playlist.css';
import blankalbum from '../blankalbumart.png';

class PlaylistClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localOpen: false, //
      spotifyOpen: false,
      loadedPlaylist: props.loadedPlaylist,
      playlistUrl: '',
      playlistAlbumArt: '',
      playlistName: '',
      playlistUsername: '',
      playlistDisplayUsername: '',
      textbarUsername: '',
      playlistID: '',
      textbarID: '',
      playlistFollowers: '',
      errorText: '',
      validUrl: false,
      playlistLoaded: false,
      filesizeNormal: '',
      filesizeHigh: '',
      filesizeExtreme: '',
    };

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.submitUrl = this.submitUrl.bind(this);
    this.playlistData = this.playlistData.bind(this);
    this.searchBar = this.searchBar.bind(this);
    this.playlistStats = this.playlistStats.bind(this);
    this.spotifyHandleClick = this.spotifyHandleClick.bind(this);
    this.localHandleClick = this.localHandleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  submitUrl(event) {
    event.preventDefault();
    store.dispatch(GETPLAYLIST(this.state.textbarUsername, this.state.textbarID));
  }


  handleUrlChange(event) {
    this.setState({ playlistUrl: event.target.value });
    const urlRegexp = /(\/user\/)+(\w+)+(\/playlist\/)+(\w+)/g;

    const parsedUrl = url.parse(event.target.value);
    const { pathname, hostname } = parsedUrl;

    console.log(url.parse(event.target.value));
    if (hostname === 'open.spotify.com' && pathname.match(urlRegexp)) {
      const playlistData = urlRegexp.exec(pathname);
      this.setState({ errorText: '', validUrl: true });
      this.setState({ textbarUsername: playlistData[2], textbarID: playlistData[4] });
      console.log(`${playlistData[2]} , ${playlistData[4]}`);
    } else {
      this.setState({ errorText: 'Invalid Playlist Url', validUrl: false });
    }
  }


  searchBar() {
    if (this.props.clientSpotifyApi === '') {
      return (
        <div>Waiting For Client Spotify Api From Server</div>
      );
    }

    // put fetching time here
    return (
      <div>
        <form onSubmit={this.submitUrl} className="playlistForm">
          <TextField
            errorText={this.state.errorText}
            fullWidth
            floatingLabelText="Enter A Spotify Playlist URL"
            value={this.state.playlistUrl}
            onChange={this.handleUrlChange}
          />
          <RaisedButton
            disabled={!this.state.validUrl}
            type="submit"
            label="Get Playlist From Spotify"
          />
        </form>
      </div>
    );
  }

  spotifyHandleClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      spotifyOpen: true,
      spotifyAnchorEl: event.currentTarget,
    });
  };

  localHandleClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      localOpen: true,
      localAnchorEl: event.currentTarget,
    });
  };

  handleRequestClose = (target) => {
    if (target === 'spotify') {
      this.setState({
        spotifyOpen: false,
      });
    }
    if (target === 'local') {
      this.setState({
        localOpen: false,
      });
    }
  };

  playlistStats() {
    const playlistBaseData = this.props.loadedPlaylist.playlistBaseData;
    const spotifyAudioFeaturesAverage = this.props.loadedPlaylist.spotifyAudioFeaturesAverage;
    const spotifySongStats = this.props.loadedPlaylist.spotifySongStats;

    function getTime(milliseconds) {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      seconds %= 60;
      const hours = Math.floor(minutes / 60);
      minutes %= 60;

      return `${hours} hrs ${minutes} min ${seconds} s ${(milliseconds % 1000).toFixed(0)} ms`;
    }

    let playlistStats;
    let playlistAudioFeatures;


    if (spotifySongStats.totalSongs === 0) {
      return (
        <div>
        No songs in this playlist to analyze
        </div>
      );
    } else if (spotifySongStats.totalLocalSongs === 0) {
      const megabyesNormal = (spotifySongStats.spotifyTotalDuration / 1000 * 12 / 1024).toFixed(2);
      const megabyesHigh = (spotifySongStats.spotifyTotalDuration / 1000 * 20 / 1024).toFixed(2);
      const megabyesExtreme = ((spotifySongStats.spotifyTotalDuration / 1000 * 40) / 1024).toFixed(2);

      playlistStats = (
        <div>
          <div>Total Songs: {spotifySongStats.totalSpotifySongs}</div>
          <div>Average Song Popularity: {spotifySongStats.spotifyAveragePopularity.toFixed(2)}</div>
          <div>Total Duration: {getTime(spotifySongStats.spotifyTotalDuration)}</div>
          <div>Average Song Duration: {getTime(spotifySongStats.spotifyAverageDuration)}</div>
          <div>Average Artists Per Song: {spotifySongStats.spotifyAverageArtists.toFixed(2)}</div>
          <div>{spotifySongStats.spotifyTotalExplicit} Explicit Songs or {spotifySongStats.spotifyAverageExplicit * 100}% of Spotify Songs</div>
          <div>Downloading at Normal Quality: {megabyesNormal} MB</div>
          <div>Downloading at High Quality: {megabyesHigh} MB</div>
          <div>Downloading at Extreme Quality: {megabyesExtreme} MB</div>
        </div>
      );
    } else if (spotifySongStats.totalSpotifySongs === 0) {
      const megabyesNormal = (spotifySongStats.spotifyTotalDuration / 1000 * 12 / 1024).toFixed(2);
      const megabyesHigh = (spotifySongStats.spotifyTotalDuration / 1000 * 20 / 1024).toFixed(2);
      const megabyesExtreme = ((spotifySongStats.spotifyTotalDuration / 1000 * 40) / 1024).toFixed(2);

      playlistStats = (
        <div>
          <div>Total Songs: {spotifySongStats.totalSpotifySongs}</div>
          <div>Total Duration: {getTime(spotifySongStats.localTotalDuration)}</div>
          <div>Average Song Duration: {getTime(spotifySongStats.localAverageDuration)}</div>
          <div>Average Artists Per Song: {spotifySongStats.localAverageArtists.toFixed(2)}</div>
          <div>Downloading at Normal Quality: {megabyesNormal} MB</div>
          <div>Downloading at High Quality: {megabyesHigh} MB</div>
          <div>Downloading at Extreme Quality: {megabyesExtreme} MB</div>
        </div>
      );
    } else {
      const megabyesNormal = (spotifySongStats.totalDuration / 1000 * 12 / 1024).toFixed(2);
      const megabyesHigh = (spotifySongStats.totalDuration / 1000 * 20 / 1024).toFixed(2);
      const megabyesExtreme = ((spotifySongStats.totalDuration / 1000 * 40) / 1024).toFixed(2);

      playlistStats = (
        <div>
          <div>Total Songs: {spotifySongStats.totalSongs}</div>
          <div>Total Duration: {getTime(spotifySongStats.totalDuration)}</div>
          <div>Average Song Duration: {getTime(spotifySongStats.totalAverageDuration)}</div>
          <div>Downloading at Normal Quality: {megabyesNormal} MB</div>
          <div>Downloading at High Quality: {megabyesHigh} MB</div>
          <div>Downloading at Extreme Quality: {megabyesExtreme} MB</div>

        <RaisedButton 
          onClick={this.spotifyHandleClick}
          label="Spotify Stats"
        />
        <Popover
          open={this.state.spotifyOpen}
          anchorEl={this.state.spotifyAnchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={() => this.handleRequestClose('spotify')}
        >
        <Menu>
          <div>Total Spotify Songs: {spotifySongStats.totalSpotifySongs}</div>
          <div>Average Spotify Song Popularity: {spotifySongStats.spotifyAveragePopularity.toFixed(2)}</div>
          <div>Total Spotify Song Duration: {getTime(spotifySongStats.spotifyTotalDuration)}</div>
          <div>Average Spotify Song Duration: {getTime(spotifySongStats.spotifyAverageDuration)}</div>
          <div>Average Artists Per Spotify  Song: {spotifySongStats.spotifyAverageArtists.toFixed(2)}</div>
          <div>{spotifySongStats.spotifyTotalExplicit} Explicit Spotify Songs or {spotifySongStats.spotifyAverageExplicit * 100}% of Spotify Songs</div>
          <div>Downloading Spotify Songs at Normal Quality: {megabyesNormal} MB</div>
          <div>Downloading Spotify Songs at High Quality: {megabyesHigh} MB</div>
          <div>Downloading Spotify Songs at Extreme Quality: {megabyesExtreme} MB</div>
          </Menu>
        </Popover>
{/** 
          <div>Total Spotify Songs: {spotifySongStats.spotifyTotalSongs}</div>
          <div>Average Spotify Song Popularity: {spotifySongStats.spotifyAveragePopularity.toFixed(2)}</div>
          <div>Total Spotify Song Duration: {getTime(spotifySongStats.spotifyTotalDuration)}</div>
          <div>Average Spotify Song Duration: {getTime(spotifySongStats.spotifyAverageDuration)}</div>
          <div>Average Artists Per Spotify  Song: {spotifySongStats.spotifyAverageArtists.toFixed(2)}</div>
          <div>{spotifySongStats.spotifyTotalExplicit} Explicit Spotify Songs or {spotifySongStats.spotifyAverageExplicit * 100}% of Spotify Songs</div>
          <div>Downloading Spotify Songs at Normal Quality: {megabyesNormal} MB</div>
          <div>Downloading Spotify Songs at High Quality: {megabyesHigh} MB</div>
          <div>Downloading Spotify Songs at Extreme Quality: {megabyesExtreme} MB</div>
          */}
          <RaisedButton 
          onClick={this.localHandleClick}
          label="Local Stats"
        />
          <Popover
          open={this.state.localOpen}
          anchorEl={this.state.localAnchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={() => this.handleRequestClose('local')}
        >
          <Menu>
          <div>Total Local Songs: {spotifySongStats.totalLocalSongs}</div>
          <div>Total Local Song Duration: {getTime(spotifySongStats.localTotalDuration)}</div>
          <div>Average Local Song Duration: {getTime(spotifySongStats.localAverageDuration)}</div>
          <div>Average Artists Per Local Song: {spotifySongStats.localAverageArtists.toFixed(2)}</div>
          <div>Downloading Local Songs at Normal Quality: {megabyesNormal} MB</div>
          <div>Downloading Local Songs at High Quality: {megabyesHigh} MB</div>
          <div>Downloading Local Songs at Extreme Quality: {megabyesExtreme} MB</div>
          </Menu>
          </Popover>
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

      let key;
      switch (parseFloat(spotifyAudioFeaturesAverage.key).toFixed(0)) {
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
      <div>
        {playlistStats}
        {playlistAudioFeatures}
      </div>
    );
  }

  playlistData() {
    const playlistBaseData = this.props.loadedPlaylist.playlistBaseData;
    const spotifyAudioFeaturesAverage = this.props.loadedPlaylist.spotifyAudioFeaturesAverage;
    const spotifySongStats = this.props.loadedPlaylist.spotifySongStats;
    let fetchingTime = `Fetching Time: ${this.props.loadedPlaylist.fetchingTime}`;
    if (this.props.loadedPlaylist.fetchingTime === '0') { fetchingTime = null; }

    const playlistImage = playlistBaseData.images[0].url || blankalbum;
    const playlistCollaborative = playlistBaseData.collaborative ? 'Collaborative' : null;
    const playlistPublic = playlistBaseData.public ? 'Public' : 'Private';

    const displayName = playlistBaseData.owner.display_name || playlistBaseData.owner.id;

    return (
      <div className="playlistData">
        <div className="playlistHeader">
          <img src={playlistImage} className="playlistImage" alt="Album Art" />
          <div className="playlistHeaderText">
            <div className="playlistHeaderTextItem">{playlistPublic}</div>
            <div className="playlistHeaderTextItem">{playlistCollaborative}</div>
            <div className="playlistHeaderTextItem">Followers: {playlistBaseData.followers.total}</div>
            <a className="playlistHeaderTextItem" target="_blank" href={playlistBaseData.external_urls.spotify}>Link to Spotify</a>
            <div className="playlistHeaderTextItem">{fetchingTime}</div>
          </div>
        </div>
        <div className="playlistMain">
          <div className="playlistMainTitle">{playlistBaseData.name}</div>
          <div className="playlistMainItem">Created By: {displayName}</div>
          <div className="playlistMainDescription">{playlistBaseData.description}</div>
        </div>
        <div className="playlistSongs">
          {this.playlistStats()}
        </div>
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
  fetchingPlaylist: state.playlist.fetchingPlaylist,
  clientSpotifyApi: state.playlist.clientSpotifyApi,
  defaultPlaylist: state.playlist.defaultPlaylist,
  loadedPlaylist: state.playlist.loadedPlaylist,
});
const mapDispatchToProps = dispatch => ({
  //
});


const Playlist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaylistClass);

export default Playlist;
