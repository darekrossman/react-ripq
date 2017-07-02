import { QUERY_START, QUERY_SUCCESS, QUERY_SUCCESS_CLIENT, QUERY_FAIL } from '../src/constants';
import reducer from '../src/reducer';

window.Date.now = function() {
  return 'foo';
};

const queryId = 'foo.1';

describe('reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual({ queries: {}, root: {} });
  });

  it('should return updated state on query start', () => {
    const state = reducer(undefined, {
      type: QUERY_START,
      queryId
    });
    expect(state).toEqual({
      queries: { [queryId]: { loading: true, error: undefined } },
      root: {}
    });
  });

  it('should return updated state on query success', () => {
    const state = reducer(undefined, {
      type: QUERY_SUCCESS,
      queryId,
      payload: { [queryId]: { id: 1, name: 'foo' } },
      resultIds: 1
    });
    expect(state).toEqual({
      queries: {
        [queryId]: {
          data: 1,
          error: undefined,
          loading: false,
          timestamp: 'foo'
        }
      },
      root: { [queryId]: { id: 1, name: 'foo' } }
    });
  });

  it('should return updated state on cached query success', () => {
    const state = reducer(undefined, {
      type: QUERY_SUCCESS_CLIENT,
      queryId
    });
    expect(state).toEqual({
      queries: { 'foo.1': { error: undefined, loading: false, timestamp: 'foo' } },
      root: {}
    });
  });

  it('should return updated state on query failure', () => {
    const state = reducer(undefined, {
      type: QUERY_FAIL,
      queryId,
      payload: { message: 'error!' }
    });
    expect(state).toEqual({
      queries: { 'foo.1': { error: { message: 'error!' }, loading: false } },
      root: {}
    });
  });
});
