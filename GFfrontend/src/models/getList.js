import { router } from 'umi';
import { queryList } from '@/services/getList';

const Model = {
  namespace: 'getList',
  state: {
    status: undefined, //data: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'save',
        payload: response,
      })
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
