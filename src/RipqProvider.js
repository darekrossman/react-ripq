import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import storeEnhancer from './storeEnhancer';

class RipqProvider extends Component {
  static childContextTypes = {
    ripqClient: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      store: storeEnhancer(props.store)
    };
  }

  getChildContext() {
    return {
      ripqClient: this.props.client
    };
  }

  render() {
    return (
      <Provider store={this.state.store}>
        {this.props.children}
      </Provider>
    );
  }
}

export default RipqProvider;
