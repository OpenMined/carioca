const addCSS = (html, style) =>
  html.replace('</head>', `<link rel="stylesheet" href="${style}"></head>`);

const addJS = (html, script) =>
  html.replace('</body>', `<script src="${script}" defer></script></body>`);

const addMarkup = (html, markup) =>
  html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

const tailorMarkup = (markup, assets) => {
  assets.other.forEach((asset) => {
    const key = Object.keys(asset)[0];
    const value = asset[key];

    ['href', 'src'].forEach((attr) => {
      const regex = new RegExp(`${attr}=\"([^"]*${key})\"`);

      markup = markup.replace(regex, `${attr}="${value}"`);
    });
  });

  return markup;
};

export const caipirinha = (template, assets, markup) => {
  // Add main CSS
  if (assets.main.css) template = addCSS(template, assets.main.css);

  // Add generated markup
  template = addMarkup(template, markup);

  // Add runtime, vendors, and main JS
  if (assets.runtime) template = addJS(template, assets.runtime.js);
  if (assets.vendors) template = addJS(template, assets.vendors.js);
  if (assets.main.js) template = addJS(template, assets.main.js);

  // In dev mode, we need to prefix all assets with the appropriate address
  template = tailorMarkup(template, assets);

  return template;
};
