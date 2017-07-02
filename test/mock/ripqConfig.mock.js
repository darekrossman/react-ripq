const ripqConfig = {
  apiPath: 'http://apiPath',
  schema: {
    memes: {
      entity: 'meme',
      endpoint: 'memes',
      method: 'get',
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
    },
    creatememe: {
      entity: 'meme',
      endpoint: 'creatememe',
      method: 'post',
      parameterSchema: {
        id: 'meme-param-schema',
        type: 'object',
        properties: {
          type: {
            required: true,
            default: '',
            type: 'string'
          },
          text: {
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

export default ripqConfig;
