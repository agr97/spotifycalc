import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import blankalbum from './blankalbumart.png';
import { Paper } from 'material-ui';
import './App.css';
import socketIo from 'socket.io-client';

const socket = socketIo.connect();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistUrl: '',
      playlistAlbumArt: blankalbum,
    };
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Paper className="header">
          <header>
            <h1 className="App-title">Spotify Calc</h1>
            <h2>Filesizes and other various information about a playlist</h2>            
          </header>
        </Paper>
        <Paper className="playlist">
          <img src={this.state.playlistAlbumArt} className="App-logo" alt="Album Art" />
        </Paper>
        <Paper className="playlistInfo">

        </Paper>
        
      </MuiThemeProvider>
      /**
      <div className="App">
        <header className="App-header">
          <img src={blankalbum} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
      */
    );
  }
}

export default App;
