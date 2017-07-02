import { REDUCER_KEY } from '../../src/constants';

export default {
  [REDUCER_KEY]: {
    queries: {
      'meme({"id":1})': {
        data: 'meme.1',
        loading: false,
        error: undefined
      }
    },
    root: {
      'meme.1': { id: 1, text: 'ayyy' }
    }
  }
};
