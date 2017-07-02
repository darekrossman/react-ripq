// @flow
import type { RipqClientConfig, RipqClientRequest } from './types';
import qs from 'querystring';
import { Validator } from 'jsonschema';

type RequestConfig = {
  vars: Object,
  options: Object,
  method: string,
  url: string,
  query: string
};

const validator = new Validator();

const defaultOptions: RipqClientConfig = {
  schema: {},
  apiPath: '',
  requestInterceptors: [],
  responseInterceptors: []
};

type Request = (options: RipqClientConfig) => RipqClientRequest;

const request: Request = _opts => {
  const opts = {
    ...defaultOptions,
    ..._opts
  };

  const send = async (url: string, fetchOptions: Object): any => {
    const response = await fetch(url, {
      ...fetchOptions
    });
    const responseJson = await response.json();
    const json = opts.responseInterceptors.reduce((acc, i) => {
      return i(acc);
    }, responseJson);
    return json;
  };

  const _fetch = {
    get: async (url: string, vars: Object, fetchOptions: Object): any => {
      return await send(`${url}?${qs.stringify(vars)}`, {
        ...fetchOptions
      });
    },
    post: async (url: string, vars: Object, fetchOptions: Object): any => {
      return await send(url, {
        ...fetchOptions,
        body: JSON.stringify(vars)
      });
    }
  };

  const api = (query, vars = {}) => {
    const querySchema = opts.schema[query];

    const url = `${opts.apiPath}/${querySchema.endpoint}`;
    const method = querySchema.method;
    const options = {};
    const reqConfig: RequestConfig = opts.requestInterceptors.reduce(
      (acc, i) => {
        return Object.assign({}, acc, i({ ...acc }));
      },
      { url, method, vars, query, options }
    );

    // TODO: enhance variable validation, move to util area
    if (reqConfig.vars) {
      const validation = validator.validate(reqConfig.vars, querySchema.parameterSchema);
      if (!validation.valid) {
        validation.errors.forEach(e => {
          // TODO: look into env vars
          if (process.env.NODE_ENV === 'development' || true) {
            console.warn(
              ` Ripq received invalid query vars\n  [${query}]: ${e.stack.replace('instance.', '')}`
            );
          }
        });
      }
    }

    return _fetch[reqConfig.method](reqConfig.url, reqConfig.vars, reqConfig.options);
  };

  return api;
};

export default request;
