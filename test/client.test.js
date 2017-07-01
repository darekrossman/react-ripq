import Client from '../src/client';

const meme = { id: 1, test: 'ayyyy lmfao' };
const mockRequest = jest.fn(() => Promise.resolve(meme));

jest.mock('../src/middleware', () => {
  return jest.fn(queryFn => 'foo');
});

jest.mock('../src/request', () => config => mockRequest);

jest.mock('../src/reducer', () => 'foo');

const config = {
  apiPath: 'http://apiPath/',
  schema: {
    memes: {
      entity: 'meme',
      endpoint: 'memes',
      method: 'post',
      parameterSchema: {
        id: 'meme-param-schema',
        type: 'object',
        properties: {
          type: {
            required: true,
            default: '',
            type: 'string'
          }
        }
      }
    }
  },
  requestInterceptors: [],
  responseInerceptors: []
};

describe('RipqClient', () => {
  it('returns RipqClient instance', () => {
    const client = new Client(config);
    expect(client).toBeInstanceOf(Client);
  });

  it('configures new request client', () => {
    const client = new Client(config);
    expect(client.request).toEqual(mockRequest);
  });

  it('contructs an api map', () => {
    const client = new Client(config);
    expect(client.api).toHaveProperty('memes');
  });

  it('provides middleware', () => {
    const client = new Client(config);
    expect(client.middleware()).toEqual('foo');
  });

  it('provides reducer', () => {
    const client = new Client(config);
    expect(client.reducer()).toEqual('foo');
  });

  it('queries api and returns normalized data', async () => {
    const client = new Client(config);
    await expect(client.query({ query: 'memes', vars: { type: 'dank' } })).resolves.toEqual({
      entities: { 'meme.1': meme },
      resultIds: 'meme.1'
    });
  });

  it('queries api and throws caught error', async () => {
    const client = new Client(config);
    await expect(client.query({ query: 'fuck', vars: { type: 'dank' } })).rejects.toBeInstanceOf(
      Error
    );
  });
});
