import React from 'react';
import {connect} from 'react-redux';

import _ from 'lodash';

import {
  Login as LoginComponent,
} from './components';

class Login extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  login() {}

  render() {
    return (
      <LoginComponent
        loginLoading={this.props.loginLoading}
        loginProvider={this.props.loginProvider}
        login={this.login}
      />
    );
  }

}

const mapStateToProps = (state) => {
  return (
    state.get('login').toJSON()
  );
};

const mapDispatchToProps = (dispatch) => {
  return (
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);


