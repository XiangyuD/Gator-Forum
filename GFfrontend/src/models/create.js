import { router } from 'umi';
import { createGroup, createPost } from '@/services/create';

const Model = {
  namespace: 'create',
  state: {
    status: undefined, //data: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(createGroup, payload);
      yield put({
        type: 'save',
        payload: response,
      });

      const response2 = yield call(createPost, payload);
      yield put({
        type: 'save2',
        payload: response2,
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
    save2(state, action) {
        return {
          ...state,
          data: action.payload,
        };
    },
  },
};