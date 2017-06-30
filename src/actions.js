// @flow
import { QUERY_START, QUERY_SUCCESS, QUERY_SUCCESS_CLIENT, QUERY_FAIL } from './constants';
import { getQueryId } from './helpers';

type BaseAction<A> = { type: A, queryId: string, query: string, vars: Object };
type RunQueryAction = BaseAction<typeof QUERY_START>;
type ReceivedCachedDataAction = BaseAction<typeof QUERY_SUCCESS_CLIENT>;
type ReceivedDataAction = BaseAction<typeof QUERY_SUCCESS> & {
  payload: any,
  resultIds: Array<string> | string
};
type ReceivedQueryErrorAction = BaseAction<typeof QUERY_FAIL> & { payload: Error };
type QueryArg = string;
type VarsArg = Object;

export const runQuery = (query: QueryArg, vars: VarsArg): RunQueryAction => ({
  type: QUERY_START,
  queryId: getQueryId({ query, vars }),
  query,
  vars
});

export const receivedCachedData = (query: QueryArg, vars: VarsArg): ReceivedCachedDataAction => ({
  type: QUERY_SUCCESS_CLIENT,
  queryId: getQueryId({ query, vars }),
  query,
  vars
});

export const receivedData = (
  query: QueryArg,
  vars: VarsArg,
  payload: { resultIds: Array<string> | string, entities: Object }
): ReceivedDataAction => ({
  type: QUERY_SUCCESS,
  queryId: getQueryId({ query, vars }),
  resultIds: payload.resultIds,
  payload: payload.entities,
  query,
  vars
});

export const receivedQueryError = (
  query: QueryArg,
  vars: VarsArg,
  payload: Error
): ReceivedQueryErrorAction => ({
  type: QUERY_FAIL,
  queryId: getQueryId({ query, vars }),
  query,
  vars,
  payload
});
