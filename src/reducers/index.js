import {combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';

import updatePlaylist from './playlist';

const rootReducer = combineReducers({updatePlaylist, routing: routerReducer});

export default rootReducer;