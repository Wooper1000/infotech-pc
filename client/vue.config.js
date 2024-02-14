const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    server:'https',
    allowedHosts:['infotech.wooper.keenetic.link']
  }
})
