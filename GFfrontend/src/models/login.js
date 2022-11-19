import { router } from 'umi';
import { login } from '@/services/login';

const Model = {
  namespace: 'login',
  state: {
    status: undefined, //data: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
