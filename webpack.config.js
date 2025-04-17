const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/app.ts',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // 关键配置：将所有依赖打包进bundle
  externalsPresets: { node: true },
  node: {
    __dirname: false,
    __filename: false
  },
  optimization: {
    minimize: false // 保持代码可读性
  }
};