import React, { Component } from 'react';
import { Paper, Tabs, Tab } from 'material-ui';
import { Route } from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import '../styles/App.css';
import Header from './Header';
import Playlist from './Playlist';
import User from './User';
import Stats from './Stats';
import About from './About';

// Overrides the base material ui theme;
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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slideIndex: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(value) {
    this.setState({
      slideIndex: value,
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getTheme()}>
        <Paper>
          <div>
            <div className="header">
              <Header className="userbox" />
            </div>
            <div className="tabs">
              <Tabs
                onChange={this.handleTabChange}
                value={this.state.slideIndex}
                tabItemContainerStyle={{ }}
              >
                <Tab label="Playlist" value={0} />
                <Tab label="User" value={1} />
                <Tab label="Stats" value={2} />
                <Tab label="About" value={3} />
              </Tabs>
            </div>
          </div>

          <SwipeableRoutes
            onChangeIndex={this.handleTabChange}
            index={this.state.slideIndex}
            containerStyle={{ height: 'calc(100vh - 158px)' }}
            slideStyle={{ height: 'auto' }}
            disableLazyLoading
          >
            <Route path="/" component={Playlist} />
            <Route path="/user" component={User} />
            <Route path="/stats" component={Stats} />
            <Route path="/about" component={About} />
          </SwipeableRoutes>

        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default App;
