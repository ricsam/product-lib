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
  Label,
  Input,
  UncontrolledTooltip
} from 'reactstrap';


import {
  Button,
  Icon,
  If
} from './components';

import _ from 'lodash';
import * as util from './util';


class EditItem extends React.Component {

  constructor(props) {
    super(props);
    _.bindAll(this, 'close', 'update', 'save', 'delete', 'addVariant', 'updatePrice', 'updateName');

    this.state = {
      name: "",
      price: 0
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
  updateName(ev) {
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
              <Col xs="6"><Label for="name" xs="6">Name</Label></Col>
              <Col xs="6"><Label for="price" xs="6">Price</Label></Col>
            </Row>
            <Row>
              <Col xs="6">
                <Input type="text" id={"item-" + this.state.item} className={(this.state.name === "" ? 'form-control-warning' : '')} onChange={this.updateName} value={this.state.name} />
                <If case={this.state.name === ""}>
                  <UncontrolledTooltip placement="top" target={"item-" + this.state.item}>
                    The name cannot be empty
                  </UncontrolledTooltip>
                </If>
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
            <Row label>
              <Col xs="6">Variant name</Col>
              <Col xs="6">Variant price</Col>
            </Row>
            {this.state.variants && _.keys(this.state.variants).map(id => {
              return (
                <Row key={id} className="form-spacing">
                  <Col xs="6">
                    <Input type="text" id={"variant-" + id} className={(this.state.variants[id].name === "" ? 'form-control-warning' : '')} value={this.state.variants[id].name} onChange={this.updateVariantName.bind(this, id)} />
                    <If case={this.state.variants[id].name === ""}>
                      <UncontrolledTooltip placement="top" target={"variant-" + id}>
                        The name cannot be empty
                      </UncontrolledTooltip>
                    </If>
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
