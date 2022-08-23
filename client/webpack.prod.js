const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prodDir = 'build';

module.exports = merge(common, {
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, prodDir),
  },
  devtool: 'hidden-source-map',
  mode: 'production',
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack',
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        removeComments: true,
        useShortDoctype: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
    }),
  ],
});
