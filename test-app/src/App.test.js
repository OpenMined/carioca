import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

test('Homepage should have title', () => {
  const testRenderer = renderer.create(<App />);
  const rootElem = testRenderer.root;

  expect(rootElem.findByProps({ className: 'home-title' }).children).toEqual([
    'Welcome to OM Web Starter'
  ]);
});
