import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

import blankalbum from '../blankalbumart.png';
import { Paper, TextField, RaisedButton, Tabs, Tab, FlatButton } from 'material-ui';
import '../styles/App.css';
import socketIo from 'socket.io-client';
import url from 'url';
import { BrowserRouter as Router, Route, IndexRoute, browserHistory, Link } from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import SpotifyWebApi from 'spotify-web-api-node';

import Header from './Header';
import Playlist from './Playlist';
// import User from './User';
// import Stats from './Stats';
// import About from './About';

const getTheme = () => {
  const overwrites = {
    fontFamily: 'Montserrat, sans-serif',
    palette: {
      primary1Color: '#1DB954',
      primary2Color: '#1DB954',
      accent1Color: '#1DB954',
      accent2Color: '#1DB954',
      accent3Color: '#1DB954',
      canvasColor: '#181818',
    },
    tabs: {
      textColor: '#e8f5e9',
      selectedTextColor: '#212121',
      backgroundColor: '#1DB954',
    },
  };
  return getMuiTheme(baseTheme, overwrites);
};

const ViewGen = (height, backgroundColor) => () => (
  <div style={{ height, backgroundColor }}>
    backgroundColor
  </div>
);
const BlueView = ViewGen('100px', 'blue');
const GreenView = ViewGen('300px', 'green');
const YellowView = ViewGen('800px', 'yellow');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slideIndex: 0,
      playlistAlbumArt: blankalbum,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  // https://open.spotify.com/user/nonnoobgod/playlist/2eIlWTq7gSFGZJXnu0I5DP
  // (\/user\/)+(\w+)+(\/playlist\/)+(\w+)

  handleTabChange(value) {
    this.setState({
      slideIndex: value,
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getTheme()}>
        <Paper>
          <div className="header">
          <Header className="userbox" />
          </div>
          <div className="tabs">
            <Tabs
            onChange={this.handleTabChange}
            value={this.state.slideIndex}
            tabItemContainerStyle={{  }} //height: '10vh'
          >
            <Tab label="Playlist" value={0} />
            <Tab label="User" value={1} />
            <Tab label="Stats" value={2} />
            <Tab label="About" value={3} />
          </Tabs>
          </div>
          
            <SwipeableRoutes
            onChangeIndex={this.handleTabChange}
            index={this.state.slideIndex}
            containerStyle={{ height: '79vh' }}
          >
            <Route path="/" component={Playlist} />
            <Route path="/user" component={BlueView} />
            <Route path="/stats" component={GreenView} />
            <Route path="/about" component={YellowView} />
          </SwipeableRoutes>
          
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default App;
