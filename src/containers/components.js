import React from 'react';
import PropTypes from 'prop-types';
import {Button as BSB, ButtonGroup, Row, Col, UncontrolledTooltip, Input} from 'reactstrap';
import _ from 'lodash'
import { makeAnchorMethods } from './util';

// Komponent som efterliknar {bool && <Component />} = <If case={bool}><Component /></If>
// tar props:
/*
  el=String (=div by default) som elementet runt children
  case=Bool som anger huruvida ovanstående element ska renderas eller ej
*/
export const If = props => props.case
  ? React.createElement(props.el || 'div', null, props.children)
  : null;

/*
  Vanlig bootstrap knapp, men man kan även ange prop loading som anger ifall en Loading FA-icon ska visas eller ej.
  Props:
    loading=Bool
*/
export const Button = ({loading,...props}) => (
  <BSB {...props} outline data-loading={loading}>
    {props.children}{" "}
    {loading && <Loading />}
  </BSB>
);


export const Icon = icon => <i className={"fa fa-" + icon} aria-hidden="true"></i>;
export const Loading = () => <i className="fa fa-cog fa-spin fa-lg" aria-hidden="true"></i>;


export class PassIdButton extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    _.bindAll(this, 'onClick');
  }

  onClick() {
    this.props.onClick(this.props.id);
  }

  render() {
    return (
      <Button
        {...this.props}
        onClick={this.onClick}
      >
        {this.props.children}
      </Button>
    );
  }
}

// används bara för rendering av de tre loggin-knapparna
export class LoginButton extends PassIdButton {

  render() {
    const loading = this.props.loginLoading && this.props.loginProvider === this.props.id;
    return (
      <Button
        onClick={this.onClick}
        loading={loading}
      >
        {this.props.children}
      </Button>
    );
  }
    
}

// renderas i App då this.props.uid === '', dvs not logged in
export const Login = props => (
  <div className="login">
    <h2>Login</h2>
    <ButtonGroup>
      {
        [
          ['Login anonymously', 'anon'],
          ['Login using Github (not enabled)', 'github'],
          ['Login using Google', 'google']
        ].map(([text, id]) => (
          <LoginButton {...props} onClick={props.login} id={id} key={"login-" + id}>
            {text}
          </LoginButton>
        ))
      }
    </ButtonGroup>
  </div>
);

export const ActionButtons = props => (
  <Row>
    <Col className='text-right'>
      <ButtonGroup>
        <Button onClick={props.openModal}>Add product {Icon('plus fa-lg')}</Button>
        <Button
          color="danger"
          id="delete-account"
          onClick={props.delete}
          className={(!props.credential && props.loginProvider !== 'anon') ? "look-disabled" : ''}
        >
          Delete account {Icon('close fa-lg')}
        </Button>

        <If case={!props.credential && props.loginProvider !== 'anon'}>
          <UncontrolledTooltip placement="top" target="delete-account">
            Log out and log in to enable account deletion
          </UncontrolledTooltip>
        </If>

        <Button
          color="warning"
          className='logout'
          onClick={props.logout}
          loading={props.logoutLoading}
        >
          Logout {Icon('power-off fa-lg')}
        </Button>
      </ButtonGroup>
    </Col>
  </Row>
);

export class TooltippedInput extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };


  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this, this.props.id);
  }

  onChange(id, ev) {
    this.props.onChange(ev, id);
  }

  render() {
    return (<div>
    <Input
      type="text"
      id={"TooltippedInput-" + this.props.id}
      onChange={this.onChange}
      {..._.pick(this.props, 'className', 'value')}
    />
    <If case={this.props.case}>
      <UncontrolledTooltip placement="top" target={"TooltippedInput-" + this.props.id}>
        {this.props.children}
      </UncontrolledTooltip>
    </If>
    </div>);
  }
}

export class VariantPriceDeleteControlerRow extends React.PureComponent {
  constructor(props) {
    super(props);

    makeAnchorMethods(this, this.eventHandler, ['onChange', 'onClick'], this.props.id);

  }
  eventHandler(name, ...args) {
    /* args = [id, ev] så jag vänder bara på args här  */
    /* sista argumentet kommer vara event, anroppa e.g. onChange(ev, id) */
    this.props[name](_.last(args), ..._.initial(args));
  }

  render() {
    return (
      <Col xs="6">
        <Row className="no-gutters">
          <Col xs="9">
            <Input
              type="text"
              value={this.props.value}
              onChange={this.onChange} />
          </Col>
          <Col xs="3" className="text-right">
            <Button
              color="danger"
              className="fill"
              onClick={this.onClick}
            >
              {Icon('times')}
            </Button>
          </Col>
        </Row>
      </Col>
    );
  }

}