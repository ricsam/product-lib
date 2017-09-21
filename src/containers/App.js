import React from "react";
import "../styles/App.css";
import { connect } from "react-redux";
import _ from "lodash";
import { createSelector } from "reselect";

import EditItem from "./EditItem";

import { Alert } from "reactstrap";

import { Loading, If } from "./components";

import Login from "./Login";
import Products from "./Products";

// App är stor, får splitta upp om den t.ex. skulle bli större
class App extends React.PureComponent {
  constructor(props) {
    super(props);

    _.bindAll(this, "editItem");
  }

  editItem(item) {
    this.props.dispatch({
      type: "app:editItem",
      item: this.props.editItem ? "" : item
    });
  }

  wef() {}

  render() {
    return (
      <div className="App">
        <If case={this.props.editItem !== ""}>
          <EditItem />
        </If>

        <div className="App-header">
          <h2>Product library</h2>

          <If case={this.props.productsError}>
            <Alert color="danger">
              <strong>Error: </strong>
              {this.props.productsError}
            </Alert>
          </If>
        </div>
        {/*If */ this.props.pageLoading ? (
          /* Then: */
          <div>
            Loading Loading <Loading />
          </div>
        ) : (
          /* Else : */
          <div className="main-content">
            {/*If */ !this.props.uid /* -> if NOT logged in*/ ? (
              /* Then: */
              <Login />
            ) : (
              /* Else: */
              <Products editItem={this.editItem} />
            )}
          </div>
        )}
      </div>
    );
  }
}
const getUID = createSelector(
  state => state.getIn(["login", "uid"]),
  uid => uid
);
const getProductsError = createSelector(
  state => state.getIn(["products", "productsError"]),
  productsError => productsError
);
const getPageLoading = createSelector(
  state => state.get("pageLoading"),
  pageLoading => pageLoading
);
const getEditItem = createSelector(
  state => state.get("editItem"),
  editItem => editItem
);

const mapStateToProps = state => {
  return {
    uid: getUID(state),
    productsError: getProductsError(state),
    pageLoading: getPageLoading(state),
    editItem: getEditItem(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* jag kastar bara in hela dispatch */
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
