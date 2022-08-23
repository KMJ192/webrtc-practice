interface Api {
  useRequest: (url: string, option?: { [key: string]: any }) => Promise<any>;
  useGlobalUrl: (url: string) => void;
}

export type { Api };
