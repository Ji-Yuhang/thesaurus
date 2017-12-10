import * as usersService from '../services/UserService';
import _ from 'lodash'
import {getAuthenticationToken} from "../utils/authentication";
import {refreshUser} from "../services/UserService";
import { routerRedux } from 'dva/router';

export default {
  namespace: 'auth',
  state: {
    user: null
  },
  reducers: {
    save(state, { payload: user }) {
      return { ...state, user };
    },
  },
  effects: {
    // *fetch({ payload: { page=1 } }, { call, put }) {
    //   const { data, headers } = yield call(usersService.fetch, { page });
    //   yield put({
    //      type: 'save',
    //     payload: {
    //       data,
    //       total: parseInt(headers['x-total-count'], 10),
    //       page: parseInt(page, 10),
    //     },
    //   });
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        console.log('history.listen',pathname,query)
          // if
        const token = getAuthenticationToken()
        // console.log('getAuthenticationToken', token)

        if (pathname != '/sign_in') {
          if (_.isEmpty(token)) {
            dispatch(routerRedux.push('/sign_in'));
            console.log('dispatch sign_in', dispatch, routerRedux)
          } else {
            refreshUser().then((data)=>{
              dispatch({
                type: 'auth/save',
                payload: data.user,
              });
            }).catch((error)=>{
              dispatch({
                type: 'auth/save',
                payload: null,
              });
              dispatch(routerRedux.push('/sign_in'));

            })
          }

        }

      });
    },
  },
};
