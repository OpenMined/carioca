import React from 'react';
import { render } from 'react-dom';
import App from './App';

const renderMethod = module.hot ? render : hydrate;

render(<App />, document.getElementById('root'));
