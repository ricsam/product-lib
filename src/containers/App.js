import React from 'react';
import '../styles/App.css';
import { connect } from 'react-redux';

import {
  Container,
  Row,
  Col,
  Button as BSB,
  ButtonGroup,
  Alert
} from 'reactstrap';

const Loading = <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>;

class Button extends React.PureComponent {
  render() {
    const props = {
      ...this.props,
    };
    delete props.loading;
    return(
      <BSB {...props}>

        {this.props.children}{" "}
        {this.props.loading && Loading}

      </BSB>
    );
  }
}

// en funktion som plattar till koden lite, används bara för rendering av de tre loggin-knapparna
const loginButton = (ctx, provider) => (
  <Button
    key={provider[1]}
    loading={ctx.props.loginLoading && ctx.props.loginProvider === provider[1]}
    onClick={ctx.login.bind(ctx, provider[1])}
  >
    {provider[0]}
  </Button>
);

const Login = ctx => (
  <div className="login">
    <h2>Login</h2>
    <ButtonGroup>
      {[['Login anonymously', 'anon'],
        ['Login using Github (not enabled)', 'github'],
        ['Login using Google', 'google']].map((p) => loginButton(ctx, p))}
    </ButtonGroup>
  </div>
);

class If extends React.PureComponent {
  render() {
    if (this.props.case) return <div>{this.props.children}</div>;
    return null;
  }
}

class App extends React.PureComponent {
  login(provider) {
    this.props.login(provider);
  }
  logout() {
    this.props.logout();
  }
  render() {
    // Visar bara första errorn som dyker upp, men skulle kunna ange varje potentiell error på specifika komponenter 
    const errorMsg = this.props.loginError || 
                     this.props.logoutError ||
                     this.props.addProductError ||
                     this.props.productsError ||
                     this.props.updateProductError ||
                     this.props.removeProductError;

    return (

      <div className="App">
        <div className="App-header">
          <h2>Product library</h2>

          <If case={errorMsg}>
            <Alert color="danger">
              <strong>Error: </strong>{errorMsg}
            </Alert>
          </If>

        </div>
        <If case={this.props.pageLoading}>
          Loading {Loading}
        </If>
        <If case={!this.props.pageLoading}>
          <Container className="logged-in">
            <Row>
              <Col className="md-12">
                <If case={!this.props.uid}>
                  {Login(this)}
                </If>
                <If case={this.props.uid}>
                  <Button
                    color="danger"
                    className='logout'
                    onClick={this.logout.bind(this)}
                    loading={this.props.logoutLoading}
                  >
                    Logout
                  </Button>
                </If>
              </Col>
            </Row>
          </Container>
        </If>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state.toJSON();
  // return {
  //   uid: state.get('uid'),
  //   pageLoading: state.get('pageLoading')
  // }
};

const mapDispatchToProps = dispatch => {
  return {
    login: loginProvider => {
      dispatch({
        type: "fb:login",
        loginProvider
      });
    },
    logout: () => dispatch({
      type: "fb:logout",
    })
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
