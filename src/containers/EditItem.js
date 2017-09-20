import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import EditItemComponent from './EditItemComponent';

class EditItem extends React.PureComponent {

  constructor(props) {
    super(props);

    _.bindAll(this,
      'addItem',
      'updateItem',
      'deleteItem',
      'editItem'
    );

  }
  editItem(item) {
    this.props.dispatch({
      type: 'app:editItem',
      item: this.props.editItem ? '' : item,
    });
  }

  addItem(id, data) {
    this.props.dispatch({
      type: "fb:upload",
      operation: "add",
      id,
      data,
    });
  }
  updateItem(id, data) {
    this.props.dispatch({
      type: "fb:upload",
      operation: "update",
      id,
      data,
    });
  }
  deleteItem(id) {
    this.props.dispatch({
      type: "fb:upload",
      operation: "delete",
      id,
    });
  }
  render() {
    return (
      <EditItemComponent
        newItem={!_.has(this.props.products.products, this.props.editItem)/* if it is an already existing item or not*/}
        item={this.props.editItem}
        onClose={this.editItem /* as the item is undefined this works*/}
        onSave={this.addItem}
        onDelete={this.deleteItem}
        onUpdate={this.updateItem}
        data={this.props.products.products}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.get('products').toJSON(),
    editItem: state.get('editItem'),
  };
};

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);