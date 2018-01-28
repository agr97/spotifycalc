import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import blankalbum from '../blankalbumart.png';
import { Paper, TextField, RaisedButton, Tabs, Tab, FlatButton } from 'material-ui';
import '../styles/App.css';
import socketIo from 'socket.io-client';
import url from 'url';
import { BrowserRouter as Router, Route, IndexRoute, browserHistory, Link } from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import SpotifyWebApi from 'spotify-web-api-node';

import UserBox from './UserBox'
import Playlist from './Playlist';
// import User from './User';
// import Stats from './Stats';
// import About from './About';

const BlueView = () => (
  <div style={{ height: 300, backgroundColor: 'blue' }}>Blue</div>
);
const GreenView = () => (
  <div style={{ height: 300, backgroundColor: 'green' }}>Green</div>
);
const YellowView = () => (
  <div style={{ height: 300, backgroundColor: 'yellow' }}>Yellow</div>
);

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
      filesizeExtreme: '',
    };
  }

  componentWillMount() {

  }


  // https://open.spotify.com/user/nonnoobgod/playlist/2eIlWTq7gSFGZJXnu0I5DP
  // (\/user\/)+(\w+)+(\/playlist\/)+(\w+)


  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div>
        <div className="header">
          <h1 className="App-title">Spotify Calc</h1>
          <UserBox />
        </div>
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
            <Link to="/">Playlist</Link> |
            <Link to="/user">User</Link> |
            <Link to="/stats">Stats</Link> |
            <Link to="/about">About</Link> |
          </div>


          <SwipeableRoutes>
            <Route path="/" component={Playlist} />
            <Route path="/user" component={BlueView} />
            <Route path="/stats" component={GreenView} />
            <Route path="/about" component={YellowView} />
          </SwipeableRoutes>

        </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;