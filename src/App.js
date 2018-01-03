import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import blankalbum from './blankalbumart.png';
import { Paper, TextField, RaisedButton } from 'material-ui';
import './App.css';
import socketIo from 'socket.io-client';
import url from 'url';

const socket = socketIo.connect();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedPlaylist: '',
      playlistUrl: '',
      playlistAlbumArt: blankalbum,
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
      filesizeExtreme: ''
    };

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.submitUrl = this.submitUrl.bind(this);
    this.updatePlaylistInfo = this.updatePlaylistInfo.bind(this);
  }

  componentDidMount() {

  }

  updatePlaylistInfo(playlist, playlistlength) {
    if (playlist.owner.display_name === null) {
      this.setState({ playlistDisplayUsername: playlist.owner.id });
    } else {
      this.setState({ playlistDisplayUsername: playlist.owner.display_name });
    }

    const totalseconds = playlistlength / 1000;
    let megabyesNormal = (totalseconds * 12 / 1024).toFixed(2);
    let megabyesHigh = (totalseconds * 20 / 1024).toFixed(2);
    let megabyesExtreme = ((totalseconds * 40) / 1024).toFixed(2);

    this.setState({
      playlistAlbumArt: playlist.images[0].url,
      playlistName: playlist.name,
      playlistID: playlist.id,
      playlistUsername: playlist.owner.id,
      playlistFollowers: playlist.followers.total + ' Followers',
      filesizeNormal: 'File Size at Normal Quality: ' + megabyesNormal  + ' Megabytes',
      filesizeHigh: 'File Size at High Quality: ' + megabyesHigh + ' Megabytes',
      filesizeExtreme: 'File Size at Extreme Quality: ' + megabyesExtreme  + ' Megabytes',
    });
    
  }

  submitUrl(event) {
    event.preventDefault();

    if (this.state.playlistLoaded
      && this.state.textbarID === this.state.playlistID
      && this.state.textbarUsername === this.state.playlistUsername) {
      this.setState({ errorText: 'Already Loaded This Playlist', validUrl: false });
    } else {
      socket.emit(
        'recieveClientPlaylist',
        { username: this.state.textbarUsername, id: this.state.textbarID },
        (error, playlist, playlistlength) => {
          if (error !== 'err') {
            this.setState({ loadedPlaylist: playlist, playlistLoaded: true });
            this.updatePlaylistInfo(playlist, playlistlength);
          } else {
            this.setState({ errorText: 'Playlist Not Found on Spotify Servers', validUrl: false });
          }
        },
      );
    }
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

  // https://open.spotify.com/user/nonnoobgod/playlist/2eIlWTq7gSFGZJXnu0I5DP
  // (\/user\/)+(\w+)+(\/playlist\/)+(\w+)

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Paper className="header">
          <h1 className="App-title">Spotify Calc</h1>
          <div>Filesize information about a Spotify playlist</div>
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
        </Paper>
        <Paper className="playlist">
          <img src={this.state.playlistAlbumArt} className="App-logo" alt="Album Art" />
          <div className="playlistMain">
            <div >{this.state.playlistName}</div>
            <div >{this.state.playlistDisplayUsername}</div>
            <div >{this.state.playlistFollowers}</div>
          </div>
        </Paper>
        <Paper className="playlistInfo">
          <h4>{this.state.filesizeNormal}</h4>
          <h4>{this.state.filesizeHigh}</h4>
          <h4>{this.state.filesizeExtreme}</h4>
        </Paper>

      </MuiThemeProvider>
    );
  }
}

export default App;
