import React from 'react';
import PropTypes from 'prop-types';
import { REDUCER_KEY } from '../../src/constants';

class MockProvider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  };
  getChildContext() {
    return { store: this.props.store };
  }
  render() {
    return this.props.children;
  }
}

export default MockProvider;
