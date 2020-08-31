// A helper function to add CSS stylesheets to the <head>
const addCSS = (html, style) =>
  html.replace('</head>', `<link rel="stylesheet" href="${style}"></head>`);

// A helper function to add Javascript to the <body>
const addJS = (html, script) =>
  html.replace('</body>', `<script src="${script}" defer></script></body>`);

// A helper function to inject the generated HTML markup into the HTML entrypoint element
const addMarkup = (html, markup) =>
  html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

// A helper function to replace all instances of an href or src attribute with the correct value
// This is necessary for the dev server, which will receive an assets manifest with http://localhost:${PORT + 1} prepended to each asset
// If we don't swap out the attribute values, they will read from the wrong port on the dev server - tricky!
const correctAssetValues = (markup, assets) => {
  const firstAsset = assets.other[0];
  const firstAssetKey = Object.keys(firstAsset)[0];
  const firstAssetValue = firstAsset[firstAssetKey];

  // If the key and the value of the first assets are the same, this is a waste of time
  // Exit before looping and return the markup
  if (`/${firstAssetKey}` === firstAssetValue) return markup;

  // For each asset in the list
  assets.other.forEach((asset) => {
    // Get the key (e.g. /static/media/logo.sdf987ny.png)
    const key = Object.keys(asset)[0];

    // Get the value (e.g. http://localhost:3001/static/media/logo.sdf987ny.png)
    const value = asset[key];

    // For each href and src attribute in the document...
    ['href', 'src'].forEach((attr) => {
      // Find the place where the key exists as the value of the attribute
      const regex = new RegExp(`${attr}=\"([^"]*${key})\"`);

      // And replace it with the correct value
      markup = markup.replace(regex, `${attr}="${value}"`);
    });
  });

  return markup;
};

// caipirinha === a function to prepare the markup to be sent back to the user
// Just a fun name, really - you can rename this as "prepareMarkup" in your head
// https://en.wikipedia.org/wiki/Caipirinha
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
  template = correctAssetValues(template, assets);

  return template;
};
