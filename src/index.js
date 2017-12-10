import dva from 'dva';
import './index.css';
import createLoading from 'dva-loading';
import * as configuration from './utils/configuration';
import _ from "lodash";
import {refreshUser} from "./services/UserService";
import {dispatch} from "redux";
import {getAuthenticationToken, setAuthenticationToken} from "./utils/authentication";

// 1. Initialize
const app = dva();
const API_ROOT = '';
configuration.setConfiguration('API_ROOT', API_ROOT);

// setAuthenticationToken('GWVznMRLpFDi4xvfF2yw')
// setAuthenticationToken('bmQWFTsX9EYsRHf_CU5A')


// 2. Plugins
// app.use({});
app.use(createLoading());
// 3. Model
// TODO: remove comment if support user system
// app.model(require('./models/auth'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

// const token = getAuthenticationToken()
// if (!_.isEmpty(token)){
//   refreshUser().then((data)=>{
//     dispatch({
//       type: 'auth/save',
//       payload: data.user,
//     });
//   })
//
// }
