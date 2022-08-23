type StateType = {
  type: string;
  payload: {
    [key: string]: any;
  };
};

interface ActionType {
  type: string;
  payload?: any;
}

type ReducerType = (state: any, action: ActionType) => any;

type Reducers = { [key: string]: ReducerType };

export { StateType, Reducers, ActionType, ReducerType };
