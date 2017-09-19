import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap';


import {
  Button,
  TooltippedInput,
  VariantPriceDelteControlerRow
} from './components';

import _ from 'lodash';
import * as util from './util';

/*

  EditItem är bara en stor komponent som renderar en Form in en Modal.
  Props:
    newItem -> Om produkten är ny eller ej,
               dvs om !_.has(products, item) i App.js,
               Finns som property för att komponenten ska renderas vid nytt item.
    item -> En UUID på produkten som ska editas
    onClose -> func
    onSave -> func
    onDelete -> func
    onUpdate -> func
    data -> Alla produkter 

*/



class EditItem extends React.PureComponent {

  static propTypes = {
    item: PropTypes.string.isRequired,
    newItem: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
    data: PropTypes.object,
  };


  constructor(props) {
    super(props);

    _.bindAll(this,
      'close',
      'update',
      'save',
      'delete',
      'addVariant',
      'deleteVariant',
      'updatePrice',
      'updateName',
      'updateVariantName',
      'updateVariantPrice'
    );

    if (_.has(props, 'newItem') && !props.newItem) { // not new item, AKA: existing item.
      // Set the product data as state.
      this.state = {
        ...props.data[props.item]
      };
    } else { // new item
      this.state = {
        name: '',
        price: 0
      };
    }
  }

  close() {
    this.props.onClose();
  }
  update() {
    this.props.onUpdate(this.props.item, this.state);
  }
  save() {
    this.props.onSave(this.props.item, this.state);
  }
  formIsOkey() {
    return (
      /* formIsOkey return TRUE if product name !== '' */
      this.state.name !== ''
      /* and... */
      &&
      (    /* if variants does not exist... */
                    !this.state.variants
        || /* or in case **every** variant name !== '' */
        _.every(_.keys(this.state.variants), id => this.state.variants[id].name !== '' )
      )
    );
  }
  delete() {
    this.props.onDelete(this.props.item);
  }
  addVariant() {
    this.setState((prevState, props) => ({
      /* by setting price to null it will be deleted from firebase DB
         and thus replaced by the price given in the variants */
      price: null,
      variants: _.set({...(this.state.variants || {})}, uuid(), {
        name: '',
        price: 0
      }),
    }));
  }
  updateName(ev, id) {
    const name = ev.currentTarget.value;
    this.setState({
      name
    });
  }
  updatePrice(ev) {
    const price = Number(ev.currentTarget.value);
    this.setState({
      price
    });
  }
  updateVariantName(ev, id) {
    const name = ev.currentTarget.value;
    this.setState((prevState, props) => ({
      variants: _.set({...this.state.variants}, `${id}.name`, name)
    }));
  }
  updateVariantPrice(ev, id) {
    const textVal = ev.currentTarget.value;
    let value = Number(textVal);
    this.setState((prevState, props) => {
      if ((isNaN(value) || value < 0) && textVal !== '') value = prevState.variants[id].price;
      return {
        variants: _.set({...prevState.variants}, `${id}.price`, value)
      };
    });
  }
  deleteVariant(ev, id) {
    this.setState((prevState, props) => {
      const variants = _.omit(prevState.variants, id);
      if (_.keys(variants).length) {
        return { variants };
      } else {
        return {
          variants: null,
          price: prevState.variants[id].price // bibehåll variantpriset när den sista varianten deletas.
        };
      }
    });
  }

  render() {
    /* grab the price in the form of min - max */
    const { price } = util.parseProductProperties(this.state);
    return (
      <Modal isOpen={true} toggle={this.close}>
        <ModalHeader toggle={this.close}>
          <Container>
            {this.props.newItem ? 'Adding' : 'Editing'} product
          </Container>
        </ModalHeader>
        <ModalBody>
          <Container className="form-container">
            <Row label>
              <Col xs="6">Name</Col>
              <Col xs="6">Price</Col>
            </Row>
            <Row>
              <Col xs="6">
                <TooltippedInput
                  id={"item-" + this.state.item}
                  className={this.state.name === '' ? 'form-control-warning' : ''}
                  value={this.state.name}
                  onChange={this.updateName}
                  case={this.state.name === ''}
                >
                  The name cannot be empty
                </TooltippedInput>
              </Col>
              <Col xs="6">
                <Input
                  type="text"
                  name="price"
                  id="price"
                  disabled={this.state.price === null || !_.has(this.state, 'price')}
                  value={price}
                  onChange={this.updatePrice}
                />
              </Col>
            </Row>
            <Row className="form-separator">
              <Col>
                <h5>Variants</h5>
              </Col>
            </Row>
            <Row>
              <Col xs="6">Variant name</Col>
              <Col xs="6">Variant price</Col>
            </Row>
            {this.state.variants && _.keys(this.state.variants).map(id => {
              return (
                <Row key={id} className="form-spacing">
                  <Col xs="6">
                    <TooltippedInput
                      id={id}
                      className={this.state.variants[id].name === '' ? 'form-control-warning' : ''}
                      value={this.state.variants[id].name}
                      onChange={this.updateVariantName}
                      case={this.state.variants[id].name === ''}
                    >
                      The name cannot be empty
                    </TooltippedInput>
                  </Col>
                  <VariantPriceDelteControlerRow
                    id={id}
                    value={this.state.variants[id].price}
                    onChange={this.updateVariantPrice}
                    onClick={this.deleteVariant}
                  />
                </Row>
              );
            })}
            <Row className="form-spacing">
              <Col>
                <Button color="success" block onClick={this.addVariant}>Add variant</Button>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Container className="d-flex justify-content-between">
            <Button
              color="primary"
              disabled={!this.formIsOkey()}
              onClick={this.props.newItem ? this.save : this.update}
            >
              {this.props.newItem ? 'Save' : 'Update'}
            </Button>

            <Button
              color="danger"
              onClick={this.props.newItem ? this.close : this.delete}
            >
              {this.props.newItem ? 'Cancel' : 'Delete'}
            </Button>

          </Container>
        </ModalFooter>
      </Modal>      

    );
  }

}


export default EditItem
