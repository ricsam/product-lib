import React from 'react';
import { shallow } from 'enzyme';
import EditItemComponent from '../EditItemComponent';
import uuid from 'uuid/v4';

const getChildAt = (wrapper, ...pos) => {
  let base = wrapper;
  for (let i = 0; i < pos.length; i++) {
    base = base.childAt(pos[i]);
  }
  return base;
};

describe('<EditItem />', () => {
  it('should render and not crash', () => {
    const wrapper = shallow(<EditItemComponent item="123" />);
  });

  it('should render the form', () => {
    const wrapper = shallow(<EditItemComponent item="123" />);
    expect(wrapper.find('.form-container').length).toBe(1);
  });

  it('should remove warning when entering text', () => {
    const wrapper = shallow(<EditItemComponent item="someid" />);
    expect(wrapper.find('.form-control-warning').length).toBe(1);
    wrapper.setState({
      name: "a"
    });
    expect(wrapper.find('.form-control-warning').length).toBe(0);
  });
  it('should have the update button disabled when there is no text', () => {
    const wrapper = shallow(<EditItemComponent item="someid" />);
    const footer = wrapper.find(".d-flex.justify-content-between")
    expect(footer.length).toBe(1);
    expect(footer.childAt(0).props().disabled).toEqual(true);
  });
  it('should have the update button enabled when there is text', () => {
    const wrapper = shallow(<EditItemComponent item="someid" />);
    wrapper.setState({
      name: "a"
    });
    const footer = wrapper.find(".d-flex.justify-content-between")
    expect(wrapper.instance().formIsOkey()).toEqual(true);
    expect(footer.childAt(0).props().disabled).toEqual(false);
  });

  it('should display an input fields when a variant is added', () => {
    const wrapper = shallow(<EditItemComponent item="d" />);
    expect(wrapper.childAt(1).childAt(0).children().length).toBe(5);
    wrapper.instance().addVariant();
    expect(wrapper.childAt(1).childAt(0).children().length).toBe(6);
  });

  it('should delete the added variant when a variant is deleted', () => {
    const wrapper = shallow(<EditItemComponent item="d" />);
    expect(wrapper.childAt(1).childAt(0).children().length).toBe(5);
    wrapper.instance().addVariant();
    wrapper.instance().deleteVariant();
    expect(wrapper.childAt(1).childAt(0).children().length).toBe(6);
  });
  /* clicks */
  it('should call addVariant when the button is pressed', () => {
    const wrapper = shallow(<EditItemComponent item="d" />);
    const button = getChildAt(wrapper, 1, 0, 4, 0, 0);
    wrapper.instance().addVariant();
    button.simulate('click');
    expect(wrapper.childAt(1).childAt(0).children().length).toBe(7);
  });
});
