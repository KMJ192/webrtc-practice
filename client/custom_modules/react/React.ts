import { ActionType } from '@redux/types';
import {
  ReactType,
  ReactClosureOptions,
  ReactDOM,
  ProviderType,
} from './types';
import { createDOM, debounceFrame, isProvider } from './utils';

const React: ReactType = (function () {
  /**
   * React 클로저 옵션
   */
  const _this: ReactClosureOptions = {
    // state 배열
    states: [],
    // state 배열 index
    stateKey: 0,
    // root 노드
    root: null,
    // react 컴포넌트
    component: null,
    // useEffect unmount 함수
    componentUnmount: undefined,
    // dom api를 사용하는 공간
    injected: {
      event: [],
      unmount: [],
    },
    // redux store
    store: undefined,
    // redux state
    reduxState: undefined,
  };

  /**
   * 컴포넌트 렌더링 기능
   * requestAnimationFrame으로 렌더링 횟수 제한
   */
  const reactRenderer = debounceFrame(() => {
    const { root, component } = _this;
    if (!root || !component) return;
    const vDOM: ReactDOM[] | ReactDOM | null = component();
    root.innerHTML = '';
    createDOM(root as HTMLElement, vDOM);
    _this.stateKey = 0;
    _this.injected.event.forEach((event: () => void) => {
      const unmount = event();
      if (unmount !== undefined) {
        _this.injected.unmount?.push(unmount);
      }
    });
    _this.injected.event = [];
  });

  /**
   * 상태관리 시스템
   * @param initState - 제너릭 타입 상태 및 상태 업데이트 기능 제공
   * @returns [state, setState] - 상태, 상태 업데이트 함수
   */
  function useState<T = undefined>(initState: T): [T, (newVal: T) => void] {
    const { states, stateKey: key } = _this;
    if (states.length === key) states.push(initState);
    const state = states[key];
    const setState = (newState: T) => {
      if (newState === state) return;
      if (JSON.stringify(newState) === JSON.stringify(state)) return;

      states[key] = newState;
      reactRenderer();
    };
    _this.stateKey += 1;
    return [state, setState];
  }

  /**
   * 상태관리 시스템, 렌더링을 진행하지 않음
   * @param initState - 제너릭 타입 상태 및 상태 업데이트 기능 제공
   * @returns [state, setState] - 상태, 상태 업데이트 함수
   */
  function useStateNoRender<T = undefined>(
    initState: T,
  ): [() => T, (newVal: T) => void] {
    const { states, stateKey: key } = _this;
    if (states.length === key) states.push(initState);
    const st = states[key];
    const setState = (newState: T) => {
      if (newState === st) return;
      if (JSON.stringify(newState) === JSON.stringify(st)) return;

      states[key] = newState;
    };

    const state = () => {
      return states[key];
    };

    _this.stateKey += 1;

    return [state, setState];
  }

  /**
   * 컴포넌트의 생명주기를 관리
   * @param effect - mount, update, unmount 컴포넌트 생명주기 관리
   * @param depsArray - 상태 비교를 위한 deps
   */
  function useEffect(effect: () => any, depsArray?: any[]) {
    const { states, stateKey: currStateKey } = _this;

    // 실제로 React는 Deps배열이 없으면 callback함수를 실행시킨다.
    const hasNoDeps = !depsArray;
    const deps = states[currStateKey];
    const hasChangedDeps: boolean = deps
      ? !depsArray?.every((el: any, i: number) => el === deps[i])
      : true;
    if (hasNoDeps || hasChangedDeps) {
      _this.componentUnmount = effect();
      states[currStateKey] = depsArray;
    }
    _this.stateKey++;
  }

  /**
   * 컴포넌트에서 document api를 사용하여 커스터마이징 로직 작성 지원
   * @param event
   */
  function useDocument(event: () => any) {
    _this.injected.event.push(event);
  }

  /**
   * redux에 상태를 dispatch할 수 있도록 하는 hook
   * @returns (action: ActionType) => void;
   */
  function useDispatch(type: string) {
    if (!_this.store) return;
    return (action?: ActionType) => {
      _this.store.dispatch(type)(action);
    };
  }

  /**
   * redux의 상태를 반환하는 hook
   * @returns redux state
   */
  function useSelector(selector: (state: any) => any) {
    return selector(_this.reduxState);
  }

  /**
   * React 받아온 컴포넌트를 클로저에 저장 후 렌더링 실행
   * @param component - React 컴포넌트
   * @param rootElement - root 노드
   */
  function render(
    component: () => ReactDOM[] | (() => ReactDOM) | ProviderType,
    rootElement: Element | null,
  ) {
    if (isProvider(component)) {
      // redux store를 포함한 provider 타입
      _this.store = component.store;
      _this.component = component.reactApp;
      _this.reduxState = _this.store.reduxState();

      // redux 구독
      _this.store.subscribe(() => {
        _this.reduxState = _this.store.reduxState();
      });
    } else {
      // 일반 ReactDOM 타입
      _this.component = component as unknown as
        | (() => ReactDOM[])
        | (() => ReactDOM);
    }
    _this.root = rootElement;
    reactRenderer();
  }

  /**
   * Routing시 렌더링 실행
   */
  function routeRenderer() {
    _this.states = [];
    if (_this.componentUnmount) {
      _this.componentUnmount();
      _this.componentUnmount = undefined;
    }

    if (_this.injected.unmount) {
      _this.injected.unmount.forEach((unmount) => {
        unmount();
      });
      _this.injected.unmount = [];
    }
    reactRenderer();
  }

  function reduxRenderer() {
    reactRenderer();
  }

  return {
    useState,
    useEffect,
    useDocument,
    useStateNoRender,
    useDispatch,
    useSelector,
    render,
    routeRenderer,
    reduxRenderer,
  };
})();

export const {
  useState,
  useEffect,
  useDocument,
  useStateNoRender,
  useDispatch,
  useSelector,
} = React;
export { ReactDOM };
export default React;
