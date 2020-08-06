import React from 'react';
import logo from './openmined.svg';

import './App.css';

const myNum = 3;

export default () => (
  <div className="home">
    <div className="home-header">
      <img src={logo} className="home-logo" alt="OpenMined" />
      <h2>Welcome to OM Web Starter {myNum}!</h2>
    </div>
  </div>
);
