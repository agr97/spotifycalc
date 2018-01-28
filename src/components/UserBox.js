import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import blankUser from '../blankuser.png';
import SpotifyWebApi from 'spotify-web-api-node';
import url from 'url';
import queryString from 'query-string';
import socketIo from 'socket.io-client';
import { store } from '../store';

class UserBoxClass extends Component {
  constructor(props) {
    super(props);

    const scopes = ['user-read-birthdate', 'user-read-email', 'user-read-private', 'playlist-read-private'];
    const generateRandomString = N => (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);
    const spotifyApi = new SpotifyWebApi({
      clientId: '4cc10ec7899f45838fb6ee2fbad9f568',
      redirectUri: 'http://localhost:3000/callback',
    });
    const state = generateRandomString(16);
    const loginUrl = spotifyApi.createAuthorizeURL(scopes, state, true);

    const loggedin = false;
    const parsedcallbackUrl = queryString.parse(url.parse(props.callbackUrl).search);

    // store.dispatch({ type: 'server/hello', data: 'Hello!' });
    // you should automatically send the access token all the start
    // from either the client or the server

    store.subscribe(() => {
      const api = store.getState().userBox.userApi;
      async function login() {
        try {
          Object.setPrototypeOf(api, SpotifyWebApi.prototype);
          const userdata = await api.getMe();
          console.log(userdata);
        } catch (err) {
          console.log(err);
        }
      }

      if (api !== '') {
        login();
      } else {
        console.log('api not loaded yet');
      }
    });

    if (parsedcallbackUrl.code !== undefined && parsedcallbackUrl.state.length === 16) {
      console.log(parsedcallbackUrl.code);
      store.dispatch({ type: 'server/requestUserToken', data: parsedcallbackUrl.code });
    }


    this.state = {
      isLoggedIn: loggedin,
      // currentUser: props.userBox.user,
      loginUrl,
    };

    this.Greeting = this.Greeting.bind(this);
  }


  Greeting() {
    if (this.state.isLoggedIn) {
      return (<p>test</p>);
    }
    return (<FlatButton className="App-title" label="Login" href={this.state.loginUrl} />);
  }

  render() {
    return (
      <div>
        {this.Greeting()}
      </div>
    );
  }
}


const mapStateToProps = state => ({
  callbackUrl: state.userBox.callbackUrl,
});

const mapDispatchToProps = dispatch => ({

});


const UserBox = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserBoxClass);


export default UserBox;
