import path from 'path';
import webpack from 'webpack';
import common from './common.webpack';

export default {
  ...common,
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, '../build'),
    port: 3002,
    liveReload: false,
    disableHostCheck: true,
  },
  plugins: [
    ...common.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: false,
      exclude: [/node_modules/],
      test: /\.tsx?($|\?)/i,
    }),
  ],
};
