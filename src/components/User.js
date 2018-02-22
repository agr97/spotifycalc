import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CircularProgress, List, ListItem } from 'material-ui';
import { store } from '../store';
import { GETPLAYLIST } from '../actions/actionCreators';
import blankalbumart from '../blankuser.png';
import '../styles/User.css';

class UserClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.UserBox = this.UserBox.bind(this);
    this.onClickPlaylist = this.onClickPlaylist.bind(this);
  }

  onClickPlaylist(playlist) {
    store.dispatch(GETPLAYLIST(playlist.owner.id, playlist.id));
    this.props.history.push('/');
  }

  UserBox() {
    if (!this.props.isLoggedIn) {
      return (
        <div className="userCenteredItem">
          Must be logged in to view your playlists
        </div>
      );
    }

    if (this.props.userPlaylists === '' || this.props.fetchingUserPlaylists) {
      return (
        <div className="userCenteredItem">
          <CircularProgress />
        </div>
      );
    }

    if (this.props.userPlaylists.total === 0) {
      return (
        <div className="userCenteredItem">
          No playlists found for this user
        </div>
      );
    }

    const userPlaylists = this.props.userPlaylists.items.map(playlist =>
      (<ListItem onClick={() => this.onClickPlaylist(playlist)} innerDivStyle={{ padding: '10px', overflow: 'auto'}}>
        <div className="userPlaylistMain">
          <img className="userPlaylistImage" src={playlist.images.length === 0 ? blankalbumart : playlist.images[0].url} />
          <div className="userPlaylistTitle">{playlist.name}</div>
        </div>
      </ListItem>));

    return (
      <div>
        <List>
          {userPlaylists}
        </List>
      </div>
    );
  }

  render() {
    return (
      <div className="user">
        {this.UserBox()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userData: state.userBox.userData,
  fetchingUserPlaylists: state.userBox.fetchingUserPlaylists,
  fetchingUserApi: state.userBox.fetchingUserApi,
  fetchingUserData: state.userBox.fetchingUserData,
  isLoggedIn: state.userBox.isLoggedIn,
  userPlaylists: state.userBox.userPlaylists,
});


const User = connect(mapStateToProps)(UserClass);


export default User;

