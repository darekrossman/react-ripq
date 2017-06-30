import { QUERY_START, QUERY_SUCCESS, QUERY_SUCCESS_CLIENT, QUERY_FAIL } from './constants';

const initialState = {
  queries: {},
  root: {}
};

const start = (state, action) => {
  return {
    ...state,
    queries: {
      ...state.queries,
      [action.queryId]: {
        ...state.queries[action.queryId],
        loading: true,
        error: undefined
      }
    }
  };
};

// TODO: deep merge new entity data
const success = (state, action) => {
  return {
    ...state,
    queries: {
      ...state.queries,
      [action.queryId]: {
        ...state.queries[action.queryId],
        data: action.resultIds,
        loading: false,
        error: undefined,
        timestamp: new Date()
      }
    },
    root: { ...state.root, ...action.payload }
  };
};

const successClient = (state, action) => {
  return {
    ...state,
    queries: {
      ...state.queries,
      [action.queryId]: {
        ...state.queries[action.queryId],
        loading: false,
        error: undefined,
        timestamp: new Date()
      }
    }
  };
};

const fail = (state, action) => {
  return {
    ...state,
    queries: {
      ...state.queries,
      [action.queryId]: {
        data: undefined,
        loading: false,
        error: action.payload
      }
    }
  };
};

export default (state = initialState, action) => {
  if (action.type === QUERY_START) {
    return start(state, action);
  }

  if (action.type === QUERY_SUCCESS) {
    return success(state, action);
  }

  if (action.type === QUERY_SUCCESS_CLIENT) {
    return successClient(state, action);
  }

  if (action.type === QUERY_FAIL) {
    return fail(state, action);
  }

  return state;
};
