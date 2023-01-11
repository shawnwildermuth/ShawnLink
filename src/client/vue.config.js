module.exports = {
  transpileDependencies: true,
  outputDir: '../wwwroot/app',
  filenameHashing: false,
  pages: {
    admin: {
      entry: 'src/admin.js',
      title: "Shawn Links"
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
};
