import { Reducers } from '@redux/types';

interface ReactType {
  useState<T>(initState: T): [T, (newVal: T) => void];
  useState<T = undefined>(
    initState?: T,
  ): [T | undefined, (newVal: T | undefined) => void];
  useEffect(effect: () => any, deps?: readonly any[]): void;
  useDocument(event: () => void): any;
  useStateNoRender<T>(initState: T): [() => T, (newVal: T) => void];
  useStateNoRender<T = undefined>(
    initState?: T,
  ): [() => T | undefined, (newVal: T | undefined) => void];
  useDispatch: (type: string) => void;
  useSelector: (selector: (state: Reducers) => any) => any;
}

interface ReactClosureOptions {
  root: Element | null;
  stateKey: number;
  states: any[];
  component?: (() => ReactDOM[]) | (() => ReactDOM) | null;
  componentUnmount: (() => void)[];
  injected: {
    event: (() => any)[];
    unmount?: (() => any)[];
  };
  store?: any;
  reduxState?: { [key: string]: any };
}

interface ReactDOM {
  tagName: string;
  props?: {
    [key: string]: string;
  };
  event?:
    | {
        type: string;
        eventFunc: () => void;
      }
    | {
        type: string;
        eventFunc: () => void;
      }[];
  childNode?: ReactDOM | ReactDOM[] | string;
  key?: any;
  frontStringNode?: string;
  backStringNode?: string;
  node?: HTMLElement;
}

interface ProviderType {
  store: any;
  reactApp: (() => ReactDOM) | (() => ReactDOM[]);
}

export { ReactType, ReactClosureOptions, ReactDOM, ProviderType };
