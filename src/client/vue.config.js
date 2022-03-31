module.exports = {
  transpileDependencies: true,
  outputDir: '../wwwroot/app',
  filenameHashing: false,
  pages: {
    admin: 'src/admin.js'
  },
  configureWebpack: {
    devtool: 'source-map'
  }
};
