module.exports = (api) => {
  const isTest = api.env('test');

  return {
    presets: [
      isTest
        ? [
            '@babel/preset-env',
            {
              targets: {
                node: 'current'
              }
            }
          ]
        : ['@babel/preset-env', { modules: false }],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      [
        '@babel/plugin-proposal-class-properties',
        {
          loose: true
        }
      ],
      [
        '@babel/plugin-proposal-object-rest-spread',
        {
          useBuiltIns: true
        }
      ],
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-runtime'
    ]
  };
};
