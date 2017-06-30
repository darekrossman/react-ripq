import { QUERY_START, QUERY_SUCCESS, QUERY_SUCCESS_CLIENT, QUERY_FAIL } from '../src/constants';
import { runQuery, receivedCachedData, receivedData, receivedQueryError } from '../src/actions';

const query = 'animals';
const vars = { type: 'mammal' };
const queryId = `${query}(${JSON.stringify(vars)})`;
const baseAction = { query, vars, queryId };
const payload = {
  resultIds: ['foo'],
  entities: { foo: {} }
};
const errorPayload = new Error('noice');

test('runQuery creates action', () => {
  expect(runQuery(query, vars)).toEqual({ ...baseAction, type: QUERY_START });
});

test('receiveCachedData creates action', () => {
  expect(receivedCachedData(query, vars)).toEqual({ ...baseAction, type: QUERY_SUCCESS_CLIENT });
});

test('receivedData creates action', () => {
  expect(receivedData(query, vars, payload)).toEqual({
    ...baseAction,
    type: QUERY_SUCCESS,
    resultIds: payload.resultIds,
    payload: payload.entities
  });
});

test('receivedQueryError creates action', () => {
  expect(receivedQueryError(query, vars, errorPayload)).toEqual({
    ...baseAction,
    type: QUERY_FAIL,
    payload: errorPayload
  });
});
