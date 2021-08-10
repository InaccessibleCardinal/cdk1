const path = require('path');

module.exports = (ctx) => {
    return {
    mode: 'development',
    entry: {
      'authorizerLambda': './functions/authorizer-lambda/index.ts',
      'helloLambda': './functions/hello-lambda/index.ts',
      'usersLambda': './functions/users-lambda/index.ts'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    target: 'node',
    devtool: false,
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [
        path.join(__dirname, './node_modules')
      ]
    },
    output: {
      filename: '[name]/index.js',
      path: path.join(__dirname, './functions/__dist__/'),
      libraryTarget: 'commonjs2'
    }
  };
};