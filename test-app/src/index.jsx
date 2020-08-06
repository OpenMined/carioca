import React from 'react';
import { render, hydrate } from 'react-dom';
import App from './App';

const renderMethod = module.hot ? render : hydrate;

renderMethod(<App />, document.getElementById('root'));
