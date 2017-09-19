import React from 'react';
import { shallow } from 'enzyme';
import {
  TooltippedInput
} from '../components';

const TC = props => <div>{props.children}</div>;
const cb = () => {};

describe('<TooltippedInput />', () => {
  it('should render and not crash', () => {
    const wrapper = shallow(
      <TooltippedInput id="test" onChange={cb} case={false}><TC /></TooltippedInput>
    );
  });

  it('should not should display when case is false', () => {
    const wrapper = shallow(
      <TooltippedInput id="test" onChange={cb} case={false}><TC /></TooltippedInput>
    );
    const If = wrapper.childAt(1);
    expect(If.html()).toEqual('');
  });
  it('should display when case is true', () => {
    const wrapper = shallow(
      <TooltippedInput id="test" onChange={cb} case={true}><TC /></TooltippedInput>
    );
    const If = wrapper.childAt(1);
    expect(If.html()).toEqual('<div></div>');
  });
});
