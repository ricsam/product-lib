import React from 'react';
import '../styles/App.css';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Container,
  Row,
  Col,
  Button as BSB,
  ButtonGroup,
  Alert,
  Table
} from 'reactstrap';

const Icon = icon => <i className={"fa fa-" + icon} aria-hidden="true"></i>;
const Loading = <i className="fa fa-cog fa-spin fa-lg" aria-hidden="true"></i>;

class Products extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
  }
  expand(id) {
    this.setState({
      expand: id === this.state.expand ? false : id
    });
  }
  render() {
    const prods = this.props.prods;
    if ( ! prods ) return null;
    return (
      <Table className="product-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>VARIANT</th>
            <th>PRICE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {_.flatten(_.keys(prods).map(id => {
            const {name, variants, price:_price} = prods[id];
            let price = _price,
                variantIds;
            if ( ! _price ) {
              variantIds = _.keys(variants);
              // tar fram type=min/max i variant objektet
              const ext = type => _.at(variants, _[type + 'By'](variantIds, id=>variants[id].price) + ".price")
              // pris ansätts till min_pris - max_pris
              price = `${ext('min')} - ${ext('max')}`;
              console.log(price);
            }
            const rows = [
              (<tr key={id}>
                <td>{name}</td>
                <td>
                  <If case={! _price }>
                    {variantIds.length} <Button className='seamless' onClick={this.expand.bind(this, id)}>{Icon('angle-' + (this.state.expand === id ? 'up' : 'down'))}</Button>
                  </If>
                </td>
                <td>{price} €</td>
                <td></td>
              </tr>)
            ];

            if (this.state.expand === id && variantIds) {
              variantIds.forEach(variantId => {
                rows.push(
                  <tr key={id + '-variant-details-' + variantId}>
                    <td></td>
                    <td>{variants[variantId].name}</td>
                    <td>{variants[variantId].price} €</td>
                    <td></td>
                  </tr>
                );
              });
            }
            
            return rows;
 
          }))}
        </tbody>
      </Table>
    );
  }
}

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

// plattar till koden lite, renderas i App då this.props.uid === ''
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

// Komponent som efterliknar {bool && <Component />} = <If case={bool}><Component /></If>
class If extends React.PureComponent {
  render() {
    if (this.props.case) return <div>{this.props.children}</div>;
    return null;
  }
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    _.bindAll(this, 'login', 'logout');
  }
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
                  <Container fluid>
                    <Row>
                      <Col className='text-right'>
                        <ButtonGroup>
                          <Button>Add product {Icon('plus fa-lg')}</Button>
                          <Button color="danger">Delete account {Icon('close fa-lg')}</Button>
                          <Button
                            color="warning"
                            className='logout'
                            onClick={this.logout}
                            loading={this.props.logoutLoading}
                          >
                            Logout {Icon('power-off fa-lg')}
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                    <Row className='product-row'>
                      <Col>
                        <If case={this.props.productsLoading}>
                          Loading products {Loading}
                        </If>
                        <If case={_.keysIn(this.props.products).length}>
                          <Products prods={this.props.products} />
                        </If>
                      </Col>
                    </Row>
                  </Container>
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
