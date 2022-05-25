const HtmlWebpackPlugin = require('html-webpack-plugin')

const fs = require('fs');
const path = require('path');

module.exports = env => {
  const dev = {
    mode: 'development',
    devtool: 'eval-source-map'
  }

  const prod = {
    mode: 'production',
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html"
      })
    ]
  }

  const both = {
    entry: './index.js',
    output: {
      path: __dirname + '/dist',
      filename: 'main.js',
      publicPath: "/"
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
      },
      historyApiFallback: true
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

  return {...(env.development ? dev : prod), ...both}
}
