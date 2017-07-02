import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import MockProvider from './mock/MockProvider';
import mockState from './mock/mockState';
import mockStore from './mock/mockStore';
import { runQuery } from '../src/actions';
import { REDUCER_KEY } from '../src/constants';
import ripq from '../src/ripq';

jest.mock('../src/actions', () => {
  const original = require.requireActual('../src/actions');
  return {
    ...original,
    runQuery: jest.fn(() => Promise.resolve('foo'))
  };
});

const component = jest.fn(props => null);

const setup = (options, state) => {
  const store = mockStore(state);
  const hoc = ripq(options);
  const Component = hoc(component);
  const wrapper = mount(
    <MockProvider store={store}>
      <Component />
    </MockProvider>
  );
  return { options, wrapper };
};

const ripqOpts = { query: 'meme', vars: { id: 1 } };

beforeEach(() => {
  component.mockClear();
  runQuery.mockClear();
});

describe('ripq HOC', () => {
  it('should return an HOC given config', () => {
    const hoc = ripq();
    const c = hoc(component);
    expect(c.displayName).toBe('Ripq');
  });

  it('should render base component with props', () => {
    const { wrapper } = setup(ripqOpts, mockState);
    const props = component.mock.calls[0][0];
    expect(props).toMatchObject({
      data: {
        meme: { id: 1, text: 'ayyy' },
        loading: false,
        error: undefined
      }
    });
  });

  it('should rename prop key for data', () => {
    const { wrapper } = setup({ ...ripqOpts, options: { name: 'MEMEZ' } }, mockState);
    const props = component.mock.calls[0][0];
    expect(props.data.MEMEZ).toBeDefined();
  });

  it('should dipatch query action on mount', () => {
    const { wrapper } = setup(ripqOpts, mockState);
    expect(runQuery).toHaveBeenCalledWith('meme', { id: 1 });
  });

  it('should provide a refetch method', () => {
    const { wrapper } = setup(ripqOpts, mockState);
    const props = component.mock.calls[0][0];
    expect(props.data.refetch({ id: 2 })).resolves.toEqual('foo');
    expect(runQuery).toHaveBeenCalledWith('meme', { id: 2 });
  });
});
