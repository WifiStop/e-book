const { defineConfig } = require('@vue/cli-service')
const {resolve} = require('path')
const webpack = require('webpack')

module.exports = defineConfig({
  chainWebpack: config => {
    //引入ProvidePlugin
    config.plugin("provide").use(webpack.ProvidePlugin, [{
        $: "jquery",
        jquery: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
    }, ]);
},
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host:'0.0.0.0',
  },
  
  configureWebpack: {

   resolve:{
    alias:{
      '@':resolve('src')
    }
   },
    externals: {
        'vue': 'Vue',
        'element-ui': 'ELEMENT'
    }
}



})
