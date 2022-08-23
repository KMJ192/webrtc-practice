import { ReactDOM } from 'custom_modules/react';

interface RouterType {
  element: (props?: any) => ReactDOM;
  path: string;
  queryString?: boolean;
  exact?: boolean;
}

export type { RouterType };
