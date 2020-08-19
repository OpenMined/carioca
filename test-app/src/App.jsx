import React, { useState } from 'react';
import logo from './openmined.svg';

import './App.css';

export default () => {
  const [value, setValue] = useState(0);

  return (
    <div className="home">
      <div className="home-header">
        <img src={logo} className="home-logo" alt="OpenMined" />
        <h2 className="home-title">
          {value} - Welcome to {process.env.TITLE || 'OM Web Starter'}!
        </h2>
        <button onClick={() => setValue(value + 1)}>Increment</button>
      </div>
    </div>
  );
};
