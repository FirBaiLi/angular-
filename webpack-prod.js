
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  devtool: 'source-map',  // 生产环境中使用  inlin--会增加bundle的大小
   plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
     new webpack.DefinePlugin({j6y
       'process.env':{
         'NODE_ENV': JSON.stringify('production')
       }
     })
  ]
});
console.log(merge);