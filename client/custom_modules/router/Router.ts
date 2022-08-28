import React from '@react';
import type { ReactDOM } from 'custom_modules/react';
import type { RouterType } from './types';

window.addEventListener('popstate', () => {
  React.routeRenderer();
});

/**
 * Router
 */
const Router = (function () {
  let query: { [key: string]: string } = {};

  /**
   *
   * @param MainPage - 기본 url react 컴포넌트
   * @param NotFound - 찾지 못한 url react 컴포넌트
   * @param components - react 컴포넌트
   * @returns react 컴포넌트
   */
  function useRouter(
    MainPage: () => ReactDOM,
    NotFound: () => ReactDOM,
    components?: RouterType[],
  ): ReactDOM {
    if (components === undefined) return MainPage();
    query = {};
    if (components.length === 0) {
      return MainPage();
    }

    const { pathname } = location;
    if (pathname === '/') return MainPage();

    for (const component of components) {
      const { exact, path, element, queryString } = component;
      if (queryString === true) {
        const nowPath = pathname.split('/');
        const objPath = path.split('/');
        if (nowPath.length === objPath.length) {
          const pathLen = nowPath.length;
          for (let i = 0; i < pathLen; i++) {
            if (objPath[i].length > 0 && objPath[i][0] === ':') {
              query = {
                ...query,
                [objPath[i].substring(1)]: nowPath[i],
              };
            } else if (objPath[i] !== nowPath[i]) {
              return NotFound();
            }
          }
          return element();
        }
      }

      if (
        (exact === true && pathname === path) ||
        (!exact && pathname.indexOf(path) >= 0)
      ) {
        return element();
      }
    }

    return NotFound();
  }

  /**
   * url로 이동
   * @param url 이동할 url
   * @param data history.pushState에 입력할 data
   */
  function useRedirection(url: string, data?: { [key: string]: string }) {
    window.history.pushState(data, '', url);
    React.routeRenderer();
  }

  /**
   * query string을 사용한 url의 정보 반환
   * @returns query
   */
  function useParam() {
    return query;
  }

  return {
    useRouter,
    useRedirection,
    useParam,
  };
})();

export const { useRouter, useRedirection, useParam } = Router;
export default Router;
