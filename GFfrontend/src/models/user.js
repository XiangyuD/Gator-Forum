import { router } from 'umi';
import { addFollowing, currentUser, createReply, getRelation, removeLike, createLike, removeCollection, createCollection, changePassword, checkMember, queryCurrent, quitGroup, joinGroup, getPersonalFollower, getPersonalBlacklist, getPersonalCollection, getPersonalFollowing, removeFollower, removeFollowing, removeBlacklist } from '@/services/user';

const Model = {
  namespace: 'user',
  state: {
    status: undefined, //data: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(checkMember, payload);
      yield put({
        type: 'save',
        payload: response,
      });

      const response2 = yield call(queryCurrent, payload);
      yield put({
        type: 'save2',
        payload: response2,
      });

      const response3 = yield call(quitGroup, payload);
      yield put({
        type: 'save3',
        payload: response3,
      });

      const response4 = yield call(joinGroup, payload);
      yield put({
        type: 'save4',
        payload: response4,
      });

      const response5 = yield call(getPersonalFollower, payload);
      yield put({
        type: 'save5',
        payload: response5,
      });

      const response6 = yield call(getPersonalBlacklist, payload);
      yield put({
        type: 'save6',
        payload: response6,
      });

      const response7 = yield call(getPersonalCollection, payload);
      yield put({
        type: 'save7',
        payload: response7,
      });

      const response8 = yield call(getPersonalFollowing, payload);
      yield put({
        type: 'save8',
        payload: response8,
      });

      const response9 = yield call(removeFollower, payload);
      yield put({
        type: 'save9',
        payload: response9,
      });

      const response10 = yield call(removeFollowing, payload);
      yield put({
        type: 'save10',
        payload: response10,
      });

      const response11 = yield call(removeBlacklist, payload);
      yield put({
        type: 'save11',
        payload: response11,
      });

      const response12 = yield call(changePassword, payload);
      yield put({
        type: 'save12',
        payload: response12,
      });

      const response13 = yield call(removeCollection, payload);
      yield put({
        type: 'save13',
        payload: response13,
      });

      const response14 = yield call(removeLike, payload);
      yield put({
        type: 'save14',
        payload: response14,
      });

      const response15 = yield call(getRelation, payload);
      yield put({
        type: 'save15',
        payload: response15,
      });

      const response16 = yield call(createLike, payload);
      yield put({
        type: 'save16',
        payload: response16,
      });

      const response17 = yield call(createCollection, payload);
      yield put({
        type: 'save17',
        payload: response17,
      });

      const response18 = yield call(createReply, payload);
      yield put({
        type: 'save18',
        payload: response18,
      });

      const response19 = yield call(createReply, payload);
      yield put({
        type: 'save19',
        payload: response19,
      });

      const response20 = yield call(addFollowing, payload);
      yield put({
        type: 'save20',
        payload: response20,
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
    save9(state, action) {
        return {
          ...state,
          data: action.payload,
        };
      },
    save10(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save11(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save12(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save13(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save14(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save15(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save16(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save17(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save18(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save19(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save20(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};