import { readQuery } from './helpers';

export default store => ({
  ...store,

  /**
   * Retrieves denormalized data from the ripq cache
   */
  readQuery: ({ query, vars }) => readQuery(store.getState, query, vars)
});
