import React from 'react';
import { shallow } from 'enzyme';
import EditTable from '../EditItem';
import uuid from 'uuid/v4';

describe('<EditItem />', () => {
  it('should render and not crash', () => {
    const wrapper = shallow(<EditTable item="123" />);
  });

  it('should render the form', () => {
    const wrapper = shallow(<EditTable item="123" />);
    expect(wrapper.find('.form-container').length).toBe(1);
  });

  it('should remove warning when entering text', () => {
    const wrapper = shallow(<EditTable item="someid" />);
    expect(wrapper.find('.form-control-warning').length).toBe(1);
    wrapper.setState({
      name: "a"
    });
    expect(wrapper.find('.form-control-warning').length).toBe(0);
  });
  it('should have the update button disabled when there is no text', () => {
    const wrapper = shallow(<EditTable item="someid" />);
    const footer = wrapper.find(".d-flex.justify-content-between")
    expect(footer.length).toBe(1);
    expect(footer.childAt(0).props().disabled).toEqual(true);
  });
  it('should have the update button enabled when there is text', () => {
    const wrapper = shallow(<EditTable item="someid" />);
    wrapper.setState({
      name: "a"
    });
    const footer = wrapper.find(".d-flex.justify-content-between")
    expect(wrapper.instance().formIsOkey()).toEqual(true);
    expect(footer.childAt(0).props().disabled).toEqual(false);
  });
});
