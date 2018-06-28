import React, { Component } from 'react';
import '../assets/App.css';
import Search from '../containers/Search';

class App extends Component {
  /*
   * Function: render
   * Parameter/s: none
   * Description: The function that renders the page with the
   * corresponding components it returns.
   */
  render() {
    return (
      <Search />
    );
  }
}

export default App;