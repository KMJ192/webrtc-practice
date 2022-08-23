const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      config: path.resolve(__dirname, 'postcss.config.js'),
    },
  },
};

module.exports = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@react': path.resolve(__dirname, 'custom_modules/react'),
      '@router': path.resolve(__dirname, 'custom_modules/router'),
      '@api': path.resolve(__dirname, 'custom_modules/api'),
      '@redux': path.resolve(__dirname, 'custom_modules/redux'),
      '@storage': path.resolve(__dirname, 'custom_modules/storage'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/i,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        oneOf: [
          {
            test: /\.module\.s[ac]ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                },
              },
              postcssLoader,
              'sass-loader',
            ],
            exclude: /node_modules/,
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              postcssLoader,
              'sass-loader',
            ],
            exclude: /node_modules/,
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { import: true },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
};
