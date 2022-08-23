const Storage = (function () {
  function useLocalStorage() {}

  function useSessionStorage() {}

  function useCookieStorage() {}

  return {
    useLocalStorage,
    useSessionStorage,
    useCookieStorage,
  };
})();

export const { useLocalStorage, useSessionStorage, useCookieStorage } = Storage;
export default Storage;
