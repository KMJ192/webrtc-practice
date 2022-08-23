import type { Api } from './types';

/**
 * fetch api를 사용
 */
const api: Api = (function () {
  let serverAddr = '';

  /**
   * http request 요청
   * @param url - http request url
   * @param option - 요청 정보
   */
  async function useRequest(
    url: string,
    option: { [key: string]: any } = {},
  ): Promise<any> {
    const requestUrl = serverAddr ? `${serverAddr}${url}` : url;
    try {
      const response = await fetch(requestUrl, option);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      throw e;
    }
    return;
  }

  /**
   * api에서 사용할 기본 url 지정
   * @param url
   */
  function useGlobalUrl(url?: string) {
    serverAddr = url || '';
  }

  return {
    useRequest,
    useGlobalUrl,
  };
})();

export const { useRequest, useGlobalUrl } = api;
export default api;
