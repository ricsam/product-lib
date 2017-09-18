import React, { Component } from 'react';
import '../styles/App.css';
import { connect } from 'react-redux';

function testAction(something) {
  return {
    type: 'action',
    data: something
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    console.log(this.props);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Product library</h2>
        </div>
        <p className="App-intro">
          items
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return state.toJSON()
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: id => {
      dispatch(testAction(id))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
