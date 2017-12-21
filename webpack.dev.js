/**
 * Created by HuJunjie on 2017/11/29.
 */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge(common,{  // 将common配置和dev配置合并
  devtool: 'inline-source-map',   // debug模式 webpack版本较高时，可以设置自动启动，但是更换到1.X的版本后 需要用插件才启动
  devServer: {   // 构建本地服务器
    contentBase: '/dist',
    inline: true, // 设置为true，当源文件改变时会自动刷新页面
    hot: true
  }
})