import React, { Component } from 'react';
import { connect } from 'react-redux';
import url from 'url';
import { TextField, RaisedButton } from 'material-ui';
import { store } from '../store';
import { GETPLAYLIST } from '../actions/actionCreators';
import '../styles/Playlist.css';

class PlaylistClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.updatePlaylistInfo = this.updatePlaylistInfo.bind(this);
  }

  updatePlaylistInfo(playlist, playlistlength) {
    if (playlist.owner.display_name === null) {
      this.setState({ playlistDisplayUsername: playlist.owner.id });
    } else {
      this.setState({ playlistDisplayUsername: playlist.owner.display_name });
    }

    const totalseconds = playlistlength / 1000;
    const megabyesNormal = (totalseconds * 12 / 1024).toFixed(2);
    const megabyesHigh = (totalseconds * 20 / 1024).toFixed(2);
    const megabyesExtreme = ((totalseconds * 40) / 1024).toFixed(2);

    this.setState({
      playlistAlbumArt: playlist.images[0].url,
      playlistName: playlist.name,
      playlistID: playlist.id,
      playlistUsername: playlist.owner.id,
      playlistFollowers: `${playlist.followers.total} Followers`,
      filesizeNormal: `File Size at Normal Quality: ${megabyesNormal} Megabytes`,
      filesizeHigh: `File Size at High Quality: ${megabyesHigh} Megabytes`,
      filesizeExtreme: `File Size at Extreme Quality: ${megabyesExtreme} Megabytes`,
    });
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

  render() {
    return (
      // <div style={{ height: 300, backgroundColor: 'red' }}>Playlist</div>
      <div className="playlist">
        <div>
          <form onSubmit={this.submitUrl}>
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
              label="Submit"
            />
        </form>
          <img src={this.state.playlistAlbumArt} className="App-logo" alt="Album Art" />
          <div className="playlistMain">
          <div >{this.state.playlistName}</div>
          <div >{this.state.playlistDisplayUsername}</div>
          <div >{this.state.playlistFollowers}</div>
        </div>
        </div>
        <div className="playlistInfo">
          <h4>{this.state.filesizeNormal}</h4>
          <h4>{this.state.filesizeHigh}</h4>
          <h4>{this.state.filesizeExtreme}</h4>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
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
