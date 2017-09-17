import React from 'react';
import {Button as BSB, ButtonGroup} from 'reactstrap';

// Komponent som efterliknar {bool && <Component />} = <If case={bool}><Component /></If>
export class If extends React.PureComponent {
  render() {
    if (this.props.case) return React.createElement(this.props.el || 'div', null, this.props.children);
    return null;
  }
}

export class Button extends React.PureComponent {
  render() {
    const props = {
      ...this.props,
    };
    delete props.loading;
    return(
      <BSB {...props} outline>

        {this.props.children}{" "}
        {this.props.loading && Loading}

      </BSB>
    );
  }
}

export const Icon = icon => <i className={"fa fa-" + icon} aria-hidden="true"></i>;
export const Loading = <i className="fa fa-cog fa-spin fa-lg" aria-hidden="true"></i>;


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