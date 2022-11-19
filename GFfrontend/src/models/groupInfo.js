import { router } from 'umi';
import { getGroupPosts, getCreatedGroup, getJoinedGroup, getGroupBasic } from '@/services/getGroupInfo';

const Model = {
  namespace: 'getGroupInfo',
  state: {
    status: undefined, //data: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getGroupPosts, payload);
      yield put({
        type: 'save',
        payload: response,
      });

      const response2 = yield call(getCreatedGroup, payload);
      yield put({
        type: 'save2',
        payload: response2,
      });

      const response3 = yield call(getJoinedGroup, payload);
      yield put({
        type: 'save3',
        payload: response3,
      });

      const response4 = yield call(getGroupBasic, payload);
      yield put({
        type: 'save4',
        payload: response4,
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
  },
};