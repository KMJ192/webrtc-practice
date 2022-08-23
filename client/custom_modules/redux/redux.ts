import React from '@react';

import { StateType, Reducers, ActionType } from './types';

// Action creator
const actionCreator =
  (type: string) =>
  (payload: { [key: string]: any }): StateType => ({
    type,
    payload,
  });

// 비동기 Action creator
const createAsyncAction = (
  request: string,
  response: string,
  error: string,
) => {
  return {
    request: actionCreator(request),
    success: actionCreator(response),
    failure: actionCreator(error),
  };
};

// Reducer combining
const combineReducers = (reducers: Reducers) => {
  return reducers;
};

/**
 * redux - 전역 상태관리 시스템
 */
const redux = (function () {
  // redux state
  let state: { [key: string]: any };

  // reducer 함수
  let reducers: Reducers;

  // redux 구독시에 대한 로직 배열
  const handlers: any = [];

  // reducer initalState 초기화를 위한 더미 데이어
  const initAction = {
    type: '',
  };

  let reduxStore: any;

  /**
   * reducer에 대한 store 생성
   * @param rootReducer - Combined reducers
   */
  const createStore = (rootReducer: Reducers) => {
    reducers = rootReducer;
    for (const [reducerName, reducer] of Object.entries(reducers)) {
      reducers = {
        ...reducers,
        [reducerName]: reducer,
      };
      state = {
        ...state,
        [reducerName]: reducer(undefined, initAction),
      };
    }

    /**
     * redux 구독
     * @param handler - 실행할 함수
     */
    const subscribe = (handler: any) => {
      handlers.push(handler);
    };

    /**
     * 새로운 action dispatch
     * @param type - dispatch할 대상
     * @param action - 갱신할 상태에 대한 action
     */
    const dispatch = (type: string) => (action: ActionType) => {
      const newState = reducers[type](state[type], action);
      if (state[type] === newState) return;
      if (JSON.stringify(state[type]) === JSON.stringify(newState)) return;
      state = {
        ...state,
        [type]: reducers[type](state[type], action),
      };
      handlers.forEach((handler: any) => {
        handler();
      });
      // redux 상태 변경에 대한 react rerendering
      React.reduxRenderer();
    };

    /**
     * redux의 상태를 반환
     * @returns state
     */
    const reduxState = () => {
      return state;
    };

    const store = { subscribe, dispatch, reduxState };

    reduxStore = store;
    return store;
  };

  /**
   * redux store의 dispatch를 사용
   * @param type dispatch 대상
   * @returns
   */
  function dispatch(type: string) {
    return reduxStore.dispatch(type);
  }

  return {
    createStore,
    dispatch,
  };
})();

export { actionCreator, createAsyncAction, combineReducers };
export const { createStore, dispatch } = redux;
export default redux;
