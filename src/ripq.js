// @flow
import type { ReduxStore, RipqState } from './types';

import { REDUCER_KEY } from './constants';
import React from 'react';
import PropTypes from 'prop-types';
import { runQuery } from './actions';
import { connect } from 'react-redux';
import { getQueryCacheData } from './helpers';

declare type FunctionComponent<A> = (props: A) => ?React$Element<any>;
declare type ClassComponent<D, A, S> = Class<React$Component<D, A, S>>;
declare type Component<A> = FunctionComponent<A> | ClassComponent<any, A, any>;
declare type Fn1<A, B> = (a: A) => B;
declare type HOC<A, B> = Fn1<Component<A>, Component<B>>;

type Options = {
  fetchOnMount: boolean,
  updater: (store: any, query: string, vars: Object, data: any) => mixed,
  name: string
};

type RipqOptions = {
  fetchOnMount?: boolean,
  name?: string,
  updater?: Function
};

type RipqConfig = {
  query: string,
  vars?: Object | ((props: any) => Object),
  options?: RipqOptions | ((props: Object) => RipqOptions)
};

type State = {
  query: string,
  vars: Object,
  options: Options
};

type QueryFn = (vars: Object) => Promise<Object | Array<any> | Error>;

type DataProps = {
  data: {
    [k: string]: any,
    loading: boolean,
    error: Error,
    refetch: QueryFn
  }
};

type Props = {
  ripq: { query: Object, root: Object },
  runQuery: (query: string, vars: Object) => Promise<Object | Array<any> | Error>
};

type Context = {
  store: ReduxStore
};

const ripq = (_config: RipqConfig): HOC<any, any> => (component: Component<any>) => {
  class Ripq extends React.Component {
    props: Props;
    state: State;
    context: Context;
    query: QueryFn;

    static contextTypes = {
      store: PropTypes.object
    };

    constructor(props: Props, context: Context) {
      super(props, context);

      const { query } = _config;

      const defaultOptions = { fetchOnMount: true, updater: () => null, name: query };

      const vars = typeof _config.vars === 'function' ? _config.vars(props) : _config.vars || {};

      const options =
        typeof _config.options === 'function'
          ? { ...defaultOptions, ..._config.options(props) }
          : { ...defaultOptions, ..._config.options };

      this.state = { query, vars, options };
    }

    componentDidMount() {
      if (this.state.options.fetchOnMount) {
        this.query(this.state.vars);
      }
    }

    query = (vars = {}) => {
      const { query, options } = this.state;

      this.setState((state: State) => ({ ...state, vars }));

      return this.props.runQuery(query, vars).then(
        results => {
          options.updater(this.context.store, query, vars, {
            [options.name]: results
          });
          return results;
        },
        (error: Error) => {
          options.updater(this.context.store, query, vars, { error });
          return error;
        }
      );
    };

    render() {
      const { store } = this.context;
      const { query, vars, options } = this.state;
      const { storedQuery = {}, data } = getQueryCacheData(store.getState, query, vars);
      const { ripq, runQuery, ...props } = this.props;
      const dataProps: DataProps = {
        ...props,
        data: {
          [options.name]: data,
          loading: storedQuery.loading,
          error: storedQuery.error,
          refetch: this.query
        }
      };

      return React.createElement(component, dataProps);
    }
  }

  const mapStateToProps = (state: RipqState) => ({ ripq: state[REDUCER_KEY] });
  const container = connect(mapStateToProps, { runQuery });
  const Container = container(Ripq);

  Container.displayName = 'Ripq';

  return Container;
};

export default ripq;
