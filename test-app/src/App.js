import React from 'react';
import logo from './react.svg';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to OM Web Starter!</h2>
        </div>
      </div>
    );
  }
}

export default App;
