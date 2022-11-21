const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  devServer: {
    allowedHosts: ["localhost:3000", "ausleihe.anonymeanonymiker.de"],
  },
});
