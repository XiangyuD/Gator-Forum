import { router } from 'umi';
import { getBasicInfo, getAnalysis, getMember, getNotification, updateGroupInfo, deleteGroup, deleteMember, deletePost } from '@/services/login';

const Model = {
  namespace: 'getGroup',
  state: {
    status: undefined, //data: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getBasicInfo, payload);
      yield put({
        type: 'save',
        payload: response,
      });

      const response2 = yield call(getAnalysis, payload);
      yield put({
        type: 'save2',
        payload: response2,
      });

      const response3 = yield call(getMember, payload);
      yield put({
        type: 'save3',
        payload: response3,
      });

      const response4 = yield call(getNotification, payload);
      yield put({
        type: 'save4',
        payload: response4,
      });

      const response5 = yield call(updateGroupInfo, payload);
      yield put({
        type: 'save5',
        payload: response5,
      });

      const response6 = yield call(deleteGroup, payload);
      yield put({
        type: 'save6',
        payload: response6,
      });

      const response7 = yield call(deleteMember, payload);
      yield put({
        type: 'save7',
        payload: response7,
      });

      const response8 = yield call(deletePost, payload);
      yield put({
        type: 'save8',
        payload: response8,
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
    save6(state, action) {
        return {
          ...state,
          data: action.payload,
        };
      },
    save7(state, action) {
        return {
          ...state,
          data: action.payload,
        };
      },
    save8(state, action) {
        return {
          ...state,
          data: action.payload,
        };
      },
  },
};