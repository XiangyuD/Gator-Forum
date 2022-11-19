import { router } from 'umi';
import { getPost, getLike, getCollection, getReply, updatePost } from '@/services/getPost';

const Model = {
  namespace: 'getPost',
  state: {
    status: undefined, //data: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getPost, payload);
      yield put({
        type: 'save',
        payload: response,
      });

      const response2 = yield call(getLike, payload);
      yield put({
        type: 'save2',
        payload: response2,
      });

      const response3 = yield call(getCollection, payload);
      yield put({
        type: 'save3',
        payload: response3,
      });

      const response4 = yield call(getReply, payload);
      yield put({
        type: 'save4',
        payload: response4,
      });

      const response5 = yield call(updatePost, payload);
      yield put({
        type: 'save5',
        payload: response5,
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
    save3(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save4(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save5(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
