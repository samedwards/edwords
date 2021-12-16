import path from 'path';
import common from './common.webpack';

export default {
  ...common,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].[hash].min.js',
  },
};
