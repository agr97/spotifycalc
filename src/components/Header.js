import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui';
import blankUser from '../blankuser.png';
import loginbutton from '../loginbutton.png';
import logoutbutton from '../logoutbutton.png';
import SpotifyWebApi from 'spotify-web-api-node';
import '../styles/Header.css';

class HeaderClass extends Component {
  constructor(props) {
    super(props);

    const scopes = ['user-read-birthdate', 'user-read-email', 'user-read-private', 'playlist-read-private'];
    const generateRandomString = N => (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);
    const spotifyApi = new SpotifyWebApi({
      clientId: '4cc10ec7899f45838fb6ee2fbad9f568',
      redirectUri: 'http://localhost:3000/callback',
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
    if (this.props.isLoggedIn && this.props.fetchingUserData) {
      return (
        <CircularProgress />
      );
    }
    
    if (this.props.isLoggedIn && !this.props.fetchingUserData) {
      const { userData } = this.props;
      const profilePicture = userData.images[0] ? userData.images[0].url : blankUser;
      const displayName = userData.display_name || userData.id;
      let country = userData.country;
      let followers = userData.followers.total;
      const accountType = (['open', 'free'].indexOf(userData.product) >= 0)
        ? 'Free'
        : 'Premium';

      return (
        <div>
          <div className="topbar">
            <div className="title">Playlist Calculator</div>
            <img src={logoutbutton} onClick={this.props.logout} className="button"/>
          </div>
          <div className="bottombar">
            <img src={profilePicture} className="profilepic"/>
            <div className="accountdetails">
              <div className="accountdetailsitems">{displayName}</div>
              <div className="accountdetailsitems">{accountType} Account</div>
              <div className="accountdetailsitems">Country: {country}</div>
              <div className="accountdetailsitems">Followers: {followers}</div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <div className="topbar">
          <div className="title">Playlist Calculator</div>
          <a href={this.state.loginUrl}><img src={loginbutton} className="button" /></a>
        </div>
        <div className="bottombar">
          <div className="description">Returns statistics about a Spotify Playlist.</div>
          <div className="logintext">Login using Spotify to access your playlists.</div>
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
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'LOGOUT' }),
});


const Header = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderClass);


export default Header;