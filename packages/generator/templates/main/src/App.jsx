import React, { useState } from 'react';
import logo from './logo.png';

import './App.css';

export default () => {
  const [value, setValue] = useState(0);

  return (
    <div className="home">
      <div className="home-header">
        <img src={logo} className="home-logo" alt="%APP-NAME%" />
        <h2 className="home-title">Welcome to %APP-NAME%!</h2>
        <span className="home-value">{value}</span>
        <button className="home-button" onClick={() => setValue(value + 1)}>
          Increment
        </button>
      </div>
    </div>
  );
};
