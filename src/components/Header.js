import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import { CircularProgress } from 'material-ui';
import SpotifyWebApi from 'spotify-web-api-node';
import ReactCountdownClock from 'react-countdown-clock';
import blankUser from '../blankuser.png';
import loginbutton from '../loginbutton.png';
import logoutbutton from '../logoutbutton.png';
import '../styles/Header.css';

class HeaderClass extends Component {
  constructor(props) {
    super(props);

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.REACT_APP_clientId,
      redirectUri: process.env.REACT_APP_redirectUri,
    });
    const scopes = ['user-read-private', 'playlist-read-private', 'playlist-read-collaborative'];
    const loginState = (Math.random().toString(36) + Array(16).join('0')).slice(2, 16 + 2);
    const loginUrl = spotifyApi.createAuthorizeURL(scopes, loginState);

    this.state = {
      loginUrl,
    };

    this.LoginBox = this.LoginBox.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      setTimeout(() => store.dispatch({ type: 'LOGOUT' }), 3590000);
    }
  }

  // center circular progess
  LoginBox() {
    if (this.props.loginFailure) {
      return (
        <div>
          <div className="headerTopbar">
            <div className="headerTitle">Playlist Calcify</div>
            <a href={this.state.loginUrl}><img src={loginbutton} className="headerButton" /></a>
          </div>
          <div className="headerBottombarLogout">
            <div className="headerDescription">Login Failed</div>
          </div>
        </div>
      );
    }

    if (this.props.fetchingUserData) {
      return (
        <div>
          <div className="headerTopbar">
            <div className="headerTitle">Playlist Calcify</div>
            <img src={logoutbutton} onClick={() => store.dispatch({ type: 'LOGOUT' })} className="headerButton" />
          </div>
          <div className="headerBottombar" >
            <CircularProgress style={{ textAlign: 'right', marginRight: '40px', marginTop: '15px' }} />
          </div>
        </div>
      );
    }

    if (this.props.isLoggedIn) {
      const { userData } = this.props;
      const profilePicture = userData.images[0] ? userData.images[0].url : blankUser;
      const displayName = userData.display_name || userData.id;
      const country = userData.country;
      const followers = userData.followers.total;
      const accountType = (['open', 'free'].indexOf(userData.product) >= 0)
        ? 'Free'
        : 'Premium';

      return (
        <div>
          <div className="headerTopbar">
            <div className="headerTitle">Playlist Calcify</div>
            <img src={logoutbutton} onClick={() => store.dispatch({ type: 'LOGOUT' })} className="headerButton" />
          </div>
          <div className="headerBottombar">
            <div className="headerBottomBarTimerText">Logout In</div>
            <div className="headerBottomBarTimer">
              <ReactCountdownClock seconds={3590} color="#1DB954" size={65} />
            </div>
            <img src={profilePicture} className="headerProfilepic" />
            <div className="headerAccountdetails">
              <div>{displayName}</div>
              <div>{accountType} Account</div>
              <div>Country: {country}</div>
              <div>Followers: {followers}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="headerTopbar">
          <div className="headerTitle">Playlist Calcify</div>
          <a href={this.state.loginUrl}><img src={loginbutton} className="headerButton" /></a>
        </div>
        <div className="headerBottombar">
          <div className="headerDescription">Returns statistics about a Spotify Playlist.</div>
          <div className="headerDetailText">Login using Spotify to access your playlists.</div>
          <div className="headerDetailText">Go to About for details about Statistics.</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.LoginBox()}
      </div>
    );
  }
}


const mapStateToProps = state => ({
  userData: state.userBox.userData,
  fetchingUserData: state.userBox.fetchingUserData,
  isLoggedIn: state.userBox.isLoggedIn,
  loginFailure: state.userBox.loginFailure,
});

const Header = connect(mapStateToProps)(HeaderClass);


export default Header;
