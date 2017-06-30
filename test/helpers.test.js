import * as helpers from '../src/helpers';

jest.mock('../src/constants', () => ({
  REDUCER_KEY: 'ripq'
}));

const bear = { id: 1, name: 'bear' };
const query = 'animal';
const vars = { id: 1 };
const queryId = `animal({\"id\":1})`;
const getState = () => ({
  ripq: {
    queries: {
      [queryId]: { data: 'animal.1' }
    },
    root: { 'animal.1': bear }
  }
});

test('getQueryId creates id string', () => {
  expect(helpers.getQueryId({ query, vars })).toBe(queryId);
});

test('readQuery gets query data', () => {
  expect(helpers.readQuery(getState, query, vars)).toEqual(bear);
});

test('getQueryCachedData gets query data', () => {
  expect(helpers.getQueryCacheData(getState, query, vars)).toEqual({
    data: bear,
    storedQuery: { data: 'animal.1' }
  });
});
