import React, { Component } from 'react';
import { connect } from 'react-redux';
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

    const scopes = ['user-read-private', 'playlist-read-private', 'playlist-read-collaborative'];
    const generateRandomString = N => (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);
    const spotifyApi = new SpotifyWebApi({
      clientId: '4cc10ec7899f45838fb6ee2fbad9f568',
      //redirectUri: 'http://localhost:3000/callback', // Used for Development
      redirectUri: 'https://playlistcalcify.tk/callback', // Production Uri
    });
    const loginState = generateRandomString(16);
    const loginUrl = spotifyApi.createAuthorizeURL(scopes, loginState);

    this.state = {
      loginUrl,
    };

    this.LoginBox = this.LoginBox.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      setTimeout(() => this.props.logout(), 3590000);
    }
  }

  // center circular progess
  LoginBox() {
    if (this.props.loginFailure) {
      return (
        <div>
          <div className="headerTopbar">
            <div className="headerTitle">Playlist Calculator</div>
            <a href={this.state.loginUrl}><img src={loginbutton} className="headerButton" /></a>
          </div>
          <div className="headerBottombarLogout">
            <div className="headerDescription">Login Failed</div>
          </div>
        </div>
      );
    }

    if (this.props.isLoggedIn && this.props.fetchingUserData) {
      return (
        <div>
          <div className="headerTopbar">
            <div className="headerTitle">Playlist Calculator</div>
            <img src={logoutbutton} onClick={this.props.logout} className="headerButton"/>
          </div>
          <div className="headerLoading" >
           <CircularProgress style={{textAlign: 'right', marginRight: '40px', marginTop: '15px'}}/>
          </div>
        </div>
      );
    }
    
    if (this.props.isLoggedIn && !this.props.fetchingUserData) {
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
            <div className="headerTitle">Playlist Calculator</div>
            <img src={logoutbutton} onClick={this.props.logout} className="headerButton"/>
          </div>
          <div className="headerBottombarLogin">
            <div className="headerBottomBarTimerText">Logout In</div>
            <div className="headerBottomBarTimer">
              <ReactCountdownClock seconds={3590} color="#1DB954" size={65} />
            </div>
            <img src={profilePicture} className="headerProfilepic"/>
            <div className="headerAccountdetails">
              <div className="headerAccountdetailsitems">{displayName}</div>
              <div className="headerAccountdetailsitems">{accountType} Account</div>
              <div className="headerAccountdetailsitems">Country: {country}</div>
              <div className="headerAccountdetailsitems">Followers: {followers}</div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <div className="headerTopbar">
          <div className="headerTitle">Playlist Calculator</div>
          <a href={this.state.loginUrl}><img src={loginbutton} className="headerButton" /></a>
        </div>
        <div className="headerBottombarLogout">
          <div className="headerDescription">Returns statistics about a Spotify Playlist.</div>
          <div className="headerDetailText">Login using Spotify to access your playlists.</div>
          <div className="headerDetailText">Go to About for details about the Spotify Statistics.</div>
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

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'LOGOUT' }),
});


const Header = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderClass);


export default Header;
