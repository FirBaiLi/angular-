/**
 * Created by Bll on 2017/11/29.
 */
const path = require('path');
const htmlWebpakPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
//分文件插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var vendorExtract = new ExtractTextPlugin('vendors/bootstrap.min.css'),
  indexExtract = new ExtractTextPlugin('[name].min.css');
var defaultConfig= {
  entry: function () {
    var entry = {};
    entry['index'] = ['./app/app.js'];
    entry['vendors/angulars'] = ['jquery', 'angular', 'oclazyload', 'angular-ui-router', 'angular-sanitize', 'angular-cache', 'store-js', 'restangular'];
    entry['vendors/bootstraps'] = ['bootstrap-js', 'bootstrap-css'];
    return entry;
  }(),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),  // __dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录
    chunkFilename: '[name].js'
  },
  resolve: {
    root: [
      path.join(__dirname, 'app'),
      path.join(__dirname, 'bower_components'),
      path.join(__dirname, 'node_modules')
    ],
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.es', '.js'],
    alias: {
      'bootstrap-js': 'bootstrap/dist/js/bootstrap.js',
      'bootstrap-css': 'bootstrap/dist/css/bootstrap.css',
      'jquery':path.join(__dirname, 'node_modules/jquery/dist/jquery')
    }
  },
  plugins: [
    vendorExtract,
    indexExtract,
    new webpack.HotModuleReplacementPlugin(),
    // new CleanWebpackPlugin(['dist']), // 每次build前都将dist清空
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors/angulars', 'vendors/bootstraps', 'manifest'],
      filename: '[name].js'
    }),
    new htmlWebpakPlugin({
      pkg: require('./package.json'),
      // svnInfo: svnInfo,
      title: 'angular练习项目',
      // dist: env.dist,
      template: './app/index.htm',
      filename: 'index.html',
      inject: 'body',
      chunksSortMode: 'dependency',
      chunks: ['vendors/angulars', 'vendors/bootstraps', 'index', 'manifest']
      // chunks: ['vendors/angulars', 'index-' + svnInfo.revision, 'manifest-' + svnInfo.revision]
     }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' })
  ],
  module: {
    loaders: [
      {test: /\.css$/, loader: indexExtract.extract('style', 'css')},
      {test: /\.less$/, loader: indexExtract.extract('style', 'css!less')},
      {test: /\.html$/,loader: 'html-loader'},
      {test: /jquery\.js/, loader: 'expose?jQuery!expose?$'},
      {test: /bootstrap\.js/,loader: 'imports?jquery'},
      {test: /\.(png|jpg|gif)$/,loader:'file-loader'},
      {test: /\.(ttf|eot|svg|woff|woff2)/, loader: 'url?name=assets/fonts/[name].[ext]&limit=5120'},

    ]
  }
  /*module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"   // 使用前需要安装 样式加载
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"   // 使用前需要安装 样式加载
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
        //file?name=[path]/[name].[ext]!extract!
      },
      {
        test: /bootstrap\.js/,
        loader: 'imports?jquery'
      }
    ]
  }*/
};
module.exports=defaultConfig;