// @flow
import type {
  RipqClientConfig,
  RipqClientSchema,
  RipqClientRequest,
  RipqQueryVars,
  RipqMiddleware
} from './types';
import normalize from './normalize';
import middleware from './middleware';
import reducer from './reducer';
import request from './request';

class Client {
  apiPath: string;
  schema: RipqClientSchema;
  request: RipqClientRequest;
  api: {
    [k: string]: (vars?: Object) => Promise<any>
  };

  constructor(config: RipqClientConfig) {
    this.schema = config.schema;
    this.apiPath = config.apiPath;
    this.request = request(config);
    this.api = Object.keys(this.schema).reduce((acc, query) => {
      return {
        ...acc,
        [query]: async vars => await this.request(query, vars)
      };
    }, {});
  }

  middleware() {
    return middleware(this.query);
  }

  reducer() {
    return reducer;
  }

  query = async ({ query, vars }: RipqQueryVars): Promise<any> => {
    try {
      const apiFn = this.api[query];
      if (typeof apiFn !== 'function') {
        throw new Error(`Query '${query}' not found. Check the api methods provided RipqClient.`);
      }
      const results = await apiFn(vars);
      return normalize(query, this.schema, results);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default Client;
