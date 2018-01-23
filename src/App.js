import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import blankalbum from './blankalbumart.png';
import { Paper, TextField, RaisedButton, Tabs, Tab, FlatButton} from 'material-ui';
import './App.css';
import socketIo from 'socket.io-client';
import url from 'url';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import SpotifyWebApi from 'spotify-web-api-node';

const socket = socketIo.connect();

const RedView = () => (
  <div style={{ height: 300, backgroundColor: "red" }}>Red</div>
);
const BlueView = () => (
  <div style={{ height: 300, backgroundColor: "blue" }}>Blue</div>
);
const GreenView = () => (
  <div style={{ height: 300, backgroundColor: "green" }}>Green</div>
);
const YellowView = () => (
  <div style={{ height: 300, backgroundColor: "yellow" }}>Yellow</div>
);
const OtherColorView = ({ match }) => (
  <div style={{ height: 300, backgroundColor: match.params.color }}>{match.params.color}</div>
)

class App extends Component {
  constructor(props) {
    super(props);
    const scopes = ['user-read-private', 'user-read-email'];
    const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);
    const spotifyApi = new SpotifyWebApi({
      clientId: '4cc10ec7899f45838fb6ee2fbad9f568',
      // clientSecret: '31fe4f464d5f42ecb69c6ebb2494bec9',
      redirectUri: 'http://localhost:3000/callback',
    });
    const state = generateRandomString(16);
    var url = spotifyApi.createAuthorizeURL(scopes, state);
    console.log(url);

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
      filesizeExtreme: '',
      loginurl: url,
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
       
        <div>         
    
       <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
          tabItemContainerStyle={{ position: 'fixed', bottom: '0' }}
        >
          <Tab label="Tab One" value={0} />
          <Tab label="Tab Two" value={1} />
          <Tab label="Tab Three" value={2} />
        </Tabs>
           
        
        <div>
        <Link to="/red">Red</Link> |
        <Link to="/blue">Blue</Link> | 
        <Link to="/green">Green</Link> | 
        <Link to="/yellow">Yellow</Link> | 
        <Link to="/other/palevioletred">Pale Violet Red</Link> | 
        <Link to="/other/saddlebrown">Saddle Brown</Link>
        </div>
        

      <SwipeableRoutes>
        <Route path="/" component={RedView} />
        <Route path="/blue" component={BlueView} />
        <Route path="/green" component={GreenView} />
        <Route path="/yellow" component={YellowView} />
        <Route path="/other/:color" component={OtherColorView} defaultParams={{color: 'grey'}} />
      </SwipeableRoutes>
      
        </div>

        <FlatButton label="Default" href={this.state.loginurl} />

      </MuiThemeProvider>
    );
  }
}

export default App;
