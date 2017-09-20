import React from 'react';
import _ from 'lodash';
import uuid from 'uuid/v4';
import {connect} from 'react-redux';
import {Container, Row, Col} from 'reactstrap';
import {ActionButtons, If, Loading} from './components';
import ProductTableComponent from './ProductTableComponent';

class Products extends React.PureComponent {

  constructor(props) {
    super(props);
    _.bindAll(this, 'logout', 'editItem', 'openAddItemModal', 'deleteAccount');

  }

  logout() {
    this.props.dispatch({
      type: "fb:logout",
    });
  }
  editItem(item) {
    this.props.editItem(item);
  }
  openAddItemModal() {
    this.editItem(uuid());
  }
  deleteAccount() {
    if ( ! (this.props.login.credential || this.props.login.loginProvider === 'anon') ) return;
    this.props.dispatch({
      type: 'fb:delete user'
    });
  }


  render() {
    return (
      <Container>
            {/* Knappar: Add product, Delete accout, Logout*/}
        <ActionButtons
          {..._.pick(this.props.login, 'credential', 'loginProvider', 'logoutLoading')}
          logout={this.logout}
          openModal={this.openAddItemModal}
          delete={this.deleteAccount}
        />
        {/* Själva produkttabellen */}
        <Row className='product-grid-row'>
          <Col>
            <If case={this.props.products.productsLoading}>
              Loading products <Loading />
            </If>
            <If case={_.keys(this.props.products.products).length}>
              <ProductTableComponent prods={this.props.products.products} onEdit={this.editItem}/>
            </If>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.get('login').toJSON(),
    products: state.get('products').toJSON()
  };
};

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Products);