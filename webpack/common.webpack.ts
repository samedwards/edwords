import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: {
    app: path.resolve(__dirname, '../src/edwords.tsx'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|otf)$/,
        use: 'url-loader?limit=100000',
      },
      {
        test: /\.svg?$/,
        exclude: /node_modules/,
        use: {
          loader: 'react-svg-loader',
          options: { tsx: true },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@edwords': path.resolve(__dirname, '../src/client'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
