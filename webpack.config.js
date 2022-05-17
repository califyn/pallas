module.exports = env => {
  return {
    mode: env.development ? 'development' : 'production',
    entry: './index.js',
    output: {
      filename: 'bundle.js',
    },
  }
}
