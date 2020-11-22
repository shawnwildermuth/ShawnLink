module.exports = {
  outputDir: '../wwwroot/app',
  filenameHashing: false,
  lintOnSave: true,
  pages: {
    admin: 'src/admin.js'
  },
  configureWebpack: {
    devtool: 'source-map'
  }
};
