import React from 'react';
import logo from './openmined.svg';

// import './App.css';

export default () => (
  <div className="home">
    <div className="home-header">
      <img src={logo} className="home-logo" alt="OpenMined" />
      <h2 className="home-title">Welcome to {process.env.TITLE || 'OM Web Starter'}!</h2>
    </div>
  </div>
);
