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
    _.bindAll(this, 'login', 'logout', 'editItem', 'addItem', 'saveItem','updateItem', 'deleteItem');
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
  editItem(item) {
    this.setState({
      editItem: this.state.editItem ? false : item
    });
  }
  addItem() {
    this.editItem(uuid());
  }
  saveItem(id, data) {
    this.props.dispatch({
      type: "fb:add product",
      id,
      data,
    });
    this.setState({
      newProds: _.set({...this.state.newProds}, id, data),
      editItem: false
    });
  }
  updateItem(id, data) {
    this.props.dispatch({
      type: "fb:edit product",
      id,
      data,
    });
    this.setState({
      updatedProds: _.set({...this.state.updatedProds}, id, data),
      editItem: false,
    });
  }
  deleteItem(id) {
    this.props.dispatch({
      type: "fb:delete product",
      id,
    });
    this.setState({
      deletedProds: ([id]).concat(this.state.deletedProds),
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

        <If case={this.state.editItem}>
          <EditItem
            newItem={!_.has(this.props.products, this.state.editItem)/* if it is an already existing item or not*/} 
            item={this.state.editItem}
            onClose={this.editItem /* as the item is undefined this works*/}
            onSave={this.saveItem}
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
                          <Button onClick={this.addItem}>Add product {Icon('plus fa-lg')}</Button>
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
