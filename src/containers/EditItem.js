import React from 'react';
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
  Icon,
  TooltippedInput,
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

  constructor(props) {
    super(props);
    _.bindAll(this, 'close', 'update', 'save', 'delete', 'addVariant', 'updatePrice', 'updateName', 'updateVariantName');
    this.state = {
      name: "",
      price: 0
    }
  }

  componentWillMount() {
    if (!this.props.newItem) { // existing item
      this.setState({
        ...this.props.data[this.props.item]
      });
    } else { // new item
      this.setState({
        name: "",
        price: 0
      })
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
    return this.state.name !== "" && ( !this.variants || _.every(_.keys(this.state.variants), id => this.state.variants[id].name !== "" ) );
  }
  delete() {
    this.props.onDelete(this.props.item);
  }
  addVariant() {
    this.setState({
      price: null,
      variants: _.set({...(this.state.variants || {})}, uuid(), {
        name: "",
        price: 0
      }),
    });
  }
  updateName(id, ev) {
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
  updateVariantName(id, ev) {
    this.setState({
      variants: _.set({...this.state.variants}, `${id}.name`, ev.currentTarget.value)
    });
  }
  updateVariantPrice(id, ev) {
    let value = Number(ev.currentTarget.value);
    if ((isNaN(value) || value < 0) && ev.currentTarget.value !== "") value = this.state.variants[id].price;
    this.setState({
      variants: _.set({...this.state.variants}, `${id}.price`, value)
    });
  }
  deleteVariant(id, ev) {
    console.log(id);
    const variants = _.omit(this.state.variants, id)
    if (_.keys(variants).length) {
      this.setState({
        variants,
      });
    } else {
      this.setState({
        variants: null,
        price: this.state.variants[id].price // bibehåll variantpriset när den sista varianten deletas.
      });
    }
  }

  render() {
    /* grab the price in the form of min - max */
    const { price } = util.parseProductProperties(this.state);
    return (
      <Modal isOpen={!!this.props.item} toggle={this.close}>
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
                  case={this.state.name === ""}
                />
              </Col>
              <Col xs="6">
                <Input
                  type="text"
                  name="price"
                  id="price"
                  disabled={this.state.price === null}
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
                  <Col xs="6">
                    <Row className="no-gutters">
                      <Col xs="9">
                        <Input type="text" value={this.state.variants[id].price} onChange={this.updateVariantPrice.bind(this, id)} />
                      </Col>
                      <Col xs="3" className="text-right">
                        <Button color="danger" className="fill" onClick={this.deleteVariant.bind(this, id)}>{Icon('times')}</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )
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
