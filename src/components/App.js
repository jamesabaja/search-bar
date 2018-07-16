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
      <div>
        <nav className="navbar is-fixed-top" aria-label="main navigation">
          <div className="navbar-brand">
            <a className='navbar-item' href='/'>
              <img src='https://s3-ap-southeast-1.amazonaws.com/data.medgrocer.com/public/logo/mgsolo_teal.png' height='700' width='200' alt=''/>
            </a>
          </div>
          <div className='navbar-menu'>
            <div className='navbar-end'>
              <a className='navbar-item'>
                Search
              </a>
              <a className='navbar-item'>
                Savings Calculator
              </a>
              <a className='navbar-item'>
                About
              </a>
              <a className='navbar-item'>
                Help
              </a>
              <a className='navbar-item'>
                Contact Us
              </a>
              <a className='navbar-item'>
                Blog
              </a>
              <div className='navbar-item'>
                <p className='button is-primary'>Sign In</p>
              </div>
            </div>
          </div>
        </nav>
        <Search />
      </div>
    );
  }
}

export default App;