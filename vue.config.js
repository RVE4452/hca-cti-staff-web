const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = {
  runtimeCompiler:true,
  transpileDependencies: [
    'vuetify',
    'slash',
    'cli-service'
  ],
  devServer: {
    https: true
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new NodePolyfillPlugin()
    ],
    resolve: {
      alias: {
        fs: false
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/'
}

