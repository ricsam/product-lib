import React from 'react';
import {Button as BSB, ButtonGroup, Row, Col, UncontrolledTooltip, Input} from 'reactstrap';
import _ from 'lodash'

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
  <BSB {...props} outline>
    {props.children}{" "}
    {props.loading && Loading}
  </BSB>
);

export const Icon = icon => <i className={"fa fa-" + icon} aria-hidden="true"></i>;
export const Loading = () => <i className="fa fa-cog fa-spin fa-lg" aria-hidden="true"></i>;


// en funktion som plattar till koden lite, används bara för rendering av de tre loggin-knapparna
export const loginButton = (ctx, provider) => (
  <Button
    key={provider[1]}
    loading={ctx.props.loginLoading && ctx.props.loginProvider === provider[1]}
    onClick={ctx.login.bind(ctx, provider[1])}
  >
    {provider[0]}
  </Button>
);

// plattar till koden lite, renderas i App då this.props.uid === ''
export const Login = ctx => (
  <div className="login">
    <h2>Login</h2>
    <ButtonGroup>
      {[['Login anonymously', 'anon'],
        ['Login using Github (not enabled)', 'github'],
        ['Login using Google', 'google']].map((p) => loginButton(ctx, p))}
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

  constructor(props) {
    super(props);
    this.change = this.change.bind(this, this.props.id);
  }

  change(id, ev) {
    this.props.onChange(id, ev);
  }

  render() {
    return (<div>
    <Input
      type="text"
      id={"TooltippedInput-" + this.props.id}
      onChange={this.change}
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
