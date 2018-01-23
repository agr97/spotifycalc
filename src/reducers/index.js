import {combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';

import updatePlaylist from './playlist';

const rootReducer = combineReducers({ updatePlaylist, router: routerReducer });

export default rootReducer;
