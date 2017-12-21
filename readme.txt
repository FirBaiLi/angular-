使用 npm run build 执行打包
使用 npm start 运行项目


npm的start命令是一个特殊的脚本名称，其特殊性表现在，在命令行中使用npm start就可以执行其对于的命令，
如果对应的此脚本名称不是start，想要在命令行中运行时，需要这样用npm run {script name}如npm run build

项目主要分为五大部分
1、静态资源（图片asset）
2、公共组件（commonPlugin）
   (1)写公共组件时，需要通过.directive指令编写，相当于写了公共的自定义dom，抽象一个自定义组件，供重复使用
   (2)弹框组件中通过.directive和.factory创建自定义组件及服务，可供多处使用
3、控制器部分（script）
4、样式部分(style)
5、模板部分（template）

app.js文件将所有文件引入，并作为入口文件在webpack.common.js中通过webpack打包
生成的页面通过index.htm文件显示，最后将打包文件放在dist文件下

