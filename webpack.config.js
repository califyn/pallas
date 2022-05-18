const fs = require('fs');
const path = require('path');

module.exports = env => {
  return {
    mode: env.development ? 'development' : 'production',
    entry: './index.js',
    output: {
      filename: "[name].js"
    },
    devServer: {
      host: 'pallas.athemath.org',
      port: '443',
      server: {
        type: 'https',
        options: {
          key: fs.readFileSync('./secrets/privkey.pem'),
          cert: fs.readFileSync('./secrets/fullchain.pem')
        }
      },
      proxy: {
        '/api': {
          target: 'https://pallas.athemath.org:3000',
          pathRewrite: { '^/api': '' },
        }
      }
    },
    devtool: 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
      ],
    },
  }
}
