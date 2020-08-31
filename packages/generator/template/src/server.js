import fs from 'fs';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { caipirinha } from '@carioca/server';

import App from './App';

const PORT = process.env.PORT;

const createServer = () => {
  const template = fs.readFileSync(process.env.HTML_TEMPLATE, {
    encoding: 'utf-8'
  });

  const assets = JSON.parse(
    fs.readFileSync(process.env.ASSETS_MANIFEST, {
      encoding: 'utf-8'
    })
  );

  return express()
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
        let html = caipirinha(template, assets, markup);

        res.status(200).send(html);
      }
    });
};

export default createServer().listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
