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

export default express()
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

      // Add CSS
      if (assets.client.css) {
        finalHTML = finalHTML.replace(
          '</head>',
          `<link rel="stylesheet" href="${assets.client.css}"></head>`
        );
      }

      // Add generated markup
      finalHTML = finalHTML.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

      // Add JS
      finalHTML = finalHTML.replace(
        '</body>',
        `<script src="${assets.runtime.js}" defer></script>
        <script src="${assets.vendors.js}" defer></script>
        <script src="${assets.client.js}" defer></script></body>`
      );

      res.status(200).send(finalHTML);
    }
  });
