import fs from 'fs';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';

import App from './App';

const assets = require(process.env.ASSETS_MANIFEST);

const htmlTemplate = fs.readFileSync(process.env.HTML_TEMPLATE, {
  encoding: 'utf-8'
});

const addCSS = (html, style) =>
  html.replace('</head>', `<link rel="stylesheet" href="${style}"></head>`);

const addJS = (html, script) =>
  html.replace('</body>', `<script src="${script}" defer></script></body>`);

const addMarkup = (html, markup) =>
  html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

const server = express()
  .disable('x-powered-by')
  .use(express.static(process.env.PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      let finalHTML = htmlTemplate;

      // Add main CSS
      if (assets.main.css) finalHTML = addCSS(finalHTML, assets.main.css);

      // Add generated markup
      finalHTML = addMarkup(finalHTML, markup);

      // Add runtime, vendors, and main JS
      if (assets.runtime) finalHTML = addJS(finalHTML, assets.runtime.js);
      if (assets.vendors) finalHTML = addJS(finalHTML, assets.vendors.js);
      if (assets.main.js) finalHTML = addJS(finalHTML, assets.main.js);

      res.status(200).send(finalHTML);
    }
  });

export default server.listen(3000, () => {
  console.log('Listening...');
});
