import { REDUCER_KEY } from './constants';

export const getQueryId = ({ query, vars }) => `${query}(${JSON.stringify(vars)})`;

export const readQuery = (getState, query, vars) => {
  const { queries, root } = getState()[REDUCER_KEY];
  const queryId = getQueryId({ query, vars });
  const storedQuery = queries[queryId];

  if (!storedQuery) return;

  return Array.isArray(storedQuery.data)
    ? storedQuery.data.map(id => root[id])
    : root[storedQuery.data];
};

export const getQueryCacheData = (getState, query, vars) => {
  const { queries } = getState()[REDUCER_KEY];
  const queryId = getQueryId({ query, vars });
  const storedQuery = queries[queryId];
  const data = readQuery(getState, query, vars);
  return { storedQuery, data };
};
