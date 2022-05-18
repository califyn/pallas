const fs = require('fs');
const path = require('path');

module.exports = env => {
  return {
    mode: env.development ? 'development' : 'production',
    entry: './index.js',
    output: {
      filename: 'bundle.js',
    },
    devServer: {
      host: 'pallas.athemath.org',
      port: '443',
      server: {
        type: 'https',
        options: {
          key: fs.readFileSync('./certs/privkey.pem'),
          cert: fs.readFileSync('./certs/fullchain.pem')
        }
      }
    },
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
