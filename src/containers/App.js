import React from 'react';
import '../styles/App.css';
import { connect } from 'react-redux';
import _ from 'lodash';

import EditItem from './EditItem';

import {
  Alert,
} from 'reactstrap';

import {
  Loading,
  If,
} from './components';

import Login from './Login';
import Products from './Products';


// App är stor, får splitta upp om den t.ex. skulle bli större
class App extends React.PureComponent {


  constructor(props) {
    super(props);

    _.bindAll(this,
      'editItem'
    );

  }

  editItem(item) {
    this.props.dispatch({
      type: 'app:editItem',
      item: this.props.editItem ? '' : item,
    });
  }


  render() {
    return (
      <div className="App">

        <If case={this.props.editItem !== ''}>
          <EditItem />
        </If>

        <div className="App-header">
          <h2>Product library</h2>

          <If case={this.props.products.productsError}>
            <Alert color="danger">
              <strong>Error: </strong>{this.props.products.productsError}
            </Alert>
          </If>

        </div>
        {/*If */ this.props.pageLoading
        /* Then: */
        ? <div>Loading Loading <Loading /></div>
        /* Else : */
        : <div className="main-content">
            {/*If */ !this.props.login.uid /* -> if NOT logged in*/
            /* Then: */
            ? <Login />
            /* Else: */
            : <Products editItem={this.editItem} />
            }
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.get('login').toJSON(),
    products: state.get('products').toJSON(),
    pageLoading: state.get('pageLoading'),
    editItem: state.get('editItem'),
  }
};

const mapDispatchToProps = dispatch => {
  return {
    /* jag kastar bara in hela dispatch */
    dispatch,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
