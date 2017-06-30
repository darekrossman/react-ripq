// @flow
import type { RipqMiddleware } from './types';
import { QUERY_START } from './constants';
import { getQueryCacheData } from './helpers';
import { receivedCachedData, receivedData, receivedQueryError } from './actions';

const middleware: RipqMiddleware = sendQuery => {
  return ({ dispatch, getState }) => next => action => {
    if (action.type !== QUERY_START) {
      return next(action);
    }

    const { query, vars }: { query: string, vars: Object } = action;
    const cachedQuery = getQueryCacheData(getState, query, vars);

    next(action);

    if (cachedQuery.storedQuery) {
      dispatch(receivedCachedData(query, vars));
      return Promise.resolve(cachedQuery.data);
    } else {
      return sendQuery({ query, vars }).then(
        results => {
          dispatch(receivedData(query, vars, results));
          return results;
        },
        error => {
          dispatch(receivedQueryError(query, vars, error));
          return error;
        }
      );
    }
  };
};

export default middleware;
