const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    open: true,
    allowedHosts: [
      'localhost:3000',
      '.anonymeanonymiker.de'
    ],
  }
})
