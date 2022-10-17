const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    port:3000,
    host:'0.0.0.0'
  },
  css: {
    loaderOptions: {
      css: {
        modules: {
          auto: () => true
        }
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
}
)
