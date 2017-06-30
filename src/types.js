// @flow
type RequestInterceptor = ({
  url: string,
  method: string,
  vars: Object,
  query: string,
  options: Object
}) => {
  vars?: Object,
  options?: Object,
  method?: string,
  url?: string,
  query?: string
};

type ResponseInterceptor = (data: any) => any;

export type RipqMiddleware = (sendQuery: ({ query: string, vars?: Object }) => Promise<any>) => any;

export type RipqQueryVars = { query: string, vars?: Object };

export type RipqClientRequest = (query: string, vars: Object) => Promise<any>;

export type RipqClientSchema = {
  [k: string]: {
    entity: string,
    endpoint: string,
    method: string,
    parameterSchema: {
      id: string,
      type: string,
      properties: {
        [k: string]: {
          required?: boolean,
          type: string,
          default: any
        }
      }
    }
  }
};

export type RipqClientConfig = {
  apiPath: string,
  schema: RipqClientSchema,
  requestInterceptors?: Array<RequestInterceptor>,
  responseInerceptors?: Array<ResponseInterceptor>
};

export type RipqState = {
  [k: string | 'ripq']: {
    queries: {
      [k: string]: {
        data: Array<string> | string,
        error?: Error,
        loading: boolean,
        timestamp: ?string
      }
    },
    root: {
      [k: string]: any
    }
  }
};

export type ReduxStore = {
  dispatch: Function,
  getState: Function,
  readQuery: Function,
  subscribe: Function,
  replaceReducer: Function
};
