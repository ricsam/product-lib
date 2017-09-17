import React from 'react';
import '../styles/App.css';
import { connect } from 'react-redux';
import _ from 'lodash';
import uuid from 'uuid/v4';

import EditItem from './EditItem';

import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Alert,
  UncontrolledTooltip
} from 'reactstrap';

import {
  Button,
  Icon,
  Loading,
  Login,
  If
} from './components';

import ProductTable from './ProductTable'


class App extends React.PureComponent {
  constructor(props) {
    super(props);
    _.bindAll(this, 'login', 'logout', 'deleteAccount', 'editItem', 'openAddItemModal', 'addItem','updateItem', 'deleteItem');
    this.state = {
      editItem: false,
      newProds: {},
      deletedProds: [],
      updatedProds: {}
    };
  }
  login(provider) {
    this.props.login(provider);
  }
  logout() {
    this.props.logout();
  }
  deleteAccount() {
    if ( ! (this.props.credential || this.props.loginProvider === 'anon') ) return;
    this.props.dispatch({
      type: 'fb:delete user'
    });
  }
  editItem(item) {
    this.setState({
      editItem: this.state.editItem ? false : item
    });
  }
  openAddItemModal() {
    this.editItem(uuid());
  }
  addItem(id, data) {
    this.props.dispatch({
      type: "fb:upload",
      operation: "add",
      id,
      data,
    });
    this.setState({
      editItem: false
    });
  }
  updateItem(id, data) {
    this.props.dispatch({
      type: "fb:upload",
      operation: "update",
      id,
      data,
    });
    this.setState({
      editItem: false,
    });
  }
  deleteItem(id) {
    this.props.dispatch({
      type: "fb:upload",
      operation: "delete",
      id,
    });
    this.setState({
      editItem: false,
    });
  }
  render() {
    // Visar bara första errorn som dyker upp, men skulle kunna ange varje potentiell error på specifika komponenter 
    const errorMsg = this.props.loginError || 
                     this.props.logoutError ||
                     this.props.addProductError ||
                     this.props.productsError ||
                     this.props.updateProductError ||
                     this.props.removeProductError;

    const prods = _.omit(_.assign({}, this.props.products, this.state.newProds, this.state.updatedProds), this.state.deletedProds);

    return (
      <div className="App">

        {/* Modal som öppnas */}
        <If case={this.state.editItem}>
          <EditItem
            newItem={!_.has(this.props.products, this.state.editItem)/* if it is an already existing item or not*/} 
            item={this.state.editItem}
            onClose={this.editItem /* as the item is undefined this works*/}
            onSave={this.addItem}
            onDelete={this.deleteItem}
            onUpdate={this.updateItem}
            data={this.props.products}
          />
        </If>

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
                          <Button onClick={this.openAddItemModal}>Add product {Icon('plus fa-lg')}</Button>
                          <Button color="danger" id="delete-account" onClick={this.deleteAccount} className={(!this.props.credential && this.props.loginProvider !== 'anon') ? "look-disabled" : ''}>Delete account {Icon('close fa-lg')}</Button>
                          <If case={!this.props.credential && this.props.loginProvider !== 'anon'}>
                            <UncontrolledTooltip placement="top" target="delete-account">
                              Log out and log in to enable account deletion
                            </UncontrolledTooltip>
                          </If>

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
                    <Row className='product-grid-row'>
                      <Col>
                        <If case={this.props.productsLoading}>
                          Loading products {Loading}
                        </If>
                        <If case={_.keys(this.props.products).length}>
                          <ProductTable prods={prods} onEdit={this.editItem.bind(this)}/>
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
    dispatch,
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
