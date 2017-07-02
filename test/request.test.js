import request from '../src/request';
import ripqConfig from './mock/ripqConfig.mock';

const meme = { id: 1, type: 'dank', test: 'ayyyy lmfao' };
const fetchOptions = { headers: { foo: 'bar' } };
const mockReqInterceptor = jest.fn(({ url, method, vars, query, opts }) => ({
  url: 'intercepted',
  options: fetchOptions
}));
const mockResInterceptor = jest.fn(json => ({ a: json, b: 'foo' }));

window.fetch = jest.fn(async (url, options) => {
  return {
    json: async () => [meme]
  };
});

jest.mock('jsonschema', () => ({
  Validator: () => ({
    validate: (vars, paramSchema) => {
      return { valid: true };
    }
  })
}));

afterEach(() => {
  window.fetch.mockClear();
  mockReqInterceptor.mockClear();
});

describe('request wrapper', () => {
  it('returns an api function', () => {
    const api = request(ripqConfig);
    expect(api).toBeInstanceOf(Function);
  });

  it('fetches GET endpoint with querystring', async () => {
    const api = request(ripqConfig);
    const apiPromiseResponse = api('memes', { type: 'dank' });
    expect(apiPromiseResponse).resolves.toEqual([meme]);
    expect(window.fetch).toHaveBeenCalledWith(
      `${ripqConfig.apiPath}/${ripqConfig.schema.memes.endpoint}?type=dank`,
      {}
    );
  });

  it('fetches POST endpoint with stringified JSON body', async () => {
    const api = request(ripqConfig);
    const newMeme = { type: 'lame', text: 'TFW you thicc lmao' };
    const apiPromiseResponse = api('creatememe', newMeme);
    expect(apiPromiseResponse).resolves.toEqual([meme]);
    expect(window.fetch).toHaveBeenCalledWith(
      `${ripqConfig.apiPath}/${ripqConfig.schema.creatememe.endpoint}`,
      {
        body: JSON.stringify(newMeme)
      }
    );
  });

  it('calls all request interceptors, merges result', () => {
    const memesSchema = ripqConfig.schema.memes;
    const memeVars = { type: 'dank' };
    const api = request({
      ...ripqConfig,
      requestInterceptors: [mockReqInterceptor]
    });
    api('memes', memeVars);
    expect(mockReqInterceptor).toHaveBeenCalledWith({
      query: 'memes',
      method: memesSchema.method,
      url: `${ripqConfig.apiPath}/${memesSchema.endpoint}`,
      vars: memeVars,
      options: {}
    });
    expect(window.fetch).toHaveBeenCalledWith(`intercepted?type=dank`, fetchOptions);
  });

  it('calls all response interceptors, transforms result', async () => {
    const memesSchema = ripqConfig.schema.memes;
    const memeVars = { type: 'dank' };
    const api = request({
      ...ripqConfig,
      responseInterceptors: [mockResInterceptor]
    });
    const response = await api('memes', memeVars);
    expect(mockResInterceptor).toHaveBeenCalledWith([meme]);
    expect(response).toEqual({ a: [meme], b: 'foo' });
  });
});
