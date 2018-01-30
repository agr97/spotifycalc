import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import blankUser from '../blankuser.png';
import SpotifyWebApi from 'spotify-web-api-node';

class UserBoxClass extends Component {
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
      isLoggedIn: props.isLoggedIn,
      currentUser: props.userData,
      loginUrl,
    };

    this.LoginBox = this.LoginBox.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      setTimeout(() => this.props.logout(), 3590000);
    }
  }

  LoginBox() {
    if (this.state.isLoggedIn) {
      return (<p>test</p>);
    }
    return (<FlatButton className="App-title" label="Login" href={this.state.loginUrl} />);
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
  callbackUrl: state.userBox.callbackUrl,
  userSpotifyApi: state.userBox.userSpotifyApi,
  clientSpotifyApi: state.userBox.clientSpotifyApi,
  isLoggedIn: state.userBox.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'LOGOUT' }),
});


const UserBox = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserBoxClass);


export default UserBox;
